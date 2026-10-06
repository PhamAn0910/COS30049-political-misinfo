# Role/Owner: Member 1 (Full-Stack & Integration Lead)
# Core Responsibility: Application configuration and runtime environment settings
# Key Interface/Contract: Exports application settings consumed by main.py and service loaders

from pydantic import BaseModel
from typing import List


class Settings(BaseModel):
    app_name: str = "Political Misinformation Detection API"
    app_version: str = "1.0.0"
    cors_origins: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    model_path: str = "backend/models/distilbert_quantized.pt"
    max_text_length: int = 5000
    token_max_length: int = 256


settings = Settings()
