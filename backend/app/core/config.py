from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Two-Dashboard AI Feedback"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    GROQ_API_KEY: Optional[str] = None
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:8000"]

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
