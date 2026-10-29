"""Settings read from environment variables."""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    gemini_api_key: str | None
    gemini_model: str
    cors_origins: tuple[str, ...]
    history_window: int


@lru_cache
def get_settings() -> Settings:
    origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
    return Settings(
        gemini_api_key=os.getenv("GEMINI_API_KEY") or None,
        gemini_model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        cors_origins=tuple(o.strip() for o in origins.split(",") if o.strip()),
        history_window=int(os.getenv("CHAT_HISTORY_WINDOW", "10")),
    )
