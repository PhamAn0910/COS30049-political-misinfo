# Model Artifacts

How to get the veracity model the API loads. Owner: Member 2 (An).

## What lives where

| Artifact | Size | Where | Committed? |
|---|---|---|---|
| `backend/models/distilbert_tokenizer/` (tokenizer + `config.json`, no weights) | < 1 MB | git | yes |
| `backend/models/distilbert_quantized.pt` (INT8 `state_dict`) | 138.7 MB | GitHub Release `model-v2` | no (`*.pt` is gitignored) |
| `backend/models/distilbert_finetuned/` (FP32 model, input to notebook 05) | 268 MB | rebuilt by notebook 04 | no |

`POST /api/predict` needs both `distilbert_quantized.pt` and `distilbert_tokenizer/`. Without the `.pt` file the server
still starts, logs a warning, and `/api/predict` answers HTTP 503; the other endpoints keep working.

## Download the quantized model

With the GitHub CLI, from the repo root:

```bash
gh release download model-v2 -p "*.pt" -D backend/models
```

Without `gh`: open the repo's **Releases** page on GitHub
(`PhamAn0910/COS30049-political-misinfo`), open `model-v2`, and save `distilbert_quantized.pt` into `backend/models/`.

## Check the file

```bash
shasum -a 256 backend/models/distilbert_quantized.pt
```

The hash must be `47c2fbf256d2f760156bf3a00cd9f1b71b110162aa9d189647084abc640c943e`
(also recorded in `backend/reports/quantization_benchmark.md`). On Windows: `certutil -hashfile backend\models\distilbert_quantized.pt SHA256`.

Then confirm the API loads it, from `backend/`:

```bash
python -m pytest tests/test_inference.py -q
```

No test should be skipped; skipped real-artifact tests mean the file is missing or in the wrong folder.

## Runtime requirements

- torch 2.14.1 and transformers 5.18.0 (the versions `ml-env` uses). The file is a `state_dict` loaded with
  `torch.load(..., weights_only=True)` into a freshly quantized skeleton, so it does not depend on pickled classes,
  but `torch.ao.quantization` is deprecated and may disappear in a later torch.
- Import `torch` before `sklearn` in any new script: both ship their own `libomp`, and loading sklearn's first can crash torch.

## Rebuild from scratch

1. Run `backend/notebooks/04_distilbert_finetune.ipynb` (Colab T4 GPU, or `ml-env` on MPS). It writes
   `distilbert_finetuned/`, `reports/distilbert_results.md` and `reports/distilbert_metrics.json`. On Colab, unzip the
   downloaded `distilbert_finetuned_outputs.zip` inside `backend/`; macOS may unzip into a
   `distilbert_finetuned_outputs/` wrapper folder, whose `models/` and `reports/` contents belong in `backend/`.
2. Run `backend/notebooks/05_quantization.ipynb` in `ml-env`. It writes `distilbert_quantized.pt`,
   `distilbert_tokenizer/` and `reports/quantization_benchmark.md`, and fails if the file exceeds 200 MB or
   Macro F1 drops by more than 2 points.

A retrained model has a different SHA-256; publish it as a new release (`model-v3`, and so on) and update this page.

## Release history

| Release | Labels | Test Macro F1 (FP32 / INT8) | SHA-256 |
|---|---|---|---|
| `model-v2` (current) | `label = 1` is a false PHEME rumour or a PolitiFact fake; unverified rumours and the `prince-toronto`/`ebola-essien` events dropped | 0.868 / 0.858 | `47c2fbf2...943e` |
| `model-v1` (superseded) | `label = 1` is any PHEME rumour or a PolitiFact fake | see the `model-v1` release | `8dfb5e37...2a39` |

The two releases are scored on different test splits, so their Macro F1 is not directly comparable. `model-v1` files fail the hash check above.
