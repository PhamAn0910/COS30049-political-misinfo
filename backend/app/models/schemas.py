# Role/Owner: Member 1 (Full-Stack & Integration Lead)
# Core Responsibility: Request and response validation contracts for REST API endpoints
# Key Interface/Contract: Consumed by routes/predict.py, routes/metrics.py, and routes/cascades.py

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Claim or tweet text to analyze")
    user_followers: Optional[int] = Field(default=1000, ge=0, description="Follower count for cascade estimation")
    user_verified: Optional[bool] = Field(default=False, description="Verification status of the author")


class PredictResponse(BaseModel):
    veracity_label: str = Field(..., description="Classification outcome: 'factual' or 'misinformation'")
    veracity_score: float = Field(..., ge=0.0, le=1.0, description="Primary model prediction confidence score")
    spread_risk: str = Field(..., description="Estimated spread risk: 'High', 'Moderate', or 'Low'")
    expected_reach: int = Field(..., ge=0, description="Predicted cascade user reach")
    confidence_breakdown: Dict[str, float] = Field(default_factory=dict, description="Class probabilities")
    preprocessed_text: Optional[str] = Field(default=None, description="Normalized input text after pipeline")


class MetricsResponse(BaseModel):
    accuracy: float
    precision: float
    recall: float
    macro_f1: float
    confusion_matrix: Dict[str, int]
    baseline_comparison: Dict[str, float]


class CascadeStatsResponse(BaseModel):
    total_cascades: int
    avg_depth: float
    avg_virality: float
    category_distribution: Dict[str, int]


class NetworkNode(BaseModel):
    id: str
    label: str
    community: int
    veracity: str


class NetworkEdge(BaseModel):
    source: str
    target: str
    weight: float


class CascadeNetworkResponse(BaseModel):
    nodes: List[NetworkNode]
    edges: List[NetworkEdge]
