from functools import lru_cache

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.constants import DEFAULT_CATEGORIES, DEFAULT_COUNTRY, DEFAULT_TOWNS


class Settings(BaseSettings):
    app_name: str = "hxp.digital Lead Engine API"
    app_env: str = "development"
    google_places_api_key: str | None = Field(
        default=None,
        validation_alias=AliasChoices("GOOGLE_PLACES_API_KEY", "GOOGLE_API_KEY"),
    )
    supabase_url: str | None = Field(default=None, alias="SUPABASE_URL")
    supabase_anon_key: str | None = Field(default=None, alias="SUPABASE_ANON_KEY")
    frontend_origin: str = Field(default="http://localhost:3000", alias="FRONTEND_ORIGIN")
    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    request_timeout_seconds: int = 25
    default_country: str = DEFAULT_COUNTRY
    default_towns: list[str] = DEFAULT_TOWNS
    default_categories: list[str] = DEFAULT_CATEGORIES
    google_places_base_url: str = "https://places.googleapis.com/v1"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
        populate_by_name=True,
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
