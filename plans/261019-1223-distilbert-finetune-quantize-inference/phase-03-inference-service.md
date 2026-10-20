---
phase: 3
title: "Inference Service & Tests"
status: pending
priority: P1
effort: "2h"
dependencies: [2]
---

# Phase 3: Inference Service & Tests

## Goal
Replace the stubs in `inference.py` so the FastAPI lifespan loads the real INT8 model and `POST /api/predict`
returns real DistilBERT probabilities, with tests that run in `ml-env`.

## Files to Create / Modify
- Modify: `backend/app/services/inference.py` (keep the Role/Owner header and both public signatures)
- Modify: `backend/app/routes/predict.py` (Member 1's file: only map `ModelNotLoadedError` to HTTP 503; tell Bao)
- Create: `backend/tests/test_inference.py`
- Modify: `docs/jupyter-kernel-config.md` (notebooks 04/05 use PyTorch, not TensorFlow)
- Environment only (no repo file): install `pydantic`, `fastapi`, `httpx` into `ml-env` so `app.config` imports
  and a `TestClient` smoke test can run.

## Contract (unchanged, consumed by `routes/predict.py` and `main.py`)
- `load_models() -> Dict[str, Any]` with keys `distilbert`, `tokenizer`, `tfidf_baseline`, `spread_regressor`.
- `predict_claim(text, model, tokenizer) -> {"label": "factual" | "misinformation", "confidence": float,
  "scores": {"factual": float, "misinformation": float}}`.

## Tasks & Steps

### `inference.py`
- [x] Path resolution: `REPO_ROOT = Path(__file__).resolve().parents[3]`. Resolve `settings.model_path` against
      `REPO_ROOT` when it is relative, so loading works whether uvicorn starts in the repo root or `backend/`.
      Tokenizer/config dir = model path's parent / `distilbert_tokenizer`.
- [x] `_load_distilbert(model_path, tokenizer_dir)`: set `qnnpack` engine, `AutoConfig` +
      `AutoModelForSequenceClassification.from_config`, `quantize_dynamic(..., {nn.Linear}, qint8)`,
      `load_state_dict(torch.load(model_path, weights_only=True))`, `eval()`. Returns `(model, tokenizer)`.
- [x] `load_models()`: load DistilBERT; load `tfidf_logreg.joblib` and `spread_regressor.joblib` from the same
      models dir with `joblib.load` when present. A missing artifact logs a warning with the expected path and
      leaves that key `None`, so the server still starts and other endpoints work. The warning names
      `docs/model-artifacts.md` for how to get the file.
<!-- Updated: Validation Session 1 - missing model returns HTTP 503 -->
- [x] `class ModelNotLoadedError(RuntimeError)` in `inference.py`. `predict_claim()` raises it when `model` or
      `tokenizer` is `None`.
- [x] `routes/predict.py`: wrap the `predict_claim` call; on `ModelNotLoadedError` raise
      `HTTPException(status_code=503, detail="Veracity model is not loaded. See docs/model-artifacts.md.")`.
      No other change to Member 1's route.
- [x] `predict_claim()`: tokenizer with `truncation=True, max_length=settings.token_max_length,
      return_tensors="pt"`; `torch.inference_mode()`; softmax; index 1 = misinformation (read from
      `model.config.id2label` when set, else the 0/1 convention from notebook 02). `label` is the argmax,
      `confidence` its probability, `scores` both probabilities as Python floats rounded to 4 places.
- [x] Remove the hard-coded 0.5 return path entirely.

### Tests (`backend/tests/test_inference.py`, header in the same style as `test_preprocessor.py`)
- [x] Fixture: tiny random-init DistilBERT (`dim=32, n_layers=1, n_heads=2, hidden_dim=64`, vocab from the
      cached tokenizer), quantized the same way. Tests the real code path without the large artifact.
- [x] `predict_claim` returns both class keys, probabilities in [0, 1] summing to 1 (±1e-4), `label` equals the
      argmax, `confidence == max(scores)`.
- [x] Round trip: save the tiny quantized state_dict + config/tokenizer to `tmp_path`, load through
      `_load_distilbert`, same logits.
- [x] `load_models()` with a non-existent model path returns `distilbert is None` and does not raise.
- [x] `predict_claim(text, None, None)` raises `ModelNotLoadedError`.
- [x] `TestClient(app)` with `settings.model_path` monkeypatched to a missing file: `POST /api/predict` returns
      503 and `GET /api/health` still returns 200. Runs without the real artifact.
- [x] Real artifact (marked `skipif` when `distilbert_quantized.pt` is absent): loads, and the first Control Test
      sentence returns a valid contract dict.
- [x] `TestClient(app)` smoke: `POST /api/predict` with the Control Test sentence returns 200 and a
      `veracity_label` in {"factual", "misinformation"} (skipif artifact absent).

### Docs
- [x] In `docs/jupyter-kernel-config.md`, replace the line saying 04/05 require TensorFlow: they use PyTorch +
      transformers in `ml-env`; first run of 04 downloads the DistilBERT weights.

## Verification
```bash
/opt/anaconda3/envs/ml-env/bin/pip install "pydantic>=2.0.0" "fastapi>=0.100.0" "httpx>=0.24.0"
```
```bash
cd backend && /opt/anaconda3/envs/ml-env/bin/python -m pytest tests/ -q
```
- Both `test_preprocessor.py` and `test_inference.py` pass; artifact-dependent tests run (not skipped) on An's
  machine after Phases 1-2.
- `grep -n "0.5" backend/app/services/inference.py` finds no hard-coded score.

## Success Criteria
- All tests pass in `ml-env`.
- `POST /api/predict` returns DistilBERT probabilities from the INT8 model.
- Public signatures and return keys unchanged; the only edit to Member 1's route is the 503 mapping.
- Without the artifact, `/api/predict` answers 503 instead of a fake score, and the rest of the API still serves.

## Risks / Rollback
- `routes/predict.py` and `config.py` belong to Member 1; any change there is agreed with Bao first.
- Rollback: `git checkout backend/app/services/inference.py`; delete `test_inference.py`.
