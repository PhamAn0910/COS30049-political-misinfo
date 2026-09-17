# Research & Architecture Report: Health Misinformation Fact-Checker (Hard Stack)

## Executive Summary
This report defines the architecture and risk mitigation strategies for the "Health Misinformation Automated Fact-Checking Dashboard." By utilizing the PUBHEALTH dataset and a Transformer model, the project aims for a High Distinction (HD) by demonstrating deep technical complexity. To prevent this "Hard Stack" from becoming brittle or over-engineered, we have researched robust solutions for model hosting, API rate limits, and dataset imbalance, forming a resilient, demo-ready architecture.

## 1. Risk Mitigation Solutions (ak-research)

### Risk A: Cloud RAM Constraints & Model Size
**The Problem**: Standard Transformer models (like RoBERTa) consume 400MB-1GB of RAM, easily crashing free-tier cloud hosts (Render, Heroku) or causing Out-Of-Memory (OOM) errors during inference.
**The HD Solution (Robust & Not Over-engineered)**:
- **Model Choice**: Use **DistilBERT** or **DistilRoBERTa**. They retain 97% of the language understanding capabilities of their larger counterparts while being 40% smaller and 60% faster.
- **Quantization**: Apply PyTorch dynamic quantization (`torch.quantization.quantize_dynamic`) before exporting the model. This converts weights from 32-bit floats to 8-bit integers, drastically reducing memory footprint (to < 100MB) with near-zero accuracy loss.
- **Deployment Strategy**: Host the quantized model directly within the FastAPI application state. This avoids the latency and unreliability of external free-tier inference APIs, proving to the graders that you successfully optimized and deployed an edge-ready ML pipeline.

### Risk B: Social Media API Rate Limits & Scraping Brittle-ness
**The Problem**: Live scraping via X (Twitter) is highly unreliable due to anti-bot measures, and the official API's free tier is heavily restricted. A live demo failure ruins the presentation.
**The HD Solution (Resilient Design Pattern)**:
- **The "Graceful Degradation" Proxy**: Implement a two-tier data ingestion system in FastAPI. 
  1. The API attempts to fetch a live tweet using a lightweight library or the official API (if a token is available).
  2. If a rate limit (HTTP 429) or timeout occurs, the backend catches the exception and immediately queries a local SQLite fallback database populated with real, pre-analyzed health misinformation tweets.
- **The Flex**: On the React dashboard, display a small indicator: "🟢 Live Connection" or "🟡 Simulation Mode (Rate Limit Reached)". This shows the graders you anticipated system failures and engineered a fault-tolerant architecture.

### Risk C: Class Imbalance in PUBHEALTH
**The Problem**: Health datasets often contain significantly more "True" claims than "False" ones. A naive model might just guess "True" every time and achieve 80% accuracy without actually learning.
**The HD Solution (ML Rigor)**:
- **Loss Function**: Implement **Weighted Cross-Entropy Loss** during PyTorch training to heavily penalize the model for missing the minority class (False/Misinformation).
- **Evaluation**: Ditch standard accuracy. Train the model focusing on the **Macro F1-Score**.
- **Dashboard Feature**: Build an "Evaluation Metrics" tab in the React dashboard that displays the Confusion Matrix and Precision/Recall curve. Explaining this tab to the graders proves you understand the statistical nuances of Machine Learning beyond just calling an API.

---

## 2. Bootstrapped Architecture (ak-bootstrap)

Based on the research, here is the streamlined, HD-level architecture for your project.

### Tech Stack
*   **Frontend**: React (Vite) + Tailwind CSS + Recharts (for confidence graphs)
*   **Backend**: Python + FastAPI
*   **Machine Learning**: PyTorch + HuggingFace `transformers` + `scikit-learn` (for metrics)
*   **Data**: PUBHEALTH dataset

### System Flow
1. **User Interface**: The user inputs a specific controversial health tweet (e.g., "Drinking raw milk cures asthma") into the React Dashboard.
2. **API Layer**: React sends the text via POST request to the FastAPI `/predict` endpoint.
3. **Preprocessing**: FastAPI strips emojis, normalizes Unicode, and chunks the text if it exceeds token limits (handling the edge cases from our `ak-scenario` report).
4. **Inference**: The text is passed to the **local, 8-bit quantized DistilBERT model** loaded in FastAPI's memory.
5. **Output**: The model outputs logits, which are passed through a Softmax function to generate a percentage-based Confidence Score (e.g., "False: 96%").
6. **Visualization**: FastAPI returns the prediction. React instantly renders a red/green status card, updating a Recharts bar chart showing the model's confidence distribution across all classes (True, False, Unproven, Mixed).

### Why this is an HD Project:
- **It solves a complex problem** using state-of-the-art NLP (Transformers), not just basic statistical ML.
- **It handles the "Control Test"**: It successfully parses context (Step 2 of your demo) because of the Transformer's attention mechanism.
- **It is highly engineered but constrained**: You aren't building a massive microservice cloud architecture; you are building a highly optimized, resilient, memory-efficient monolith. Quantizing a model and building a graceful fallback proxy are textbook examples of excellent software engineering.
