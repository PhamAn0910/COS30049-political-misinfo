# 👥 Team File Ownership & Interface Contract Matrix

**Project:** Automated Political & Breaking News Misinformation Detection Dashboard  
**Unit:** COS30048 / COS30049  
**Team Allocation Strategy:** Cross-Functional Slices (Member 1: Full-Stack/Integration, Member 2: ML/Data Engineering, Member 3: Analytics/Visualizations)

---

## 📋 Comprehensive File Ownership Matrix

| Module / Subsystem | Assigned Member / Role | Owned Files | Expected Inputs & Dependencies | Expected Outputs & Contracts |
|---|---|---|---|---|
| **Backend Environment & Config** | **Member 1** *(Full-Stack & Integration Lead)* | `backend/requirements.txt`<br>`backend/app/config.py`<br>`backend/app/__init__.py` | Python 3.10+, Environment variables | `settings` object (CORS, model paths, token limits), dependency manifest |
| **API Data Contracts & Validation** | **Member 1** *(Full-Stack & Integration Lead)* | `backend/app/models/schemas.py`<br>`backend/app/models/__init__.py` | JSON request bodies from client (`text`, `user_followers`, `user_verified`) | Pydantic validation models (`PredictRequest`, `PredictResponse`, `MetricsResponse`, `CascadeStatsResponse`, `CascadeNetworkResponse`) |
| **Data Ingestion & Preprocessing** | **Member 2** *(ML & Data Engineering Lead)* | `backend/app/services/preprocessor.py`<br>`backend/notebooks/01_data_exploration.ipynb`<br>`backend/notebooks/02_preprocessing.ipynb` | Raw text, PHEME datasets, FakeNewsNet PolitiFact | `preprocess_political_text()` normalization, train/val/test CSV splits |
| **Baseline ML Model** | **Member 1** *(Full-Stack & Integration Lead)* | `backend/notebooks/03_baseline_tfidf.ipynb` | Cleaned text datasets from `02_preprocessing.ipynb` | `backend/models/tfidf_logreg.joblib`, baseline F1 and accuracy benchmarks |
| **Core Prediction Endpoint** | **Member 1** *(Full-Stack & Integration Lead)* | `backend/app/routes/predict.py`<br>`backend/app/routes/__init__.py` | HTTP POST `/api/predict` with `PredictRequest`, HTTP DELETE `/api/predict/history` | HTTP 200 `PredictResponse` (veracity label, confidence, spread risk), HTTP 400/500 error handling |
| **Backend Application Entry & Lifespan** | **Member 1** *(Full-Stack & Integration Lead)* | `backend/app/main.py` | Uvicorn ASGI server, `app.services.inference.load_models()` | ASGI `app` instance with lifespan model loading and CORS middleware |
| **Primary Transformer Training & Quantization** | **Member 2** *(ML & Data Engineering Lead)* | `backend/notebooks/04_distilbert_finetune.ipynb`<br>`backend/notebooks/05_quantization.ipynb` | Preprocessed political datasets, Hugging Face `distilbert-base-uncased` | `backend/models/distilbert_quantized.pt` (<200MB INT8 PyTorch weights) |
| **Model Inference Engine** | **Member 2** *(ML & Data Engineering Lead)* | `backend/app/services/inference.py` | Preprocessed claim text, loaded DistilBERT weights + tokenizer | `predict_claim()` returning `{ label, confidence, scores }` |
| **Frontend Project Build & Shell** | **Member 1** *(Full-Stack & Integration Lead)* | `frontend/package.json`<br>`frontend/vite.config.js`<br>`frontend/tailwind.config.js`<br>`frontend/index.html`<br>`frontend/src/main.jsx`<br>`frontend/src/App.jsx`<br>`frontend/src/index.css` | Node.js 18+, Vite bundler | SPA application shell, Tailwind styling tokens, tab navigation state |
| **Frontend Navigation Layout** | **Member 1** *(Full-Stack & Integration Lead)* | `frontend/src/components/Layout/Header.jsx`<br>`frontend/src/components/Layout/Sidebar.jsx`<br>`frontend/src/components/Layout/Footer.jsx` | `activeTab`, `setActiveTab` state props | Responsive navigation bar, sidebar links, unit attribution footer |
| **Prediction UI Components** | **Member 2** *(ML & Data Engineering Lead)* | `frontend/src/components/Predict/InputForm.jsx`<br>`frontend/src/components/Predict/ResultCard.jsx`<br>`frontend/src/components/Predict/ConfidenceGauge.jsx`<br>`frontend/src/components/Predict/SpreadRiskBadge.jsx` | User input events, `PredictResponse` data | Input form with live char counter, red/green outcome card, animated SVG gauge, spread badge |
| **Common UI Utilities** | **Member 1** *(Full-Stack & Integration Lead)* | `frontend/src/components/common/ErrorBoundary.jsx`<br>`frontend/src/components/common/LoadingSpinner.jsx`<br>`frontend/src/components/common/StatusBadge.jsx` | React children, loading/status state props | Error boundary fallback, animated SVG spinner, online/demo status indicator |
| **Core View Pages** | **Member 1** *(Full-Stack & Integration Lead)* | `frontend/src/pages/Dashboard.jsx`<br>`frontend/src/pages/About.jsx` | `usePredict` hook, system documentation | Veracity verification view, methodology documentation view |
| **Graph & Regressor ML Models** | **Member 3** *(Analytics, Graph & Visualization Lead)* | `backend/notebooks/06_community_detection.ipynb`<br>`backend/notebooks/07_spread_prediction.ipynb` | PHEME interaction graphs, user social metadata | `backend/models/community_clusters.joblib`, `backend/models/spread_regressor.joblib` |
| **Cascade Prediction Service** | **Member 3** *(Analytics, Graph & Visualization Lead)* | `backend/app/services/cascade.py` | `user_followers`, `user_verified`, `spread_regressor` | `predict_spread()` returning `{ risk_level, predicted_reach }` |
| **Analytics & Cascade Endpoints** | **Member 3** *(Analytics, Graph & Visualization Lead)* | `backend/app/routes/metrics.py`<br>`backend/app/routes/cascades.py` | HTTP GET `/api/metrics`, `/api/cascades/stats`, `/api/cascades/network` | `MetricsResponse`, `CascadeStatsResponse`, `CascadeNetworkResponse` JSON payloads |
| **API Client & Prediction Hooks** | **Member 1** *(Full-Stack & Integration Lead)* | `frontend/src/services/api.js`<br>`frontend/src/hooks/usePredict.js` | Axios HTTP client, FastAPI `/api` endpoints | Centralized API client with interceptors, `usePredict` hook returning `{ predict, result, loading, error }` |
| **Analytics & Cascade Hooks** | **Member 3** *(Analytics, Graph & Visualization Lead)* | `frontend/src/hooks/useMetrics.js`<br>`frontend/src/hooks/useCascades.js` | `getMetricsApi`, `getCascadeStatsApi`, `getCascadeNetworkApi` | `useMetrics` returning `{ metrics, loading, error }`, `useCascades` returning `{ stats, network, loading, error }` |
| **Interactive Visualization Components** | **Member 3** *(Analytics, Graph & Visualization Lead)* | `frontend/src/components/Charts/CategoryBarChart.jsx`<br>`frontend/src/components/Charts/MetricsRadarChart.jsx`<br>`frontend/src/components/Charts/ConfusionMatrix.jsx`<br>`frontend/src/components/Charts/CascadeBubbleChart.jsx`<br>`frontend/src/components/Charts/TimelineAreaChart.jsx`<br>`frontend/src/components/Charts/NetworkGraph.jsx` | Metrics and cascade data arrays from hooks | 6 interactive visualizations: Bar Chart, Radar Chart, Confusion Matrix Heatmap, Scatter/Bubble Chart, Area Chart with Brush Zoom, D3 Force-Directed Network Graph |
| **Analytics & Network Pages** | **Member 3** *(Analytics, Graph & Visualization Lead)* | `frontend/src/pages/Analytics.jsx`<br>`frontend/src/pages/Network.jsx` | `useMetrics` hook, `useCascades` hook, filter dropdown events | Model performance dashboard, community echo chamber graph exploration view |

---

## 🔄 Core Interface Boundaries & Data Contracts

### 1. Verification Request Contract (`POST /api/predict`)
```typescript
interface PredictRequest {
  text: string;             // Claim text (1 - 5000 chars)
  user_followers?: number;  // Default: 1000
  user_verified?: boolean;  // Default: false
}

interface PredictResponse {
  veracity_label: 'factual' | 'misinformation';
  veracity_score: number;   // 0.0 - 1.0 (DistilBERT probability)
  spread_risk: 'High' | 'Moderate' | 'Low';
  expected_reach: number;   // Ridge Regressor prediction
  confidence_breakdown: Record<string, number>;
  preprocessed_text?: string;
}
```

### 2. Model Metrics Contract (`GET /api/metrics`)
```typescript
interface MetricsResponse {
  accuracy: number;
  precision: number;
  recall: number;
  macro_f1: number;
  confusion_matrix: {
    true_positive: number;
    false_positive: number;
    true_negative: number;
    false_negative: number;
  };
  baseline_comparison: {
    distilbert_macro_f1: number;
    tfidf_logreg_macro_f1: number;
  };
}
```

### 3. Cascade & Network Graph Contract (`GET /api/cascades/network`)
```typescript
interface NetworkNode {
  id: string;
  label: string;
  community: number;
  veracity: 'factual' | 'misinformation';
}

interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
}

interface CascadeNetworkResponse {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}
```
