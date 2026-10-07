# Brainstorm Contract: Data Exploration & Preprocessing

Based on docs/political-misinfo-plan.md and repository context, this brainstorm establishes the bounded delivery contract for the data engineering foundation (Notebooks 01_data_exploration.ipynb, 02_preprocessing.ipynb, and the production service backend/app/services/preprocessor.py).

---

## 1. Outcome

A fully executed, deterministic data preparation suite that ingests, audits, and harmonizes two heterogeneous datasets (FakeNewsNet PolitiFact and PHEME Political Cascades), cleans social text for Transformer inference, produces stratified train/val/test CSV splits, and synchronizes cleaning logic with the FastAPI backend service (backend/app/services/preprocessor.py).

---

## 2. Constraints

- Hardware & Runtime: Must run efficiently on Apple Silicon (M3 16GB) without exceeding memory limits.
- Academic Rubric Compliance:
  - Ingest heterogeneous sources (news headlines + social media graph cascades).
  - Provide empirical justifications for downstream modeling choices (e.g., token length distributions for DistilBERT max_length, class ratios for weighted cross-entropy loss).
  - Extract both text content and user interaction cascades to satisfy Assignment 2 High Distinction (HD) criteria.
- Deterministic Splits: Fixed random seed (random_state=42) with stratified class preservation (70% train / 15% validation / 15% test).
- Inference Parity: Zero drift between experimental preprocessing in Jupyter notebooks and production inference in backend/app/services/preprocessor.py.

---

## 3. Non-Goals

- Model Training: DistilBERT fine-tuning, Ridge regression, and community detection belong to Notebooks 03–07 and are not executed in this phase.
- Real-Time Web Scraping: Ingesting live Twitter feeds to avoid grading environment instability.
- Database Migrations: Preprocessed datasets will be persisted as standard CSV files and serialized artifacts, not loaded into external SQL instances.

---

## 4. Acceptance Criteria

1. Exploratory Data Analysis (01_data_exploration.ipynb):
   - Executes cleanly end-to-end and outputs statistical tables and plots covering:
     - Combined class distribution across PolitiFact and PHEME (6,425 cascade threads).
     - Character, word, and estimated subword token length percentiles (95th percentile benchmarked for DistilBERT).
     - Lexical n-grams, sensational punctuation density, and vocabulary Jaccard similarity.
     - PHEME cascade topological metrics (cascade size, tree depth, user follower distributions).
   - Generates an automated markdown summary table at backend/reports/eda_summary.md.
2. Text Cleaning & Preprocessing (02_preprocessing.ipynb):
   - Implements normalization pipeline: Unicode NFKD, CamelCase hashtag splitting (#StopTheSteal → Stop The Steal), URL masking ([URL]), user handle masking (@USER), sensational punctuation collapsing, and emoji stripping.
   - Passes built-in unit assertion tests on benchmark edge cases.
   - Generates backend/data/processed/train.csv, val.csv, and test.csv with uniform schema [id, text_raw, text_clean, label, source, event, word_count].
   - Generates backend/data/processed/cascade_features.csv containing graph-level diffusion features (reach, depth, verified counts) for downstream spread modeling.
3. Production Service Synchronization (backend/app/services/preprocessor.py):
   - Matches the notebook cleaning pipeline exactly with unit assertions and test coverage.

---

## 5. Trade-Offs (Option Exploration)

### Approach 1: Multi-Granularity Harmonization (Source + Cascade Feature Extraction) — RECOMMENDED

- Description: Unifies seed claims and source tweets (total: 1,056 PolitiFact + 6,425 PHEME source threads) into primary NLP text splits while extracting a parallel tabular cascade dataset from PHEME graph trees for diffusion modeling.
- Core Assumption: The primary veracity signal is contained in the source claim/tweet, while conversational reply trees provide diffusion and community structure rather than standalone training labels.
- First Failure Condition: Fails if downstream NLP models require full multi-turn conversational context during text classification (which would require complex hierarchical networks exceeding the 200MB memory limit).

### Approach 2: Flattened All-Tweets Ingestion (~105,000 tweets)

- Description: Treats every reply tweet in PHEME cascades as an individual labeled training instance.
- Core Assumption: All replies in a rumor cascade share the rumor label.
- First Failure Condition: Fails immediately due to label contamination — factual debunking replies (e.g., "Police confirmed this is false") become mislabeled as misinformation (label=1), severely degrading model Macro F1.

### Approach 3: Global Stratified Split vs. Leave-One-Event-Out (LOTO) Split

- Description: Compares standard 70/15/15 stratified random sampling against holding out entire events (e.g., training on Ferguson + PolitiFact, testing on Charlie Hebdo).
- Core Assumption: Global stratification provides balanced representation across political domains and breaking news events for stable Transformer fine-tuning.
- First Failure Condition: LOTO fails on small events due to domain shift causing high variance in validation loss, while global stratification could exhibit slight event-topic overlap.
- Resolution: Use Global Stratified 70/15/15 as the primary benchmark dataset, while embedding an event metadata column to allow optional out-of-domain evaluation.

---

## 6. Better Approaches

Better approaches: none — recommended direction is Approach 1: Multi-Granularity Harmonization, as verified by inspecting the 6,425 NetworkX cascade graphs and PolitiFact CSVs.

---

## 7. Execution Roadmap

| Step | Target Artifact | Key Actions |
| --- | --- | --- |
| 1. Data Ingestion & Audit | `backend/notebooks/01_data_exploration.ipynb` | Load PolitiFact CSVs + PHEME .gpickle cascades. Audit nulls, duplicate headlines, class distribution (4,647 factual vs 2,834 misinformation), and event breakdowns. |
| 2. Statistical & Graph EDA | `backend/notebooks/01_data_exploration.ipynb` | Profile token distributions (confirm max_length=256), n-gram overlaps, sensationalism density, and cascade propagation velocities. Export `backend/reports/eda_summary.md`. |
| 3. Preprocessing Functions | `backend/notebooks/02_preprocessing.ipynb` | Define and test regex-based hashtag splitter, Unicode NFKD normalizer, entity masks ([URL], @USER), and punctuation reducers. |
| 4. Dataset Transformation & Splitting | `backend/data/processed/*.csv` | Apply transformations to 7,481 records. Perform stratified 70/15/15 split. Save `train.csv`, `val.csv`, `test.csv`, and `cascade_features.csv`. |
| 5. Service Parity Sync | `backend/app/services/preprocessor.py` | Implement / verify production Python module to match the notebook cleaning pipeline. |

---

## 8. Unresolved Questions

None — dataset structures, schemas, and cleaning rules are verified directly against local files.
