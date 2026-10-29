"""Request/response models with input limits, so prompts stay bounded."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class TopicOut(BaseModel):
    id: int
    title: str
    has_exercises: bool


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=8000)


class ChatRequest(BaseModel):
    topic_id: int
    message: str = Field(min_length=1, max_length=4000)
    history: list[ChatTurn] = Field(default_factory=list, max_length=50)


class ExerciseRequest(BaseModel):
    topic_id: int
    language: Literal["python", "c", "cpp", "java", "javascript"] = "python"


class SubmissionRequest(BaseModel):
    topic_id: int
    question: str = Field(min_length=1, max_length=8000)
    code: str = Field(min_length=1, max_length=20000)
    language: Literal["python", "c", "cpp", "java", "javascript"] = "python"


class MessageOut(BaseModel):
    message: str
