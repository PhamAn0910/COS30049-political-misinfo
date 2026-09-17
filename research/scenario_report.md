## Scenario Report: Automated Fact-Checking Dashboard for Health Misinformation

Dimensions analyzed: Input Extremes, Timing, Error Cascades, Data Integrity, Integration, Business Logic
Dimensions skipped: 
- User Types (Assumption: App is a public dashboard without complex role-based access for this phase)
- Scale (Assumption: University demo scale is small/controlled)
- State Transitions (Assumption: Stateless single-page analysis)
- Environment (Assumption: Web-based demo, standard desktop)
- Authorization (Assumption: No sensitive user data involved)
- Compliance (Assumption: Analyzing public posts, no PII storage)

| # | Dimension | Scenario | Severity | Expected Behavior |
|---|-----------|----------|----------|-------------------|
| 1 | Input Extremes | Input contains dense medical jargon mixed with slang/sarcasm (e.g., "Big Pharma 🤡 is hiding the real cure") | High | Model should parse context correctly, relying on attention mechanisms, rather than failing on emojis or slang. |
| 2 | Input Extremes | Input is a thread or extremely long post exceeding standard Transformer token limits (e.g., > 512 tokens) | Medium | Backend should truncate or chunk the text appropriately before passing to the model, returning an analysis of the first chunk with a warning. |
| 3 | Data Integrity | Tweet uses "leetspeak" or weird Unicode fonts (e.g., "v@cc1ne") designed to bypass traditional filters | High | Preprocessing pipeline must normalize text and strip obscure Unicode characters before inference. |
| 4 | Integration | Twitter/X API rate limits are hit during live demo scraping | Critical | App gracefully degrades to use a pre-loaded static dataset of tweets, showing a "Demo Mode" indicator without crashing. |
| 5 | Integration | External HuggingFace serverless inference endpoint times out (if model is not hosted locally) | Critical | Show a clear "Analysis Server Unavailable" message in UI with a retry button, avoiding indefinite loading spinners. |
| 6 | Business Logic | A tweet contains a scientifically factual statement, but quotes a misinformation claim to debunk it | High | The model must classify the overall intent as Factual/True, proving its contextual understanding over simple keyword matching. |
| 7 | Error Cascades | Scraper fails to find the requested tweet handle -> returns empty -> model throws error on empty string | Medium | Frontend must validate input; backend must return a 400 Bad Request for empty payloads before hitting the model. |

### Summary
- Critical: 2
- High: 3
- Medium: 2
- Low: 0
- Total: 7 scenarios across 6 dimensions
