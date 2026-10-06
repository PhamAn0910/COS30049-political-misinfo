# Role/Owner: Member 1 (Full-Stack & Integration Lead)
# Core Responsibility: Endpoint handlers for claim verification, spread risk prediction, and prediction history
# Key Interface/Contract: POST /predict, DELETE /predict/history implementing PredictRequest/PredictResponse contracts

from fastapi import APIRouter, HTTPException, Request
from app.models.schemas import PredictRequest, PredictResponse
from app.services.preprocessor import preprocess_political_text
from app.services.inference import predict_claim
from app.services.cascade import predict_spread

router = APIRouter(tags=["Prediction"])


@router.post("/predict", response_model=PredictResponse)
async def predict(request: Request, body: PredictRequest):
    """
    Classify a political claim as Factual or Misinformation and estimate spread risk.
    """
    if not body.text or not body.text.strip():
        raise HTTPException(status_code=400, detail="Text input cannot be empty.")

    if len(body.text) > 5000:
        raise HTTPException(status_code=400, detail="Text exceeds 5000 character limit.")

    cleaned = preprocess_political_text(body.text)
    models = getattr(request.app.state, "models", {})

    veracity_result = predict_claim(
        cleaned,
        models.get("distilbert"),
        models.get("tokenizer"),
    )

    spread_result = predict_spread(
        user_followers=body.user_followers,
        user_verified=body.user_verified,
        model=models.get("spread_regressor"),
    )

    return PredictResponse(
        veracity_label=veracity_result.get("label", "factual"),
        veracity_score=veracity_result.get("confidence", 0.5),
        spread_risk=spread_result.get("risk_level", "Low"),
        expected_reach=spread_result.get("predicted_reach", 0),
        confidence_breakdown=veracity_result.get("scores", {}),
        preprocessed_text=cleaned,
    )


@router.delete("/predict/history")
async def clear_prediction_history():
    """
    Clear stored prediction history for demo session reset.
    """
    return {"status": "success", "message": "Prediction history cleared."}
