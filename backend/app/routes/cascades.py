# Role/Owner: Member 3 (Analytics, Graph & Visualization Lead)
# Core Responsibility: Endpoint handlers for cascade statistical distribution and D3 network graph data
# Key Interface/Contract: GET /cascades/stats and GET /cascades/network, consumed by frontend useCascades hook

from fastapi import APIRouter
from app.models.schemas import CascadeStatsResponse, CascadeNetworkResponse

router = APIRouter(prefix="/cascades", tags=["Cascades"])


@router.get("/stats", response_model=CascadeStatsResponse)
async def get_cascade_stats():
    """
    Retrieve statistical summary of PHEME cascades (depth, virality, topic distribution).
    """
    return CascadeStatsResponse(
        total_cascades=4200,
        avg_depth=3.4,
        avg_virality=14.2,
        category_distribution={
            "Ferguson": 1143,
            "Ottawa Shooting": 890,
            "Putin Missing": 238,
            "Charlie Hebdo": 1929,
        },
    )


@router.get("/network", response_model=CascadeNetworkResponse)
async def get_cascade_network():
    """
    Retrieve force-directed graph data (nodes and edges with community cluster mappings).
    """
    return CascadeNetworkResponse(
        nodes=[
            {"id": "u1", "label": "@UserA", "community": 0, "veracity": "factual"},
            {"id": "u2", "label": "@UserB", "community": 0, "veracity": "factual"},
            {"id": "u3", "label": "@UserC", "community": 1, "veracity": "misinformation"},
            {"id": "u4", "label": "@UserD", "community": 1, "veracity": "misinformation"},
        ],
        edges=[
            {"source": "u1", "target": "u2", "weight": 1.0},
            {"source": "u3", "target": "u4", "weight": 2.5},
            {"source": "u2", "target": "u3", "weight": 0.5},
        ],
    )
