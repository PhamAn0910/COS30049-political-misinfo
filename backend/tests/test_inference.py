# Role/Owner: Member 2 (ML & Data Engineering Lead)
# Core Responsibility: Unit and API tests for INT8 DistilBERT loading and veracity prediction
# Key Interface/Contract: Exercises `app.services.inference` and POST /api/predict; run with `python -m pytest tests/test_inference.py`

import torch  # first: see the libomp note in app/services/inference.py
import pytest
from fastapi.testclient import TestClient
from transformers import AutoTokenizer, DistilBertConfig, DistilBertForSequenceClassification

from app.config import settings
from app.main import app
from app.services import inference
from app.services.inference import (
    LABELS,
    ModelNotLoadedError,
    _load_distilbert,
    load_models,
    predict_claim,
    quantize_int8,
    resolve_model_path,
)
from app.services.preprocessor import preprocess_political_text

CONTROL_MISINFORMATION = (
    "BREAKING: Leaked documents confirm election officials destroyed 50,000 valid ballots overnight in swing state. "
    "#StopTheSteal #ElectionFraud SHARE NOW!!!"
)
REAL_MODEL_PATH = resolve_model_path()
requires_real_model = pytest.mark.skipif(
    not (REAL_MODEL_PATH.exists() and (REAL_MODEL_PATH.parent / inference.TOKENIZER_DIR_NAME).is_dir()),
    reason=f"{REAL_MODEL_PATH} not present; see docs/model-artifacts.md",
)


@pytest.fixture(scope="module")
def tokenizer():
    return AutoTokenizer.from_pretrained("distilbert-base-uncased")


@pytest.fixture(scope="module")
def tiny_model(tokenizer):
    """A random-init one-layer DistilBERT quantized like the real artifact, to test the code path cheaply."""
    torch.manual_seed(0)
    config = DistilBertConfig(vocab_size=tokenizer.vocab_size, dim=32, n_layers=1, n_heads=2, hidden_dim=64,
                              num_labels=2, id2label=LABELS, label2id={v: k for k, v in LABELS.items()})
    return quantize_int8(DistilBertForSequenceClassification(config).eval())


@pytest.fixture
def missing_model_path(monkeypatch, tmp_path):
    monkeypatch.setattr(settings, "model_path", str(tmp_path / "missing" / "distilbert_quantized.pt"))


def test_predict_claim_returns_probability_contract(tiny_model, tokenizer):
    result = predict_claim("officials confirmed the ballots were counted", tiny_model, tokenizer)

    assert set(result) == {"label", "confidence", "scores"}
    assert set(result["scores"]) == {"factual", "misinformation"}
    assert all(0.0 <= p <= 1.0 for p in result["scores"].values())
    assert sum(result["scores"].values()) == pytest.approx(1.0, abs=1e-4)
    assert result["label"] == max(result["scores"], key=result["scores"].get)
    assert result["confidence"] == max(result["scores"].values())


def test_predict_claim_handles_empty_cleaned_text(tiny_model, tokenizer):
    # Emoji-only input cleans to "", which must still produce a valid prediction rather than an error.
    assert predict_claim(preprocess_political_text("\U0001F602\U0001F525"), tiny_model, tokenizer)["label"] in LABELS.values()


def test_quantized_state_dict_round_trip(tiny_model, tokenizer, tmp_path):
    model_path = tmp_path / "distilbert_quantized.pt"
    tokenizer_dir = tmp_path / inference.TOKENIZER_DIR_NAME
    torch.save(tiny_model.state_dict(), model_path)
    tiny_model.config.save_pretrained(tokenizer_dir)
    tokenizer.save_pretrained(tokenizer_dir)

    loaded_model, loaded_tokenizer = _load_distilbert(model_path, tokenizer_dir)

    batch = tokenizer(["first claim", "a second, longer political claim"], padding=True, return_tensors="pt")
    with torch.inference_mode():
        assert torch.allclose(tiny_model(**batch).logits, loaded_model(**batch).logits)
    assert loaded_tokenizer("first claim")["input_ids"] == tokenizer("first claim")["input_ids"]


def test_resolve_model_path_is_repo_root_relative():
    assert resolve_model_path("backend/models/x.pt") == inference.REPO_ROOT / "backend" / "models" / "x.pt"
    assert resolve_model_path("/abs/x.pt").as_posix() == "/abs/x.pt"


def test_load_models_without_artifacts_does_not_raise(missing_model_path):
    models = load_models()

    assert set(models) == {"distilbert", "tokenizer", "tfidf_baseline", "spread_regressor"}
    assert models["distilbert"] is None and models["tokenizer"] is None


def test_predict_claim_without_model_raises():
    with pytest.raises(ModelNotLoadedError):
        predict_claim("any claim", None, None)


def test_api_returns_503_without_model(missing_model_path):
    with TestClient(app) as client:
        response = client.post("/api/predict", json={"text": CONTROL_MISINFORMATION})
        assert response.status_code == 503
        assert "docs/model-artifacts.md" in response.json()["detail"]
        assert client.get("/api/health").status_code == 200


@requires_real_model
def test_real_artifact_predicts_control_sentence():
    models = load_models()
    result = predict_claim(preprocess_political_text(CONTROL_MISINFORMATION), models["distilbert"], models["tokenizer"])

    assert result["label"] in LABELS.values()
    assert sum(result["scores"].values()) == pytest.approx(1.0, abs=1e-4)


@requires_real_model
def test_api_predict_with_real_artifact():
    with TestClient(app) as client:
        response = client.post("/api/predict", json={"text": CONTROL_MISINFORMATION})

    assert response.status_code == 200
    body = response.json()
    assert body["veracity_label"] in {"factual", "misinformation"}
    assert set(body["confidence_breakdown"]) == {"factual", "misinformation"}
