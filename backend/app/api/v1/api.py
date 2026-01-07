from fastapi import APIRouter
from app.api.v1.endpoints import feedback, analytics

api_router = APIRouter()
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

