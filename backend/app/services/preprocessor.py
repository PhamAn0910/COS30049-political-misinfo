# Role/Owner: Member 2 (ML & Data Engineering Lead)
# Core Responsibility: Political text cleaning, Unicode normalization, hashtag splitting, and URL masking
# Key Interface/Contract: `preprocess_political_text(text: str, max_length: int) -> str` consumed by routes/predict.py;
#   `clean_political_text` and its stages are imported by notebooks/02_preprocessing.ipynb (single source of truth)

import html
import math
import re
import unicodedata

# Cyrillic and Greek characters that render identically to Latin letters
HOMOGLYPHS = str.maketrans({
    "а": "a", "е": "e", "о": "o", "р": "p", "с": "c", "у": "y", "х": "x",
    "і": "i", "ј": "j", "ѕ": "s", "һ": "h", "ԁ": "d", "ɡ": "g",
    "А": "A", "В": "B", "Е": "E", "К": "K", "М": "M", "Н": "H", "О": "O",
    "Р": "P", "С": "C", "Т": "T", "Х": "X", "І": "I", "Ј": "J", "Ѕ": "S",
    "ο": "o", "α": "a", "ν": "v", "ι": "i",
    "Α": "A", "Β": "B", "Ε": "E", "Ζ": "Z", "Η": "H", "Ι": "I", "Κ": "K",
    "Μ": "M", "Ν": "N", "Ο": "O", "Ρ": "P", "Τ": "T", "Υ": "Y", "Χ": "X",
})

EMOJI_PATTERN = re.compile(
    "["
    "\U0001F000-\U0001FAFF"  # emoticons, pictographs, transport, flags, supplemental symbols
    "☀-➿"          # misc symbols and dingbats
    "⬀-⯿"          # arrows and stars used as decoration
    "︎️‍"     # variation selectors and zero-width joiner
    "]+"
)
URL_PATTERN = re.compile(r"(?:https?://|www\.)\S+", flags=re.IGNORECASE)
MENTION_PATTERN = re.compile(r"(?<!\w)@\w+")
HASHTAG_PATTERN = re.compile(r"#+(\w+)")


def normalize_unicode(text: str) -> str:
    """Fold homoglyphs, apply NFKD, and drop combining accent marks."""
    text = text.translate(HOMOGLYPHS)
    text = unicodedata.normalize("NFKD", text)
    return "".join(ch for ch in text if not unicodedata.combining(ch))


def remove_emojis(text: str) -> str:
    """Strip emoji and decorative pictographic symbols."""
    return EMOJI_PATTERN.sub(" ", text)


def mask_entities(text: str) -> str:
    """Replace URLs with [URL] and Twitter handles with @USER."""
    text = URL_PATTERN.sub("[URL]", text)
    return MENTION_PATTERN.sub("@USER", text)


def _split_tag(match: re.Match) -> str:
    tag = match.group(1).replace("_", " ")
    tag = re.sub(r"([a-z])([A-Z])", r"\1 \2", tag)        # StopThe -> Stop The
    tag = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1 \2", tag)  # BBCNews -> BBC News
    tag = re.sub(r"([A-Za-z])(\d)", r"\1 \2", tag)        # COVID19 -> COVID 19
    return tag


def split_hashtags(text: str) -> str:
    """Expand #CamelCase hashtags into words and drop the # symbol."""
    return HASHTAG_PATTERN.sub(_split_tag, text)


def normalize_punctuation(text: str) -> str:
    """Collapse repeated !/? into one standalone mark and repeated dots into one."""
    text = re.sub(r"\s*([!?])[!?]*", r" \1", text)
    return re.sub(r"\.{2,}", ".", text)


def clean_political_text(text, max_length: int = 512) -> str:
    """Run the full cleaning pipeline; None, NaN and blank input return ''."""
    if text is None or (isinstance(text, float) and math.isnan(text)):
        return ""
    text = str(text)
    if not text.strip():
        return ""

    cleaned = html.unescape(text)
    cleaned = normalize_unicode(cleaned)
    cleaned = remove_emojis(cleaned)
    cleaned = mask_entities(cleaned)
    cleaned = split_hashtags(cleaned)
    cleaned = normalize_punctuation(cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()

    words = cleaned.split()
    if len(words) > max_length:
        cleaned = " ".join(words[:max_length])
    return cleaned


def preprocess_political_text(text: str, max_length: int = 512) -> str:
    """Clean and normalize political claim/tweet text for model inference."""
    return clean_political_text(text, max_length=max_length)
