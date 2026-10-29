"""FastAPI app for the AI Programming Tutor."""

from __future__ import annotations

import logging
from functools import lru_cache
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from . import __version__, prompts
from .config import get_settings
from .curriculum import CURRICULUM, Topic, get_topic
from .llm import GeminiTutor, LLMUnavailableError, TutorLLM
from .schemas import ChatRequest, ExerciseRequest, MessageOut, SubmissionRequest, TopicOut

logger = logging.getLogger("ai_tutor")
settings = get_settings()

app = FastAPI(title="AI Programming Tutor API", version=__version__)
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@lru_cache
def get_llm() -> TutorLLM:
    try:
        return GeminiTutor(get_settings())
    except LLMUnavailableError as exc:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc


LLM = Annotated[TutorLLM, Depends(get_llm)]


def _topic_or_404(topic_id: int) -> Topic:
    topic = get_topic(topic_id)
    if topic is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=f"Unknown topic id {topic_id}")
    return topic


def _ask(llm: TutorLLM, prompt: str) -> str:
    try:
        return llm.complete(prompt)
    except LLMUnavailableError as exc:
        logger.warning("LLM call failed: %s", exc)
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, detail="The tutor is unavailable, please retry."
        ) from exc


@app.get("/health", tags=["ops"])
def health() -> dict[str, str]:
    return {"status": "ok", "version": __version__}


@app.get("/api/topics", response_model=list[TopicOut], tags=["curriculum"])
def list_topics() -> list[TopicOut]:
    return [TopicOut(id=t.id, title=t.title, has_exercises=t.has_exercises) for t in CURRICULUM]


@app.post("/api/topics/{topic_id}/intro", response_model=MessageOut, tags=["tutor"])
def topic_intro(topic_id: int, llm: LLM) -> MessageOut:
    topic = _topic_or_404(topic_id)
    hint = "- Mention that practice exercises are available for this topic." if topic.has_exercises else ""
    return MessageOut(message=_ask(llm, prompts.INTRO.format(topic=topic.title, exercise_hint=hint)))


@app.post("/api/chat", response_model=MessageOut, tags=["tutor"])
def chat(request: ChatRequest, llm: LLM) -> MessageOut:
    topic = _topic_or_404(request.topic_id)
    recent = request.history[-settings.history_window :]
    history = "\n".join(f"{turn.role.title()}: {turn.content}" for turn in recent) or "(none)"
    prompt = prompts.CHAT.format(topic=topic.title, history=history, message=request.message)
    return MessageOut(message=_ask(llm, prompt))


@app.post("/api/exercises", response_model=MessageOut, tags=["practice"])
def create_exercise(request: ExerciseRequest, llm: LLM) -> MessageOut:
    topic = _topic_or_404(request.topic_id)
    if not topic.has_exercises:
        raise HTTPException(status.HTTP_409_CONFLICT, detail="This topic has no coding exercises")
    return MessageOut(message=_ask(llm, prompts.EXERCISE.format(topic=topic.title, language=request.language)))


@app.post("/api/submissions", response_model=MessageOut, tags=["practice"])
def review_submission(request: SubmissionRequest, llm: LLM) -> MessageOut:
    _topic_or_404(request.topic_id)
    prompt = prompts.REVIEW.format(question=request.question, code=request.code, language=request.language)
    return MessageOut(message=_ask(llm, prompt))
