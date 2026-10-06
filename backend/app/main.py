# Role/Owner: Member 1 (Full-Stack & Integration Lead)
# Core Responsibility: FastAPI application lifecycle initialization, CORS configuration, and router aggregation
# Key Interface/Contract: ASGI application entrypoint consumed by Uvicorn server (`uvicorn backend.app.main:app`)

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.services.inference import load_models
from app.routes import predict, metrics, cascades


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Load ML models and tokenizers into memory on server startup, and clean up on shutdown.
    """
    app.state.models = load_models()
    yield
    app.state.models.clear()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api")
app.include_router(metrics.router, prefix="/api")
app.include_router(cascades.router, prefix="/api")


@app.get("/api/health")
async def health_check():
    """Health check endpoint for container and client connectivity verification."""
    return {"status": "ok", "app": settings.app_name, "version": settings.app_version}
