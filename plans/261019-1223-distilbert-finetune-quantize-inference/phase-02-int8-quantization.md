---
phase: 2
title: "INT8 Dynamic Quantization"
status: pending
priority: P1
effort: "2h"
dependencies: [1]
---

# Phase 2: INT8 Dynamic Quantization

## Goal
Quantize the fine-tuned DistilBERT's Linear layers to INT8, prove the accuracy cost is small, and export the
artifact the API loads.

## Files to Create / Modify
- Modify: `backend/notebooks/05_quantization.ipynb` (replace the stub; keep the Role/Owner header; correct the
  "~65MB" target to the measured size and explain why; kernelspec `ml-env`)
- Create (generated): `backend/models/distilbert_quantized.pt` (INT8 state_dict, gitignored by `*.pt`)
- Create (generated): `backend/models/distilbert_tokenizer/` (tokenizer files + `config.json`, no weights)
- Create (generated): `backend/reports/quantization_benchmark.md`
- Create: `docs/model-artifacts.md` (how teammates get the model)
- External: GitHub Release `model-v1` with `distilbert_quantized.pt` (published only after An confirms)

## Inputs
- `backend/models/distilbert_finetuned/` from Phase 1.
- `backend/data/processed/test.csv`.

## Tasks & Steps

### Setup
- [x] Header markdown: why dynamic quantization (no calibration data, Linear layers dominate compute), and that
      INT8 kernels run on CPU only.
- [x] `torch.backends.quantized.engine = "qnnpack"` (the only engine on Apple Silicon). Device CPU for both
      models so the comparison is fair. `torch.manual_seed(42)`.
- [x] Silence only the known `torch.ao.quantization` deprecation `UserWarning`, with a markdown note naming torch
      2.14.1 and the `torchao` migration path.

### Quantize
- [x] Load FP32 model and tokenizer from `../models/distilbert_finetuned`, `eval()`.
- [x] `quantized = torch.ao.quantization.quantize_dynamic(fp32, {torch.nn.Linear}, dtype=torch.qint8)`.
- [x] Print which modules were converted (count of `DynamicQuantizedLinear`).

### Benchmark
- [x] Size: `torch.save(state_dict)` of each to a temp file, report MB. Note that embeddings stay FP32, which is
      why the result is about 139 MB, not 65 MB.
- [x] Accuracy: run both on the full test split with the same tokenization as notebook 04. Report accuracy,
      precision, recall, Macro F1, and prediction agreement rate. Delta in Macro F1 points.
- [x] Latency: `torch.inference_mode()`, 5 warm-up calls, then the median of 50 single-claim calls and of 10
      batch-of-32 calls; `torch.get_num_threads()` recorded. Same inputs for both models.
- [x] Gate cell: `assert size_mb < 200` and `assert fp32_f1 - int8_f1 <= 0.02`. If the F1 gate fails, stop and
      report rather than loosening it.

### Export and round-trip check
- [x] `torch.save(quantized.state_dict(), "../models/distilbert_quantized.pt")`.
- [x] `tokenizer.save_pretrained("../models/distilbert_tokenizer")` and
      `fp32.config.save_pretrained("../models/distilbert_tokenizer")` (config only, no weights).
- [x] Round trip, the same way `inference.py` will load it: `AutoConfig` from `distilbert_tokenizer/` ->
      `AutoModelForSequenceClassification.from_config(config)` -> `quantize_dynamic` ->
      `load_state_dict(torch.load(path, weights_only=True))`; assert logits `allclose` to `quantized` on a batch
      of test texts.
- [x] Generate `quantization_benchmark.md`: size table, latency table, accuracy table, gate results,
      environment (torch, transformers, engine, threads, chip), and the SHA-256 of `distilbert_quantized.pt`.

<!-- Updated: Validation Session 1 - share the .pt through a GitHub Release -->
### Share the artifact through a GitHub Release
- [x] `gh` is not installed on An's machine. Install it (`brew install gh`); An runs `gh auth login` personally.
- [x] **Ask An before publishing** (outward-facing action). Then create release `model-v1` on
      `PhamAn0910/COS30049-political-misinfo` (renamed from `COS30049-health-misinfo`; the old URL redirects) with `distilbert_quantized.pt` as the only asset; release notes give
      the SHA-256, test Macro F1, torch/transformers versions, and the commit of notebooks 04/05.
      ```bash
      gh release create model-v1 backend/models/distilbert_quantized.pt --title "DistilBERT INT8 model v1" --notes-file <notes>
      ```
- [x] Create `docs/model-artifacts.md` (short): what is committed (`distilbert_tokenizer/`), what is in the
      release, the download command, the SHA-256 check, and how to rebuild by running 04 then 05.
      ```bash
      gh release download model-v1 -p "*.pt" -D backend/models
      ```
      Web fallback for teammates without `gh`: download from the repo's Releases page into `backend/models/`.

## Verification
```bash
cd "backend/notebooks" && /opt/anaconda3/bin/jupyter nbconvert --to notebook --execute --inplace --ExecutePreprocessor.kernel_name=ml-env --ExecutePreprocessor.timeout=-1 05_quantization.ipynb
```
- `ls -lh backend/models/distilbert_quantized.pt` is under 200 MB.
- `ls backend/models/distilbert_tokenizer/` contains `config.json` and tokenizer files and no `*.safetensors`.
- `git status --porcelain backend/models` lists only `distilbert_tokenizer/`.

## Success Criteria
- Gate cell passes: size < 200 MB, Macro F1 drop ≤ 2 points.
- Round-trip reload with `weights_only=True` matches the in-memory quantized model.
- Benchmark report written with real measured numbers.
- Release `model-v1` exists and a fresh `gh release download` into a temp dir matches the recorded SHA-256.

## Risks / Rollback
- If the F1 gate fails, record the numbers, stop before Phase 3, and decide between FP16 (project-plan fallback)
  and accepting the drop. Rollback: `git checkout` the notebook; delete the generated model files.
