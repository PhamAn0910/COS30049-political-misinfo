# Role/Owner: Member 2 (ML & Data Engineering Lead)
# Core Responsibility: Quantized DistilBERT artifact loading, tokenization, and veracity inference logic
# Key Interface/Contract: `load_models()` and `predict_claim(text, model, tokenizer)` consumed by main.py and routes/predict.py

import logging
import warnings
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

# torch is imported before joblib (which pulls in sklearn when unpickling): in ml-env both ship their own libomp,
# and loading sklearn's first makes torch's CPU kernels segfault.
import torch
import joblib
from transformers import AutoConfig, AutoModelForSequenceClassification, AutoTokenizer

from app.config import settings

logger = logging.getLogger(__name__)

REPO_ROOT = Path(__file__).resolve().parents[3]
TOKENIZER_DIR_NAME = "distilbert_tokenizer"
LABELS = {0: "factual", 1: "misinformation"}
ARTIFACTS_DOC = "docs/model-artifacts.md"


class ModelNotLoadedError(RuntimeError):
    """Raised when a prediction is requested but the veracity model artifact was not loaded."""


def resolve_model_path(model_path: Optional[str] = None) -> Path:
    """Resolve `settings.model_path` against the repo root when relative, so uvicorn can start from any directory."""
    path = Path(model_path if model_path is not None else settings.model_path)
    return path if path.is_absolute() else REPO_ROOT / path


def quantize_int8(model: torch.nn.Module) -> torch.nn.Module:
    """Apply the same INT8 dynamic quantization as notebook 05: Linear layers to qint8, embeddings stay FP32."""
    if "qnnpack" in torch.backends.quantized.supported_engines:
        torch.backends.quantized.engine = "qnnpack"  # the only engine on Apple Silicon; others keep their default
    with warnings.catch_warnings():
        # torch 2.14 still ships torch.ao.quantization but flags it for migration to torchao.
        warnings.filterwarnings("ignore", message="torch.ao.quantization is deprecated")
        return torch.ao.quantization.quantize_dynamic(model, {torch.nn.Linear}, dtype=torch.qint8)


def _load_distilbert(model_path: Path, tokenizer_dir: Path) -> Tuple[torch.nn.Module, Any]:
    """Rebuild the quantized skeleton from config.json, then load the INT8 state_dict without unpickling code."""
    config = AutoConfig.from_pretrained(tokenizer_dir)
    model = quantize_int8(AutoModelForSequenceClassification.from_config(config))
    model.load_state_dict(torch.load(model_path, map_location="cpu", weights_only=True))
    model.eval()
    return model, AutoTokenizer.from_pretrained(tokenizer_dir)


def _load_optional_joblib(path: Path) -> Any:
    if path.exists():
        return joblib.load(path)
    logger.warning("Optional model artifact not found at %s; see %s.", path, ARTIFACTS_DOC)
    return None


def load_models() -> Dict[str, Any]:
    """
    Load fine-tuned quantized Transformer and baseline artifacts into memory during application startup.
    Returns dictionary containing model objects and tokenizers. A missing artifact leaves its key as None,
    so the server still starts and endpoints that do not need it keep working.
    """
    model_path = resolve_model_path()
    models_dir = model_path.parent
    tokenizer_dir = models_dir / TOKENIZER_DIR_NAME

    distilbert, tokenizer = None, None
    if model_path.exists() and tokenizer_dir.is_dir():
        distilbert, tokenizer = _load_distilbert(model_path, tokenizer_dir)
        logger.info("Loaded INT8 DistilBERT from %s", model_path)
    else:
        logger.warning(
            "Veracity model not found (expected %s and %s/); POST /api/predict will return 503. See %s.",
            model_path, tokenizer_dir, ARTIFACTS_DOC,
        )

    return {
        "distilbert": distilbert,
        "tokenizer": tokenizer,
        "tfidf_baseline": _load_optional_joblib(models_dir / "tfidf_logreg.joblib"),
        "spread_regressor": _load_optional_joblib(models_dir / "spread_regressor.joblib"),
    }


def _class_labels(model: torch.nn.Module) -> Dict[int, str]:
    """Class names from the model config when notebook 04 set them, else the 0/1 convention of the processed CSVs."""
    id2label = {int(k): v for k, v in (getattr(model.config, "id2label", None) or {}).items()}
    return id2label if set(id2label.values()) == set(LABELS.values()) else LABELS


def predict_claim(text: str, model: Any, tokenizer: Any) -> Dict[str, Any]:
    """
    Execute veracity prediction on preprocessed text using fine-tuned DistilBERT.
    Returns classification label ('factual' | 'misinformation') and confidence breakdown.
    Raises ModelNotLoadedError when the model or tokenizer is missing.
    """
    if model is None or tokenizer is None:
        raise ModelNotLoadedError(f"Veracity model is not loaded. See {ARTIFACTS_DOC}.")

    encoded = tokenizer(text, truncation=True, max_length=settings.token_max_length, return_tensors="pt")
    with torch.inference_mode():
        probs = torch.softmax(model(**encoded).logits, dim=-1)[0].tolist()

    labels = _class_labels(model)
    scores = {labels[i]: round(p, 4) for i, p in enumerate(probs)}
    label = labels[max(range(len(probs)), key=probs.__getitem__)]
    return {"label": label, "confidence": scores[label], "scores": scores}
