# Role/Owner: Member 3 (Analytics, Graph & Visualization Lead)
# Core Responsibility: Turn the raw PHEME veracity release into one pseudonymous tweet-level interaction table
# Key Interface/Contract: writes backend/data/processed/pheme_interactions.csv.gz, read by notebooks 06 and 07

"""
The Hugging Face graph file used by notebooks 01-02 drops user ids and timestamps. The raw release
(figshare 6392078, CC BY 4.0, gitignored at backend/data/pheme_veracity/) still has them. This script keeps
only what FR2 and FR3 need, replaces real user ids with stable keys (u0, u1, ...) and drops tweet text and
reply tweet ids, so the output can be committed to the public repo.

Run from the repo root:
    python backend/scripts/extract_pheme_interactions.py
"""

import argparse
import gzip
import io
import json
from email.utils import parsedate_to_datetime
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "backend" / "data" / "pheme_veracity" / "all-rnr-annotated-threads"
FEATURES = ROOT / "backend" / "data" / "processed" / "cascade_features.csv"
OUT = ROOT / "backend" / "data" / "processed" / "pheme_interactions.csv.gz"


def read_tweets(raw_dir):
    rows = []
    for thread_dir in sorted(p for p in raw_dir.glob("*/*/*") if p.is_dir()):
        event = thread_dir.parents[1].name
        for kind in ("source-tweets", "reactions"):
            for f in sorted((thread_dir / kind).glob("*.json")):
                t = json.loads(f.read_text(encoding="utf-8"))
                if kind == "reactions" and str(t["id"]) == thread_dir.name:
                    continue                         # 772 threads store their source tweet again under reactions/
                rows.append({
                    "thread_id": thread_dir.name,
                    "event": event,
                    "is_source": int(kind == "source-tweets"),
                    "user_id": int(t["user"]["id"]),
                    "reply_to_user_id": t.get("in_reply_to_user_id"),
                    "created_at": parsedate_to_datetime(t["created_at"]),
                    "user_followers": int(t["user"]["followers_count"]),
                    "user_verified": int(bool(t["user"]["verified"])),
                })
    return pd.DataFrame(rows)


def build(raw_dir, features_csv):
    tw = read_tweets(raw_dir)

    # Stable pseudonyms: rank of the real id among the users who tweet in the dataset
    key = {uid: f"u{i}" for i, uid in enumerate(sorted(tw["user_id"].unique()))}
    tw["user_key"] = tw["user_id"].map(key)
    tw["reply_to_user_key"] = tw["reply_to_user_id"].map(lambda u: key.get(int(u)) if pd.notna(u) else None)

    source_time = tw[tw["is_source"] == 1].set_index("thread_id")["created_at"]
    tw["minutes_after_source"] = (tw["created_at"] - tw["thread_id"].map(source_time)).dt.total_seconds() / 60

    cascade_ids = set(pd.read_csv(features_csv, dtype={"cascade_id": str})["cascade_id"])
    assert tw["thread_id"].nunique() == 6425, tw["thread_id"].nunique()
    assert (tw.groupby("thread_id")["is_source"].sum() == 1).all(), "every thread needs exactly one source tweet"
    assert (tw["minutes_after_source"] >= 0).all(), "a reply is older than its source tweet"
    assert set(tw["thread_id"]) == cascade_ids, "threads differ from cascade_features.csv"

    cols = ["thread_id", "event", "is_source", "user_key", "reply_to_user_key",
            "minutes_after_source", "user_followers", "user_verified"]
    return (tw[cols].sort_values(["thread_id", "minutes_after_source", "user_key"], kind="stable")
            .reset_index(drop=True))


def write(df, out):
    text = df.to_csv(index=False, float_format="%.4f", lineterminator="\n")
    buf = io.BytesIO()
    with gzip.GzipFile(filename="", mode="wb", fileobj=buf, mtime=0) as gz:   # mtime=0 keeps the file byte-identical
        gz.write(text.encode("utf-8"))
    out.write_bytes(buf.getvalue())


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--raw", type=Path, default=RAW)
    parser.add_argument("--features", type=Path, default=FEATURES)
    parser.add_argument("--out", type=Path, default=OUT)
    args = parser.parse_args()

    df = build(args.raw, args.features)
    write(df, args.out)
    print(f"{len(df):,} tweets | {df['thread_id'].nunique():,} threads | {df['user_key'].nunique():,} users -> {args.out}")


if __name__ == "__main__":
    main()
