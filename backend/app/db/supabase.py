from typing import Any

import httpx

from app.core.config import get_settings


class SupabaseRestClient:
    def __init__(self) -> None:
        settings = get_settings()
        self.base_url = settings.supabase_url
        self.api_key = settings.supabase_anon_key
        self.timeout = settings.request_timeout_seconds

    @property
    def configured(self) -> bool:
        return bool(self.base_url and self.api_key)

    def _headers(self, prefer: str | None = None) -> dict[str, str]:
        headers = {
            "apikey": self.api_key or "",
            "Authorization": f"Bearer {self.api_key or ''}",
            "Content-Type": "application/json",
        }
        if prefer:
            headers["Prefer"] = prefer
        return headers

    async def request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        payload: Any | None = None,
        prefer: str | None = None,
    ) -> Any:
        if not self.configured:
            raise RuntimeError("Supabase is not configured.")

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.request(
                method,
                f"{self.base_url}/rest/v1/{path}",
                params=params,
                json=payload,
                headers=self._headers(prefer),
            )
            response.raise_for_status()
            if not response.text:
                return None
            return response.json()

    async def insert_many(self, table: str, rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return await self.request("POST", table, payload=rows, prefer="return=representation")

    async def insert_one(self, table: str, row: dict[str, Any]) -> dict[str, Any]:
        result = await self.request("POST", table, payload=row, prefer="return=representation")
        return result[0] if result else {}

    async def upsert_many(
        self,
        table: str,
        rows: list[dict[str, Any]],
        *,
        on_conflict: str,
    ) -> list[dict[str, Any]]:
        return await self.request(
            "POST",
            table,
            params={"on_conflict": on_conflict},
            payload=rows,
            prefer="resolution=merge-duplicates,return=representation",
        )

    async def select(
        self,
        table: str,
        *,
        select: str = "*",
        filters: dict[str, Any] | None = None,
        order: str | None = None,
        limit: int | None = None,
    ) -> list[dict[str, Any]]:
        params: dict[str, Any] = {"select": select}
        if filters:
            params.update(filters)
        if order:
            params["order"] = order
        if limit:
            params["limit"] = limit
        result = await self.request("GET", table, params=params)
        return result or []

    async def patch(self, table: str, filters: dict[str, Any], row: dict[str, Any]) -> list[dict[str, Any]]:
        return await self.request(
            "PATCH",
            table,
            params={**filters, "select": "*"},
            payload=row,
            prefer="return=representation",
        )
