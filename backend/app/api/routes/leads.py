from fastapi import APIRouter, HTTPException

from app.schemas.lead import (
    BusinessSearchRequest,
    IngestLeadsRequest,
    LeadUpdateRequest,
)
from app.services.lead_engine import LeadEngineService

router = APIRouter(tags=["lead-engine"])
service = LeadEngineService()


@router.post("/search/businesses")
async def search_businesses(payload: BusinessSearchRequest) -> dict:
    try:
        results = await service.search_businesses(payload)
        return {"results": [item.model_dump() for item in results], "count": len(results)}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/leads")
async def list_leads() -> dict:
    try:
        return {"results": await service.list_leads()}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/leads/{lead_id}")
async def get_lead(lead_id: str) -> dict:
    try:
        return await service.get_lead_detail(lead_id).model_dump()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/leads/ingest")
async def ingest_leads(payload: IngestLeadsRequest) -> dict:
    try:
        saved = await service.ingest_leads(payload)
        return {"results": saved, "count": len(saved)}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/leads/{lead_id}/enrich")
async def enrich_lead(lead_id: str) -> dict:
    try:
        return await service.enrich_lead(lead_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/leads/{lead_id}/competitors")
async def get_competitors(lead_id: str) -> dict:
    try:
        return {"results": await service.get_competitors(lead_id)}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/leads/{lead_id}/proposal/recommend")
async def recommend_proposal(lead_id: str) -> dict:
    try:
        return await service.recommend_proposal(lead_id).model_dump()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/leads/{lead_id}/outreach/generate")
async def generate_outreach(lead_id: str) -> dict:
    try:
        return await service.generate_outreach(lead_id).model_dump()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.patch("/leads/{lead_id}")
async def update_lead(lead_id: str, payload: LeadUpdateRequest) -> dict:
    try:
        return await service.update_lead(lead_id, payload)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/leads/{lead_id}/select")
async def select_lead(lead_id: str) -> dict:
    try:
        return await service.set_selected(lead_id, True)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/leads/{lead_id}/unselect")
async def unselect_lead(lead_id: str) -> dict:
    try:
        return await service.set_selected(lead_id, False)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/metrics/dashboard")
async def dashboard_metrics() -> dict:
    try:
        return await service.dashboard_metrics().model_dump()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(exc)) from exc
