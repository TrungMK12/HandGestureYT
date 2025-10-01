from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    api: str
    base_url: str

    class Config:
        env_file = os.path.join(os.path.dirname(__file__), ".env")
        env_file_encoding = 'utf-8'
        case_sensitive = False

settings = Settings()