# Role/Owner: Member 2 (ML & Data Engineering Lead)
# Core Responsibility: Build the Assignment 2 submission zip (source code, processed datasets, final models, README)
# Key Interface/Contract: writes group-1-assignment2.zip at the repo root; reads git's list of committed files

"""
Packs only files that git tracks under backend/, plus README.md and environment.yml at the repo root, so
caches, .DS_Store, scratch notebooks and the raw PHEME release (gitignored) never reach the zip. The final
DistilBERT model (backend/models/distilbert_quantized.pt) is gitignored for its size, so it is added on its own.

Run from anywhere inside the repo:
    python backend/scripts/package_submission.py
    python backend/scripts/package_submission.py --out other-name.zip --force
"""

import argparse
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MODEL = "backend/models/distilbert_quantized.pt"
ROOT_FILES = ["README.md", "environment.yml"]
REQUIRED = ["README.md"]


def tracked_files() -> list:
    # Committed files only: anything untracked or gitignored stays out without an exclude list.
    out = subprocess.run(["git", "ls-files", "-z", "--", "backend", *ROOT_FILES], cwd=ROOT,
                         capture_output=True, check=True).stdout
    return sorted(p for p in out.decode("utf-8").split("\0") if p)


def uncommitted_changes() -> list:
    # Edited but uncommitted files would be packed from disk, so the zip would not match the repo history.
    out = subprocess.run(["git", "status", "--porcelain", "--", "backend", *ROOT_FILES], cwd=ROOT,
                         capture_output=True, text=True, check=True).stdout
    return [line for line in out.splitlines() if not line.startswith("??")]


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the Assignment 2 submission zip.")
    parser.add_argument("--out", default="group-1-assignment2.zip", help="zip path, relative to the repo root")
    parser.add_argument("--force", action="store_true", help="overwrite the zip if it already exists")
    parser.add_argument("--no-model", action="store_true",
                        help=f"leave out {MODEL} (use when Canvas rejects the full size and share it by link)")
    args = parser.parse_args()

    out = (ROOT / args.out).resolve()
    if out.exists() and not args.force:
        print(f"error: {out} exists; pass --force to overwrite", file=sys.stderr)
        return 1

    # The rubric requires a README that explains setup, training and prediction.
    missing = [f for f in REQUIRED if not (ROOT / f).is_file()]
    if missing:
        print(f"error: missing {', '.join(missing)} at the repo root; write and commit it first", file=sys.stderr)
        return 1

    files = tracked_files()
    for f in REQUIRED:
        if f not in files:
            print(f"warning: {f} exists but is not committed; it is packed anyway", file=sys.stderr)
            files.append(f)
    if not args.no_model:
        if not (ROOT / MODEL).is_file():
            print(f"error: {MODEL} not found; run notebook 05 or pass --no-model", file=sys.stderr)
            return 1
        files.append(MODEL)

    changes = uncommitted_changes()
    if changes:
        print("warning: uncommitted changes are packed as they are on disk:", file=sys.stderr)
        for line in changes:
            print("   ", line, file=sys.stderr)

    # A deleted-but-still-tracked path would make zipfile fail halfway, so skip it with a note.
    gone = [f for f in files if not (ROOT / f).is_file()]
    for f in gone:
        print(f"warning: {f} is tracked but missing on disk; skipped", file=sys.stderr)
    files = [f for f in files if f not in gone]

    with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            zf.write(ROOT / f, arcname=f)

    with zipfile.ZipFile(out) as zf:
        largest = sorted(zf.infolist(), key=lambda i: i.compress_size, reverse=True)[:10]
    print(f"wrote {out} ({out.stat().st_size / 1e6:.1f} MB, {len(files)} files)")
    print("largest entries (compressed):")
    for info in largest:
        print(f"  {info.compress_size / 1e6:8.1f} MB  {info.filename}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
