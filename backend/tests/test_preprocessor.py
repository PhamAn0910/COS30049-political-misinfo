# Role/Owner: Member 2 (ML & Data Engineering Lead)
# Core Responsibility: Unit tests for the political text cleaning pipeline and its parity with the processed CSVs
# Key Interface/Contract: Exercises `app.services.preprocessor`; run with `python -m pytest tests/test_preprocessor.py`

from pathlib import Path

import pandas as pd
import pytest

from app.services.preprocessor import (
    clean_political_text,
    mask_entities,
    normalize_punctuation,
    normalize_unicode,
    preprocess_political_text,
    remove_emojis,
    split_hashtags,
)

TRAIN_CSV = Path(__file__).resolve().parents[1] / "data" / "processed" / "train.csv"


@pytest.mark.parametrize("raw, expected", [
    ("Hard to believe \U0001F602\U0001F602\U0001F602", "Hard to believe"),        # faces
    ("Flag \U0001F1FA\U0001F1F8 here ❤️", "Flag here"),                  # flag and heart + selector
    ("Sunny ☀ and ⭐ stars", "Sunny and stars"),                          # symbols and decorative stars
    ("\U0001F602\U0001F602 \U0001F525", ""),                                      # purely symbolic input
])
def test_emoji_removal(raw, expected):
    assert preprocess_political_text(raw) == expected


@pytest.mark.parametrize("raw, expected", [
    ("#StopTheSteal", "Stop The Steal"),
    ("#BBCNews live", "BBC News live"),
    ("#COVID19", "COVID 19"),
    ("##ParisShooting", "Paris Shooting"),
    ("#ferguson", "ferguson"),
    ("#black_lives_matter", "black lives matter"),
])
def test_hashtag_splitting(raw, expected):
    assert split_hashtags(raw) == expected
    assert preprocess_political_text(raw) == expected


@pytest.mark.parametrize("raw, expected", [
    ("Breaking: https://t.co/xyz123", "Breaking: [URL]"),
    ("see http://a.co/1 and www.b.com/x", "see [URL] and [URL]"),
    ("HTTPS://EXAMPLE.COM/#Tag", "[URL]"),
])
def test_url_masking(raw, expected):
    assert preprocess_political_text(raw) == expected


@pytest.mark.parametrize("raw, expected", [
    ("@realDonaldTrump says hello", "@USER says hello"),
    ("RT .@rolandsmartin: wow", "RT .@USER: wow"),
    ("mail me at a@b.com", "mail me at a@b.com"),
])
def test_mention_masking(raw, expected):
    assert preprocess_political_text(raw) == expected


def test_mask_entities_stage():
    assert mask_entities("@CNN at https://cnn.com") == "@USER at [URL]"


@pytest.mark.parametrize("raw, expected", [
    ("Fraud!!!!!", "Fraud !"),
    ("Really???", "Really ?"),
    ("What?!?!", "What ?"),
    ("Wait....", "Wait."),
    ("Wait…", "Wait."),
    ("Price is 3.5%", "Price is 3.5%"),
])
def test_punctuation_collapse(raw, expected):
    assert preprocess_political_text(raw) == expected


def test_normalize_punctuation_stage():
    assert normalize_punctuation("No!!!") == "No !"


@pytest.mark.parametrize("raw, expected", [
    ("Тrump", "Trump"),                       # Cyrillic capital TE
    ("Оbаmа", "Obama"),             # Cyrillic O and a
    ("Οpen αccess", "Open access"),      # Greek omicron and alpha
    ("café naïve", "cafe naive"),        # accents stripped
    ("ＦＡＫＥ ﬁle", "FAKE file"),  # fullwidth letters and ligature
])
def test_unicode_normalization(raw, expected):
    assert preprocess_political_text(raw) == expected


def test_normalize_unicode_stage():
    assert normalize_unicode("Тrump") == "Trump"
    assert remove_emojis("a\U0001F600b").split() == ["a", "b"]


@pytest.mark.parametrize("raw, expected", [
    ("Cops &amp; protesters", "Cops & protesters"),
    ("&quot;Breaking&quot; &lt;news&gt;", '"Breaking" <news>'),
])
def test_html_entities(raw, expected):
    assert preprocess_political_text(raw) == expected


@pytest.mark.parametrize("raw", [None, "", "   ", "  \n\t ", float("nan")])
def test_empty_input_returns_empty_string(raw):
    assert preprocess_political_text(raw) == ""


def test_max_length_truncation():
    long_text = " ".join(f"w{i}" for i in range(1000))
    assert len(preprocess_political_text(long_text).split()) == 512
    assert preprocess_political_text(long_text, max_length=10) == " ".join(f"w{i}" for i in range(10))
    assert preprocess_political_text("short text", max_length=10) == "short text"


def test_whitespace_collapse_and_idempotence():
    once = preprocess_political_text("  multiple   spaces\nand\tnewlines #StopTheSteal!!! ")
    assert once == "multiple spaces and newlines Stop The Steal !"
    assert preprocess_political_text(once) == once


def test_public_entry_point_matches_pipeline():
    text = "RT @user: #FakeNews!!! https://t.co/x \U0001F602"
    assert preprocess_political_text(text) == clean_political_text(text)


def test_processed_csv_parity():
    if not TRAIN_CSV.exists():
        pytest.skip("train.csv not generated; run notebooks/02_preprocessing.ipynb")
    rows = pd.read_csv(TRAIN_CSV, nrows=200, keep_default_na=False)
    mismatches = [
        (row.id, row.text_clean, preprocess_political_text(row.text_raw))
        for row in rows.itertuples()
        if preprocess_political_text(row.text_raw) != row.text_clean
    ]
    assert len(rows) == 200
    assert not mismatches, f"{len(mismatches)} rows differ from train.csv, first: {mismatches[0]}"
