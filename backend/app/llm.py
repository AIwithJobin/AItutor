"""LLM access behind a tiny interface, so routes can be tested with a fake."""

from __future__ import annotations

from typing import Protocol

from .config import Settings
from .prompts import SYSTEM_INSTRUCTION


class LLMUnavailableError(RuntimeError):
    """The model could not be reached or returned no text."""


class TutorLLM(Protocol):
    def complete(self, prompt: str) -> str: ...


class GeminiTutor:
    """Google Gemini via the official google-genai SDK."""

    def __init__(self, settings: Settings) -> None:
        if not settings.gemini_api_key:
            raise LLMUnavailableError("GEMINI_API_KEY is not set")
        from google import genai  # imported lazily so tests run without the SDK configured
        from google.genai import types

        self._client = genai.Client(api_key=settings.gemini_api_key)
        self._model = settings.gemini_model
        self._config = types.GenerateContentConfig(system_instruction=SYSTEM_INSTRUCTION, temperature=0.4)

    def complete(self, prompt: str) -> str:
        try:
            response = self._client.models.generate_content(model=self._model, contents=prompt, config=self._config)
        except Exception as exc:
            raise LLMUnavailableError(str(exc)) from exc
        text = (response.text or "").strip()
        if not text:
            raise LLMUnavailableError("model returned an empty response")
        return text
