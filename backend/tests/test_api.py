from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.curriculum import CURRICULUM
from app.llm import LLMUnavailableError
from app.main import app, get_llm


class FakeLLM:
    def __init__(self, fail: bool = False) -> None:
        self.prompts: list[str] = []
        self.fail = fail

    def complete(self, prompt: str) -> str:
        self.prompts.append(prompt)
        if self.fail:
            raise LLMUnavailableError("boom")
        return "fake answer"


@pytest.fixture
def llm() -> FakeLLM:
    return FakeLLM()


@pytest.fixture
def client(llm: FakeLLM):
    app.dependency_overrides[get_llm] = lambda: llm
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_health(client: TestClient) -> None:
    assert client.get("/health").json()["status"] == "ok"


def test_lists_all_topics(client: TestClient) -> None:
    topics = client.get("/api/topics").json()
    assert len(topics) == len(CURRICULUM) == 42
    assert topics[0] == {"id": 1, "title": "Variables & Data Types", "has_exercises": False}


def test_intro_uses_topic_title(client: TestClient, llm: FakeLLM) -> None:
    response = client.post("/api/topics/2/intro")
    assert response.status_code == 200
    assert response.json() == {"message": "fake answer"}
    assert "Basic Data Types" in llm.prompts[0]


def test_unknown_topic_returns_404(client: TestClient) -> None:
    assert client.post("/api/topics/999/intro").status_code == 404


def test_chat_includes_recent_history(client: TestClient, llm: FakeLLM) -> None:
    history = [{"role": "user", "content": "What is a pointer?"}, {"role": "assistant", "content": "An address."}]
    response = client.post("/api/chat", json={"topic_id": 3, "message": "Show an example", "history": history})
    assert response.status_code == 200
    assert "What is a pointer?" in llm.prompts[0]
    assert "Show an example" in llm.prompts[0]


def test_chat_rejects_empty_message(client: TestClient) -> None:
    assert client.post("/api/chat", json={"topic_id": 1, "message": ""}).status_code == 422


def test_exercise_only_for_coding_topics(client: TestClient) -> None:
    assert client.post("/api/exercises", json={"topic_id": 1}).status_code == 409
    assert client.post("/api/exercises", json={"topic_id": 2, "language": "c"}).status_code == 200


def test_submission_review(client: TestClient, llm: FakeLLM) -> None:
    body = {"topic_id": 2, "question": "Add two numbers", "code": "print(1 + 2)", "language": "python"}
    assert client.post("/api/submissions", json=body).status_code == 200
    assert "print(1 + 2)" in llm.prompts[0]


def test_llm_failure_returns_503() -> None:
    app.dependency_overrides[get_llm] = lambda: FakeLLM(fail=True)
    try:
        response = TestClient(app).post("/api/topics/1/intro")
    finally:
        app.dependency_overrides.clear()
    assert response.status_code == 503
