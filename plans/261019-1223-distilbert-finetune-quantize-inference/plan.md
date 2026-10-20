---
title: "DistilBERT Fine-Tuning, INT8 Quantization & Inference Service"
description: "Member 2 (An) delivers the primary veracity model: fine-tune DistilBERT in notebook 04, quantize it to INT8 in notebook 05, and replace the inference.py stub with real loading and prediction."
status: completed
priority: P1
effort: 7h
branch: main
tags: [feature, ml, nlp, backend]
blockedBy: [261007-0457-data-prep]
blocks: []
created: 2026-10-19
---

# DistilBERT Fine-Tuning, INT8 Quantization & Inference Service

## Overview

Notebooks 04 and 05 and `backend/app/services/inference.py` are still stubs, and `predict_claim()` returns a
hard-coded 0.5. This plan turns them into the primary veracity model the API and dashboard depend on:

1. Fine-tune `distilbert-base-uncased` on the deduped splits from the data-prep plan, scored on the random test
   split and on PHEME events the model never saw, next to the TF-IDF baseline (0.843 / 0.597).
2. Quantize the fine-tuned model to INT8 with PyTorch dynamic quantization and benchmark size, latency and
   Macro F1 against FP32.
3. Load the quantized model in the FastAPI lifespan and serve real predictions through `predict_claim()`.

Owner: Member 2, Pham Truong Que An. Executed later with `/ak:cook`.

## Scope Challenge

- **Existing code:** splits in `backend/data/processed/` (`id, text_raw, text_clean, label, source, event,
  word_count`, label 1 = misinformation), single-source `preprocessor.py`, the leave-one-event-out protocol in
  `02_preprocessing.ipynb` Part 10, and `settings.model_path` / `settings.token_max_length` in `app/config.py`.
- **Requested scope:** notebook 04, notebook 05, real `load_models()` / `predict_claim()`. Delivered in full.
- **Complexity:** 3 phases, about 11 files, one new exception class, no new services.
- **Mode:** HOLD SCOPE.

## Facts Verified Before Planning

| Fact | Evidence |
|---|---|
| `ml-env` has torch 2.14.1, transformers 5.18.0, tokenizers 0.23.2, sklearn 1.9.1, MPS available | import check in `ml-env` |
| `ml-env` lacks `accelerate`, `datasets`, `pydantic`, `fastapi`, `httpx` | import check |
| Only the `qnnpack` quantized engine exists on this Apple M3 | `torch.backends.quantized.supported_engines` |
| `torch.ao.quantization.quantize_dynamic` still works on 2.14.1 but prints a deprecation notice pointing to `torchao` | dry run on a random-init DistilBERT |
| Dynamic INT8 DistilBERT state_dict is 138.7 MB vs 267.9 MB FP32, because embeddings stay FP32 | dry run |
| A quantized state_dict reloads with `torch.load(..., weights_only=True)` into a freshly quantized skeleton, identical logits | dry run |
| Cleaned texts are short: token length P50 26, P95 35, max 72, none over 256 | tokenizer pass over all 7,256 rows |
| HF cache has the `distilbert-base-uncased` tokenizer but **not** its weights; first run of 04 needs internet | offline load failed |
| `*.pt` is gitignored; `*.safetensors` is not | `.gitignore` |
| `settings.model_path = "backend/models/distilbert_quantized.pt"` is repo-root relative, while the app runs from `backend/` | `config.py`, `main.py` imports `app.config` |
| `colab-mcp` (googlecolab/colab-mcp v1.0.2) is installed in Claude Code, local scope, status Connected; it exposes `open_colab_browser_connection`, then proxies notebook tools from the Colab tab | `claude mcp get colab-mcp`, upstream `session.py` |
| The repo was renamed to `PhamAn0910/COS30049-political-misinfo` (public); processed CSVs and `preprocessor.py` are on `origin/main`, so Colab can `git clone` them | GitHub API, `git ls-files` |
| `docs/jupyter-kernel-config.md` says notebooks 04/05 need TensorFlow; the project plan, config and ownership matrix all use PyTorch `.pt` | doc vs `docs/political-misinfo-plan.md`, `config.py` |

## Architecture & Data Flow

```text
backend/data/processed/{train,val,test}.csv
        │
        ▼
04_distilbert_finetune.ipynb  (Colab T4 via colab-mcp, local MPS fallback; plain PyTorch loop, class-weighted CE)
  │   outputs zipped on Colab, downloaded and unzipped into backend/
  ├─ backend/models/distilbert_finetuned/        FP32 model + tokenizer (gitignored)
  ├─ backend/reports/distilbert_results.md       test metrics + unseen-event table vs TF-IDF
  └─ backend/reports/distilbert_metrics.json     numbers for GET /metrics and notebook 05
        │
        ▼
05_quantization.ipynb  (CPU, qnnpack, Linear -> qint8)
  ├─ backend/models/distilbert_quantized.pt      INT8 state_dict (gitignored)
  ├─ backend/models/distilbert_tokenizer/        tokenizer + config.json (small, committed)
  ├─ backend/reports/quantization_benchmark.md   size / latency / Macro F1 FP32 vs INT8
  └─ GitHub Release model-v1                     distilbert_quantized.pt for teammates
        │
        ▼
app/services/inference.py
  load_models():  config -> DistilBERT skeleton -> quantize_dynamic -> load_state_dict(weights_only=True)
  predict_claim(): tokenize -> softmax -> {label, confidence, scores}
        │
        ▼
POST /api/predict (Member 1's route; same contract, 503 when the model is missing)
```

## Phases

| # | Phase | Status | Priority | Effort | Depends on | Deliverables |
|---|-------|--------|----------|--------|------------|--------------|
| 1 | [Phase 1: DistilBERT Fine-Tuning](./phase-01-distilbert-finetune.md) | completed | P1 | 3h | data-prep plan | `04_distilbert_finetune.ipynb`, `distilbert_finetuned/`, `distilbert_results.md`, `distilbert_metrics.json` |
| 2 | [Phase 2: INT8 Dynamic Quantization](./phase-02-int8-quantization.md) | completed | P1 | 2h | Phase 1 | `05_quantization.ipynb`, `distilbert_quantized.pt`, `distilbert_tokenizer/`, `quantization_benchmark.md`, Release `model-v1`, `docs/model-artifacts.md` |
| 3 | [Phase 3: Inference Service & Tests](./phase-03-inference-service.md) | completed | P1 | 2h | Phase 2 | `inference.py`, 503 mapping in `predict.py`, `tests/test_inference.py`, kernel doc fix |

Phases run strictly in order: each consumes the previous phase's artifacts.

## Key Decisions

- **Train on Colab, quantize and serve on the Mac.** Notebook 04 runs on a free Colab T4 through `colab-mcp`
  (8 unseen-event fine-tunes make GPU time worth it). Notebook 05 and inference stay local because INT8 must be
  benchmarked on the `qnnpack` engine the server actually uses. The notebook file in the repo remains the source
  of truth; Colab only executes it.
- **Plain PyTorch training loop, not HF `Trainer`.** `Trainer` needs `accelerate` (missing) and a subclass for
  weighted loss; a 40-line loop is clearer for the report and has no new dependency.
- **Dynamic padding with `max_length=256` truncation.** Keeps `settings.token_max_length` and the EDA
  justification; P95 is 35 tokens, so batches stay short and nothing is truncated.
- **Model selection on validation Macro F1 only.** Test is touched once. Unseen-event runs use the epoch count
  chosen on the main run, since the held-out event must not drive selection.
- **Quantized artifact is a state_dict, not a pickled module.** Loads with `weights_only=True`, survives
  transformers upgrades, and needs only the small `distilbert_tokenizer/` folder (config + vocab) at runtime.
- **Size target is the measured ~139 MB.** It meets the <200 MB requirement. The "~65 MB" in the notebook 05
  header assumed quantized embeddings; dynamic quantization leaves them FP32, so the header is corrected.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| DistilBERT also learns the event, not misinformation | High | High | Report the unseen-event mean and per-event table beside TF-IDF; state the gap plainly in the results report. |
| Colab disconnects, no GPU, or `colab-mcp` misbehaves | Medium | Low | Rerun from the top; Run all by hand in Colab; or the local MPS fallback. Assert loss is finite each epoch. |
| Colab and `ml-env` library versions drift | Medium | Medium | Colab pins `transformers==5.18.0`; Phase 1 verification loads the downloaded model in `ml-env` before Phase 2. |
| `torch.ao.quantization` removed in a future torch | Medium | Medium | Pin note in the results report (torch 2.14.1). Do not upgrade torch in `ml-env` during this plan. |
| INT8 Macro F1 drops more than 2 points | Low | Medium | Gate in notebook 05; if it fails, record it and stop before Phase 3 for a decision (FP16 is the fallback named in the project plan). |
| Teammates lack the gitignored model files | High | Medium | Tokenizer/config folder is committed; `distilbert_quantized.pt` ships as GitHub Release `model-v1` with a SHA-256 in `docs/model-artifacts.md`. |
| `gh` CLI not installed; release needs An's GitHub login | Certain | Low | `brew install gh`; An runs `gh auth login`; release is created only after An confirms. |
| `prince-toronto` (220 rumour / 4 not) drags the unseen-event mean | Certain | Low | Same protocol as notebook 02; show label counts next to scores. |

## Success Criteria

- [x] Notebook 04 runs top to bottom (on Colab T4, per Validation Session 2) and writes the FP32 model, results report and metrics JSON.
- [x] Test-set accuracy, precision, recall, Macro F1 and confusion matrix reported; per-source Macro F1 reported.
- [x] Unseen-event Macro F1 (mean and per event) reported beside TF-IDF 0.843 / 0.597 from `split_baselines.md`.
- [x] Control Test sentences from `docs/political-misinfo-plan.md` scored and recorded, pass or fail.
- [x] Notebook 05 writes `distilbert_quantized.pt` under 200 MB with INT8 Macro F1 within 2 points of FP32.
- [x] Size, single-claim latency and batch latency recorded for FP32 vs INT8 on CPU.
- [x] Release `model-v1` holds `distilbert_quantized.pt`; `docs/model-artifacts.md` explains download and SHA-256 check.
- [x] `load_models()` loads the real INT8 model; `predict_claim()` returns real probabilities; no hard-coded scores remain.
- [x] Without the model file, `POST /api/predict` returns 503 and the other endpoints still work.
- [x] `python -m pytest tests/` passes in `ml-env` from `backend/`.
- [x] No model weights (`*.pt`, `*.safetensors`) are staged for commit.

## Validation Log

### Session 1 — 2026-10-19

| # | Question | Decision | Propagated to |
|---|---|---|---|
| 1 | What should `POST /api/predict` do when `distilbert_quantized.pt` is missing? | Return a clear HTTP 503. `predict_claim` raises `ModelNotLoadedError`; `routes/predict.py` (Bao's file) maps it to 503. Server still starts. | Phase 3 |
| 2 | How do Bao and Nam get the gitignored 139 MB model? | GitHub Release asset `model-v1` (2 GB per-file limit, no LFS quota). Teammates run `gh release download model-v1 -p "*.pt" -D backend/models`. Tokenizer/config folder is committed. | Phase 2, Phase 3 |
| 3 | Unseen-event evaluation scope for DistilBERT? | All 8 PHEME events with at least 100 threads, same protocol as notebook 02, for a fair comparison with TF-IDF 0.597. | Phase 1 |

### Session 2 — 2026-10-19

| # | Question | Decision | Propagated to |
|---|---|---|---|
| 4 | Where does notebook 04 run? | Google Colab T4 GPU, driven from Claude Code through `colab-mcp` (installed). Notebook 05 and inference stay local. Local MPS remains the fallback. | Phase 1, plan overview |

### Verification Results
- Claims checked: 14
- Verified: 14 | Failed: 0 | Unverified: 0
- Tier: Standard (Fact Checker + Contract Verifier)
- Checked: `REPO_ROOT = parents[3]` resolves to the repo root; `DataCollatorWithPadding`, `get_linear_schedule_with_warmup`, `AutoConfig`, `AdamW` import in `ml-env`; `split_baselines.md` has a per-event TF-IDF table over 8 events; Control Test section exists in `docs/political-misinfo-plan.md`; `predict_claim` / `load_models` call sites in `routes/predict.py` and `main.py` match the kept signatures; quantization size and `weights_only=True` reload confirmed by dry run.
- Note: `gh` is not installed and the repo has no README; `docs/model-artifacts.md` becomes the download guide.

### Whole-Plan Consistency Sweep
- Phase 2 effort raised to 2h for the release step; total 7h.
- "Out of band" sharing wording replaced by the Release decision in plan and phases.
- Phase 3 no longer says Member 1's route is untouched; it names the single 503 change.
- Session 2: device order is now cuda > mps > cpu; the run section, verification and risks in Phase 1 describe
  the Colab flow; the Release step uses the renamed repo `COS30049-political-misinfo`.
- Unverified: the exact Colab UI step for accepting the `colab-mcp` connection (upstream README does not
  document it); the cook session confirms it on first use.
- No unresolved contradictions.
