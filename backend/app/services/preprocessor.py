# Role/Owner: Member 2 (ML & Data Engineering Lead)
# Core Responsibility: Political text cleaning, Unicode normalization, hashtag splitting, and URL masking
# Key Interface/Contract: `preprocess_political_text(text: str, max_length: int) -> str` consumed by routes/predict.py

import re
import unicodedata


def remove_emojis(text: str) -> str:
    """Remove emoji characters from input text."""
    emoji_pattern = re.compile(
        "[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF"
        "\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF"
        "\U00002702-\U000027B0\U000024C2-\U0001F251]+",
        flags=re.UNICODE,
    )
    return emoji_pattern.sub("", text)


def split_hashtags(text: str) -> str:
    """Split camelCase and PascalCase hashtags into separate words."""
    def split_camel(match):
        tag = match.group(1)
        return re.sub(r"([a-z])([A-Z])", r"\1 \2", tag)

    return re.sub(r"#(\w+)", split_camel, text)


def preprocess_political_text(text: str, max_length: int = 512) -> str:
    """
    Clean and normalize political claim/tweet text for model inference.
    Handles emojis, Unicode NFKD, hashtag splitting, URL masking, and mention normalization.
    """
    if not text:
        return ""

    cleaned = remove_emojis(text)
    cleaned = unicodedata.normalize("NFKD", cleaned)
    cleaned = split_hashtags(cleaned)
    cleaned = re.sub(r"https?://\S+", "[URL]", cleaned)
    cleaned = re.sub(r"@\w+", "@USER", cleaned)
    cleaned = re.sub(r"[?!]{2,}", "?", cleaned)
    cleaned = re.sub(r"\.{2,}", ".", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()

    words = cleaned.split()
    if len(words) > max_length:
        cleaned = " ".join(words[:max_length])

    return cleaned
