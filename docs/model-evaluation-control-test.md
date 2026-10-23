# Model Evaluation: the Control Test and the Veracity Relabel

Model-selection analysis for the Assignment 2 report. It explains why the first DistilBERT failed the Control Test,
what was changed, and the before/after numbers. Owner: Member 2 (An).

**Headline.** Retraining on true/false labels kept test Macro F1 well above the 0.75 gate (0.867) and fixed the
"officials confirmed = misinformation" error, so two of the three Control Test sentences now pass. It did **not**
make the model separate misinformation from factual text that shares its vocabulary. On the frozen contrast set its
style-balanced accuracy is 0.516, against 0.490 for a one-line regex that only reads writing style. A 0.026 gap is
well inside the noise of an 80-sentence set, so the honest claim is: **the new model does not beat the style
baseline.** Criterion 2 of [political-misinfo-plan.md](./political-misinfo-plan.md) is not met.

## Sources

| Label in this doc | What it is |
|---|---|
| **Before** | Model trained on rumour labels, commit `b401d82`. Read with `git show b401d82:backend/reports/distilbert_metrics.json` (also `distilbert_results.md`, `quantization_benchmark.md`). |
| **After** | Model `model-v2`, commit `1cd6eed`: [`distilbert_metrics.json`](../backend/reports/distilbert_metrics.json), [`distilbert_results.md`](../backend/reports/distilbert_results.md), [`quantization_benchmark.md`](../backend/reports/quantization_benchmark.md), [`split_baselines.md`](../backend/reports/split_baselines.md). |
| **Work log** | The plan's local work log (`plans/261022-1046-control-test-remediation/reports/work-log-and-reasoning.md`; `plans/` is gitignored). Diagnosis probes are from its 2026-10-22 entries, the model and epoch choice from its Phase 2 entry. |

## 1. Problem

Criterion 2 asks the dashboard to tell misinformation from factual text that uses similar vocabulary. The plan tests
this with three sentences (the "Control Test"):

| Case | Expected | Before: prediction, P(misinformation) | Result |
|---|---|---|---|
| C1 "BREAKING: Leaked documents confirm election officials destroyed 50,000 valid ballots ... SHARE NOW!!!" | misinformation, >= 90% | misinformation, 0.979 | pass |
| C2 "Election officials confirmed all 50,000 ballots were securely audited and counted ..." | factual, >= 85% | misinformation, 0.618 | fail |
| C3 "Ferguson police cover-up EXPOSED!!! Media won't tell you this!!! #Ferguson #TruthMatters" | misinformation | factual, 0.017 | fail |

The model passed 1 of 3 while scoring test Macro F1 0.857. A high test score with a failed Control Test meant the
model had learned something other than "misinformation".

## 2. Diagnosis

All probes used the saved FP32 model and the API's `preprocess_political_text` (work log, 2026-10-22).

**Preprocessing is not the cause.**

- C3 on raw, uncleaned text scores 0.032 instead of 0.017: the same wrong verdict.
- Collapsing `!!!` to `!` loses little. In PHEME, `!` appears in 4.9% of non-rumours and 3.0% of rumours, and
  repeated `!!`/`??` at about 1% in both.
- Dropping `#` helps: 78% of PHEME non-rumours have a hashtag against 62% of rumours, so keeping hashtags would push
  C3 further toward "factual".
- The word "Ferguson" is not the driver: swapping it for "Baltimore" gives 0.020.

**One signal is lost, by the model choice.** `distilbert-base-uncased` lowercases text, so `EXPOSED` and `exposed`
are one token. All-caps words (4+ letters) appear in 29.8% of PHEME rumours vs 12.2% of non-rumours, and 32.4% of
PolitiFact fakes vs 5.4% of real titles. A cased model was therefore tried in Phase 2 (section 4).

**Main cause: what the labels meant.** `label = 1` was a PHEME *rumour*, an unverified breaking-news claim, or a
PolitiFact fake. The model learned "a specific claim attributed to a source" = misinformation and "commentary" =
factual:

| Probe | P(misinformation) |
|---|---|
| "Officials confirmed" | 0.980 |
| "Election officials confirmed the results" | 0.911 |
| C2 without "Election officials confirmed" | 0.084 |
| "Media won't tell you this" | 0.074 |
| "Ferguson police covered up the shooting, leaked report shows" | 0.795 |

C2 failed because "officials confirmed ..." is how PHEME rumours are phrased ("confirm" is in 198 rows, 83% rumours),
and election words are almost absent ("ballot" 2 rows, "audited" 0). C3 failed because outrage without a concrete
event is what PHEME files as non-rumour; restating it as a concrete claim flips it to 0.795. The model was a fair
rumour detector for 2014-2015 breaking news, not a misinformation detector, and no preprocessing change closes that.

## 3. Why a contrast set, and why style-balanced accuracy

Three sentences cannot tell a real fix from luck, so an evaluation-only **contrast set** was built:
[`backend/data/eval/contrast_set.csv`](../backend/data/eval/contrast_set.csv), 40 pairs (80 sentences). Each pair
shares a topic and keywords; one sentence is factual (with a checkable `fact_source`) and one is misinformation.
It was reviewed, then frozen before any retrained model was scored. Its SHA-256 is
`2d4d4bbf9c91afe353c98eceea2123b293daa77569c52eb0e6d7b156b78c0ba9`, which notebook 04 asserts; it was re-checked
for this report. It is never used for training or model selection.

- **24 `style_aligned` pairs:** sensational misinformation vs neutral factual (the Control Test pattern).
- **16 `style_crossed` pairs:** sensational but true vs neutral but false.

Plain accuracy on this set rewards style. A regex that predicts misinformation when the text has a 4+ letter
all-caps word, `!!` or "share" scores 0.588 accuracy and 0.979 on the aligned pairs, while getting every crossed
sentence wrong. The headline metric is therefore **style-balanced accuracy**: the mean accuracy over the four
label x style cells. The regex scores 0.490 on it. A model reads more than style only if it beats that by more than
noise. With 80 sentences the 95% interval is about +/-13 points on accuracy, so this doc treats gaps under 0.10 as
noise.

## 4. Intervention

**Relabel by veracity.** The PHEME veracity release (figshare 6392078, CC BY 4.0) annotates every rumour as true,
false or unverified, and joins onto all 6,425 local threads
([`pheme_veracity_labels.csv`](../backend/data/pheme_veracity_labels.csv)). The new rule:

- `label = 1`: a PHEME rumour annotated false, or a PolitiFact fake.
- `label = 0`: a true rumour, a non-rumour, or a PolitiFact real title.
- **Unverified rumours are dropped** (690 rows): their truth is unknown, so neither label is honest.
- **`prince-toronto` and `ebola-essien` are dropped** (247 rows). They are 98% and 100% false, so a model could pass
  them by recognising the event. They stay in `cascade_features.csv` for the spread work.

After dedup this leaves 6,348 rows, 12.9% positive (PHEME 7.3%, PolitiFact 43.4%), split 4,443 / 952 / 953
([`split_baselines.md`](../backend/reports/split_baselines.md)).

**Model and epochs (Phase 2).** Both base models were trained on the new labels and compared on validation Macro F1
only; test was not scored and the contrast set was not used to choose.

| Config | Best epoch | Val Macro F1 | Contrast style-balanced (not used to choose) |
|---|---|---|---|
| `distilbert-base-uncased` | 3 | 0.866 | 0.552 |
| `distilbert-base-cased` | 5 | 0.847 | 0.469 |

Uncased was chosen: higher val F1, and it keeps the existing tokenizer contract. The cased model, despite keeping
capitals, labelled none of the 24 sensational misinformation sentences correctly. Training runs 5 epochs and keeps
the best epoch by validation Macro F1.

**Why LIAR was deferred.** Its roughly 12.8k politician statements would outnumber the rest of the data about 2:1,
turning the model into mostly a LIAR model. Text-only LIAR is known to be hard, cutting its six labels to two is a
judgement call, and it put criterion 1 at risk. Adding it in the same pass would also hide which change helped.

## 5. Results

Before = rumour labels (commit `b401d82`); after = veracity labels (`model-v2`, commit `1cd6eed`). The two test
splits are different (1,089 vs 953 rows, different label meaning), so test numbers compare how each model does on
its own task, not on the same rows. Three-decimal values follow `distilbert_results.md`, which rounds the unrounded
score; the JSON stores four decimals, so 0.8675 there reads as 0.867 here.

| Metric | Before | After | Source (after) |
|---|---|---|---|
| Test Macro F1 (gate >= 0.75) | 0.857 | **0.867** | `distilbert_metrics.json` `macro_f1` 0.8675 |
| Test Macro F1, PHEME | 0.857 | 0.850 | `per_source_macro_f1` |
| Test Macro F1, PolitiFact | 0.857 | 0.844 | `per_source_macro_f1` |
| Unseen-event Macro F1, DistilBERT (see note) | 0.622 (8 events) | 0.546 (4 events) | `unseen_event_macro_f1` |
| TF-IDF + LogReg, test Macro F1 | 0.843 | 0.784 | `baseline_comparison`, `split_baselines.md` |
| TF-IDF + LogReg, unseen-event Macro F1 | 0.597 | 0.541 | `tfidf_unseen_event_macro_f1` |
| Control Test C1 (misinformation >= 90%) | pass, 0.979 | pass, 0.902 | `control_test` |
| Control Test C2 (factual >= 85%) | fail, 0.618 misinformation | **pass, 0.993 factual** | `control_test` 0.9935 |
| Control Test C3 (misinformation) | fail, 0.983 factual | fail, 0.998 factual | `control_test` |
| Control Test passed | 1 of 3 | 2 of 3 | `control_test` |
| Contrast set accuracy | 0.525 | 0.512 | `contrast_set.accuracy` |
| Contrast set pair accuracy | 0.250 | 0.200 | `contrast_set.pair_accuracy` |
| **Contrast set style-balanced accuracy** | 0.510 | **0.516** | `contrast_set.style_balanced_accuracy` |
| Contrast set crossed pairs right | 0 of 16 | 3 of 16 | `by_pair_type.style_crossed.pair_accuracy` 0.1875 |
| Regex style baseline, style-balanced accuracy | 0.490 | 0.490 | `contrast_set.regex_baseline` |
| Regex style baseline, accuracy | 0.588 | 0.588 | `contrast_set.regex_baseline` |
| INT8 size (gate < 200 MB) | 138.7 MB | 138.7 MB | `quantization_benchmark.md` |
| INT8 Macro F1 drop (gate <= 2 points) | 0.23 points | 0.96 points | `quantization_benchmark.md` (0.8675 to 0.8579) |

**Unseen-event protocol note.** "Before" holds out each of the 8 PHEME events with at least 100 threads. "After"
holds out only events with at least 100 threads **and** at least 10 false threads (charliehebdo, germanwings-crash,
ottawashooting, sydneysiege), because an event with almost no false threads has no meaningful Macro F1. The two
numbers use different events, label meanings and class balances, so they are **not directly comparable**. What does
compare is each model against TF-IDF under the same protocol: before 0.622 vs 0.597, after 0.546 vs 0.541. In both,
DistilBERT is barely above TF-IDF on events it never saw, so the event shortcut is not solved.

**Contrast set by label and style** (accuracy, `distilbert_results.md`):

| Label | Style | Rows | Before | After |
|---|---|---|---|---|
| factual | neutral | 24 | 0.625 | 0.625 |
| misinformation | sensational | 24 | 0.542 | 0.375 |
| factual | sensational | 16 | 0.312 | 0.562 |
| misinformation | neutral | 16 | 0.562 | 0.500 |

**Reading the results.**

- **Gates.** Criterion 1 (test Macro F1 0.867 >= 0.75) and criterion 5 (INT8 138.7 MB, 0.96-point drop) pass.
  `model-v2` is the shipped model.
- **What the relabel fixed.** The model no longer treats an attributed report as misinformation. C2 flipped from
  0.618 misinformation to 0.993 factual, and sensational factual sentences went from 0.312 to 0.562 correct.
- **What it did not fix.** Style-balanced accuracy moved from 0.510 to 0.516; the regex is at 0.490. Both gaps are
  far under the 0.10 noise margin, so **the new model does not beat the style baseline** and there is no evidence
  it reads content rather than style. Sensational misinformation is now under-detected (0.542 to 0.375), and C3
  still fails with high confidence. C1 passes by 0.002 over its 0.90 bar; in the Phase 2 run of the same
  configuration it scored 0.821 and failed, so its pass is within run-to-run variation.
- **Criterion 2 is not met.** The improvement on the Control Test (1 to 2 of 3) is real for C2 but is not supported
  by the broader contrast set.

## 6. Limitations

- **Few false rumours.** Training has 574 positives, of which only 276 are false PHEME rumours (7.3% of PHEME
  training rows); the rest are PolitiFact fakes. Val and test have 123 positives each, so test Macro F1 moves by
  roughly +/-4 points between splits. TF-IDF fell from a 0.806 proxy to 0.784 on the regenerated split for this
  reason alone.
- **Text-only veracity needs world knowledge.** Deciding whether "the soldier shot at the Ottawa war memorial
  survived" is false requires knowing what happened. A 66M-parameter classifier trained on 2014-2015 tweets cannot
  retrieve that; it can only learn how false claims tend to be written, which is close to style.
- **Contrast set size.** 80 sentences give about +/-13 points of noise on accuracy, and 16 crossed pairs move by
  about 6 points per pair. It can show a large effect (for example 0.49 to 0.70) but not a small one. The sentences
  were drafted with AI assistance and reviewed once; they are political claims, while most training text is
  breaking-news tweets.
- **2014-2015 events.** PHEME covers nine news events from 2014-2015. The unseen-event scores (0.546) suggest
  accuracy on new events and new topics, such as current US election claims, will be much lower than the 0.867
  test score.
- **The event shortcut remains.** Under both label schemes DistilBERT is within a few points of TF-IDF on held-out
  events.

## 7. Demo notes: presenting the Control Test honestly

- **Run all three sentences, and say the result is 2 of 3.** Do not drop C3 from the demo.
- **Explain C2 as the real gain.** The first model called a neutral audit report misinformation because PHEME
  rumours are phrased "officials confirmed ...". Relabeling by veracity removed that error.
- **Explain C3 as the open limit.** The model has no evidence that the Ferguson claim is false; it sees outrage and
  hashtags, which in PHEME are more common in non-rumour threads than in rumours. Detecting it needs world knowledge
  or a fact-checking source, not punctuation rules.
- **Do not present C1's 0.902 as a strong pass.** It is 0.002 over the bar and failed (0.821) in an earlier run of
  the same configuration.
- **Show the contrast set number next to the regex.** 0.516 vs 0.490 is the honest summary: the model does not yet
  read misinformation beyond style. Graders reward that analysis more than an unexplained 3 of 3.
- **Do not tune to the three sentences.** Editing thresholds, data or preprocessing until they pass would make the
  demo pass and the model no better.

Further detail, including every probe and per-epoch table, is in the plan's work log (local) and in
[`distilbert_results.md`](../backend/reports/distilbert_results.md).
