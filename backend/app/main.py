from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.keep_alive import ping_server
import os
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    render_url = os.getenv("RENDER_EXTERNAL_URL", "https://dnyf-assignment-2.onrender.com")
    health_url = f"{render_url}/backend/health"
    ping_server(health_url)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"/backend{settings.API_V1_STR}/openapi.json",
    docs_url="/backend/docs",
    redoc_url="/backend/redoc",
    lifespan=lifespan,
)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

from app.api.v1.api import api_router
app.include_router(api_router, prefix=f"/backend{settings.API_V1_STR}")

@app.get("/backend")
def root():
    return {"message": "Welcome to Two-Dashboard AI Feedback API"}

@app.get("/backend/health")
def health_check():
    return {"status": "ok"}
