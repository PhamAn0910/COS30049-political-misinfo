# Jupyter Kernel Configuration — Project Notebook

## Recommended kernel
Use `ml-env` (Python 3.11, conda at `/opt/anaconda3/envs/ml-env`, registered as `ml-env`).

## Why
The default base `python3` (Python 3.14.6, Apple Silicon `osx-arm64`) crashes with `SIGABRT` / `SIGSEGV` when importing TensorFlow (and related C-extension packages: `protobuf`, `abseil`). This is an ABI incompatibility between Python 3.14 and the native wheels for TensorFlow 2.21.0/2.22.0rc on `arm64` macOS.

## Verification
- `ml-env` loads `tensorflow 2.21.0`, `pandas 3.0.6`, `sklearn 1.9.1`, `numpy 2.4.6`, `matplotlib 3.11.2` without crash.
- Notebooks 01–07 depend on these. 04 (`distilbert_finetune`) and 05 (`quantization`) use PyTorch 2.14.1 and
  transformers 5.18.0 in `ml-env`, not TensorFlow. The first local run of 04 downloads the `distilbert-base-uncased`
  weights (about 268 MB); 04 is normally run on a Colab T4 GPU instead.
- Import `torch` before `sklearn`. Both ship their own `libomp`; when sklearn's loads first, torch's CPU kernels
  segfault (exit 139). Notebooks 04/05 and `app/services/inference.py` import torch first for this reason.

## How to switch (VS Code / Jupyter)
Select kernel in the top-right corner: `Python 3.11 (ml-env)`.

## Notebook metadata
`backend/notebooks/01_data_exploration.ipynb` is configured to `kernelspec.name = ml-env`.

## Reference
See pasted note on kernel crash (`SIGABRT` / `malloc` error under Python 3.14 + TensorFlow + Apple Silicon) and resolution via dedicated Python 3.11 environment.
