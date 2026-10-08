# Exploratory Data Analysis & Empirical Dataset Profiling Report

- **Date:** 2026-10-08
- **Role/Owner:** Member 2 (ML & Data Engineering Lead)
- **Project:** Political & Breaking News Misinformation Detection System
- **Datasets Analyzed:** FakeNewsNet PolitiFact (1,056 claims) + PHEME Political Cascades (6,425 interaction trees)
- **Unified Corpus Size:** 7,481 harmonized raw records

---

## 1. Executive Summary & Corpus Overview

This empirical study audits, harmonizes, and profiles 7,481 heterogeneous political and breaking news records to guide downstream model design, text normalization, and diffusion spread prediction.

### Key Empirical Findings:
1. **Class Distribution:** The unified corpus contains **2,834 Misinformation (37.9%)** and **4,647 Factual (62.1%)** claims. Inverse-frequency class weighting yields $W_0 = 0.8049$ and $W_1 = 1.3199$ (ratio 1.64), justifying weighted cross-entropy loss in DistilBERT fine-tuning.
2. **Token Length Boundaries:** Subword sequence lengths using `distilbert-base-uncased` exhibit a median ($P_{50}$) of 36 tokens, a 95th percentile ($P_{95}$) of 54 tokens, and a maximum of 73 tokens. Exactly **100.00% of all samples** fall within $\le 256$ tokens, providing empirical proof for setting `max_length=256`.
3. **Lexical Divergence:** Vocabulary Jaccard similarity is **19.4%** ($J = 0.1937$), confirming distinct stylistic and linguistic signatures between factual reporting and rumor propagation.
4. **Sensationalism Signature:** Misinformation texts exhibit **2.06x higher density of ALL-CAPS words** (0.4418 vs. 0.2285) and elevated question mark density (+29.3%), evidencing heightened emotional arousal and speculative framing.
5. **Diffusion Cascade Topology:** PHEME rumor cascades originate from users with **1.68x higher mean follower counts** (1,552,531 vs. 925,915) and a higher proportion of verified accounts (59.2% vs. 48.0%), justifying root user graph features in the downstream Ridge spread regressor.

---

## 2. Dataset Ingestion & Class Balance Profile

| Dataset Source | Factual / Real (0) | Misinformation / Rumor (1) | Total Records | Misinformation Ratio (%) | Inverse Class Weight ($W_c$) |
|---|---|---|---|---|---|
| **FakeNewsNet (PolitiFact)** | 624 | 432 | 1,056 | 40.9% | - |
| **PHEME Political Cascades** | 4,023 | 2,402 | 6,425 | 37.4% | - |
| **Unified Harmonized Corpus** | **4,647** | **2,834** | **7,481** | **37.9%** | **$W_0 = 0.8049, W_1 = 1.3199$** |

### Loss Function Formulation:
$$\mathcal{L}_{\text{weighted}} = - \frac{1}{N} \sum_{i=1}^N \left[ W_1 \cdot y_i \log(\hat{y}_i) + W_0 \cdot (1 - y_i) \log(1 - \hat{y}_i) \right]$$

Applying $W_1 / W_0 = 1.6397$ ensures gradient parity across positive and negative classes during Transformer fine-tuning.

---

## 3. Text Length & Sequence Tokenization Profile

Sequence metrics computed on raw text using whitespace splitting and the Hugging Face `distilbert-base-uncased` tokenizer:

| Metric | Mean ± Std | Min | $P_{50}$ (Median) | $P_{75}$ | $P_{90}$ | $P_{95}$ | $P_{99}$ | Max |
|---|---|---|---|---|---|---|---|---|
| **Character Length** | 109.8 ± 32.0 | 10 | 121 | 136 | 139 | 140 | 144 | 340 |
| **Word Count** | 15.2 ± 5.2 | 1 | 15 | 19 | 22 | 23 | 26 | 53 |
| **DistilBERT Tokens** | 34.9 ± 13.0 | 4 | 36 | 45 | 51 | 54 | 59 | 73 |

### Token Coverage Bounds:
- **Texts $\le 128$ Tokens:** 100.00% (covers 100% of the entire corpus)
- **Texts $\le 256$ Tokens:** 100.00% (zero truncation overhead)

---

## 4. Lexical, Hashtag & Sensationalism Metrics

### Vocabulary Overlap:
- **Factual Vocabulary ($V_0$):** 11,101 unique terms
- **Misinformation Vocabulary ($V_1$):** 6,873 unique terms
- **Shared Lexicon ($V_0 \cap V_1$):** 2,916 terms
- **Jaccard Similarity Index:** $J(V_0, V_1) = 0.1937$ (19.4% lexical overlap)

### Sensationalism Density Indicators (Mean per Claim):

| Indicator | Factual (0) | Misinformation (1) | Relative Disparity | Analytical Insight |
|---|---|---|---|---|
| **ALL-CAPS Words** | 0.2285 | 0.4418 | **+106.0% (2.06x)** | Strong indicator of urgent emotional shouting in fake claims |
| **Question Marks (`?`)** | 0.0600 | 0.0776 | **+29.3%** | Unverified rumor cascades frequently frame claims as questions |
| **Exclamation Marks (`!`)** | 0.0628 | 0.0533 | -15.1% | Exclamations occur across both breaking news reporting and rumors |

### Top 10 Political Crisis Hashtags:
`#CharlieHebdo` (1,125), `#Ferguson` (1,025), `#sydneysiege` (447), `#JeSuisCharlie` (329), `#MikeBrown` (223), `#SydneySiege` (196), `#Germanwings` (147), `#BREAKING` (136), `#OttawaShooting` (119), `#Ottawa` (119)

---

## 5. PHEME Cascade Graph & Diffusion Topology Metrics

Structural diffusion metrics computed across 6,425 NetworkX interaction trees:

| Graph Metric | Factual Cascades (0) [Mean ± Std / Median] | Rumor Cascades (1) [Mean ± Std / Median] | Max Observed | Downstream Modeling Role |
|---|---|---|---|---|
| **Cascade Size (Nodes)** | 18.00 ± 21.62 (Med: 14) | 13.89 ± 15.95 (Med: 10) | 346 | Target variable in Ridge spread regression |
| **Tree Depth (Levels)** | 3.47 ± 3.99 (Med: 2) | 2.76 ± 3.42 (Med: 2) | 47 | Structural depth propagation feature |
| **Root User Followers** | 925,915 ± 2,762,473 (Med: 42,693) | 1,552,531 ± 3,731,043 (Med: 110,900) | 25,303,087 | User reach feature (log-transformed) |
| **Root User Verified (%)** | 48.0% | 59.2% | 100% | Binary root account credibility signal |

---

## 6. Downstream Modeling & Pipeline Recommendations

1. **Preprocessing (`02_preprocessing.ipynb` & `preprocessor.py`):**
   - Implement Unicode NFKD normalization to neutralize lookalike homoglyphs.
   - Segment CamelCase political hashtags (e.g., `#StopTheSteal` -> `Stop The Steal`) to retain rich lexical semantics.
   - Mask entity handles (`@USER`) and hyperlinks (`[URL]`) while preserving sensational exclamation collapsing (`!!!` -> `!`).
2. **Text Model Training (`04_distilbert_finetune.ipynb`):**
   - Configure tokenizer with `max_length=256` (100% coverage, minimal padding overhead).
   - Use weighted cross-entropy loss with positive class weight $W_1/W_0 = 1.6397$ to prevent majority class bias.
3. **Graph Diffusion Modeling (`07_spread_prediction.ipynb`):**
   - Extract `cascade_features.csv` including log-transformed root followers, tree depth, user verification, and edge density to train the Ridge cascade spread regressor.
