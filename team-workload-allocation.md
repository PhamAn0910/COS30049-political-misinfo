# 👥 3-Member Team Workload Allocation & Dependency Plan
**Project:** Automated Political & Breaking News Misinformation Detection Dashboard  
**Unit:** COS30048 / COS30049  
**Team Size:** 3 Members  

---

## 🎯 Guiding Strategy: Cross-Functional Slices
Rather than siloing members into single technical layers (e.g., one person doing only frontend), **each member contributes to Documentation, Machine Learning, and Application Development** across all 3 assignments.

- **Member 1:** Integration & Backend Lead *(Scope, Baseline ML, Core API, Backend Tests)*
- **Member 2:** Model & Frontend Core Lead *(Architecture, DistilBERT Transformer, Core UI, Demo Lead)*
- **Member 3:** Analytics, Graph & Visualization Lead *(UI Mockups, Advanced ML, Charts & Advanced Features)*

---

## 📋 Member Breakdown Across All 3 Assignments

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               MEMBER 1: Integration Lead                               │
├───────────────────┬──────────────────────────────────┬─────────────────────────────────┤
│   Assignment 1    │           Assignment 2           │          Assignment 3           │
│ Project Charter   │ Dataset Ingestion & Cleaning     │ FastAPI Skeleton & Lifespan     │
│ Scope & Risks     │ Political Text Preprocessor      │ POST /predict Core Endpoint     │
│ Project Schedule  │ Baseline ML (TF-IDF + LogReg)    │ Pytest Suite & Error Validation │
└───────────────────┴──────────────────────────────────┴─────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               MEMBER 2: Core Tech Lead                                 │
├───────────────────┬──────────────────────────────────┬─────────────────────────────────┤
│   Assignment 1    │           Assignment 2           │          Assignment 3           │
│ Architecture Doc  │ Primary ML (DistilBERT Training) │ React + Vite + Tailwind Scaffold│
│ WBS Breakdown     │ INT8 Dynamic Quantization        │ Prediction UI & Animated Gauge  │
│ Roles & Standards │ Model Export & Size Benchmark    │ Video Demo Lead & Coordination  │
└───────────────────┴──────────────────────────────────┴─────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          MEMBER 3: Analytics & Insights Lead                           │
├───────────────────┬──────────────────────────────────┬─────────────────────────────────┤
│   Assignment 1    │           Assignment 2           │          Assignment 3           │
│ UI/UX Mockups     │ Graph Community Detection        │ 5x Interactive Recharts & D3 Graph
│ Acceptance Specs  │ Cascade Spread Regressor (Ridge) │ Advanced Features (CSV, Batch)  │
│ Control Test Plan │ Feature Importance & Clustering  │ GET /metrics & /cascades Routes │
└───────────────────┴──────────────────────────────────┴─────────────────────────────────┘
```

---

## 🔄 Visual Dependency & Parallel Execution Flow

This chart shows **what can be done simultaneously in parallel (⚡)** and **what must wait for prerequisites (🔒)**.

```mermaid
flowchart TD
    %% Styling Classes
    classDef m1 fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
    classDef m2 fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
    classDef m3 fill:#f3e8ff,stroke:#9333ea,stroke-width:2px,color:#6b21a8;
    classDef sync fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#15803d;

    subgraph A1 ["📝 ASSIGNMENT 1: Planning & Design"]
        direction TB
        subgraph A1_Parallel_1 ["Step 1: Parallel Drafting ⚡"]
            M1_A1_1["M1: Project Charter & Scope Risk"]:::m1
            M2_A1_1["M2: High-Level Architecture"]:::m2
            M3_A1_1["M3: UI Wireframes & Mockups"]:::m3
        end

        subgraph A1_Parallel_2 ["Step 2: Dependent Planning 🔒"]
            M2_A1_2["M2: Work Breakdown Structure (WBS)\n(needs Scope & Architecture)"]:::m2
            M3_A1_2["M3: Acceptance Criteria & Control Test Specs\n(needs UI Mockups)"]:::m3
            M1_A1_2["M1: Schedule, Gantt & Milestones\n(needs WBS)"]:::m1
        end

        A1_SYNC["🎉 MILESTONE: Assemble & Submit Assignment 1 Package"]:::sync

        M1_A1_1 --> M2_A1_2
        M2_A1_1 --> M2_A1_2
        M3_A1_1 --> M3_A1_2
        M2_A1_2 --> M1_A1_2
        M1_A1_2 --> A1_SYNC
        M3_A1_2 --> A1_SYNC
    end

    subgraph A2 ["🤖 ASSIGNMENT 2: Data Engineering & Machine Learning"]
        direction TB
        A1_SYNC --> M1_A2_1

        subgraph A2_Step1 ["Step 1: Foundation (Blocking Prerequisite) 🔒"]
            M1_A2_1["M1: Dataset Sourcing (FakeNewsNet + PHEME)\n& Preprocessing Engine (Regex, Hashtags, URLs)"]:::m1
        end

        subgraph A2_Step2 ["Step 2: 3-Way Parallel ML Training ⚡"]
            M1_A2_2["M1: Train Baseline ML\n(TF-IDF + Logistic Regression)"]:::m1
            M2_A2_1["M2: Fine-Tune DistilBERT\n(Binary Veracity Classification)"]:::m2
            M3_A2_1["M3: Graph Clustering (Louvain/K-Means)\n& Spread Prediction (Ridge Regressor)"]:::m3
        end

        subgraph A2_Step3 ["Step 3: Optimization & Export 🔒"]
            M2_A2_2["M2: Dynamic Quantization (INT8 <200MB)"]:::m2
            A2_EXPORT["Export Models (.pt, .joblib) & Benchmark Results"]:::sync
        end

        M1_A2_1 --> M1_A2_2
        M1_A2_1 --> M2_A2_1
        M1_A2_1 --> M3_A2_1
        M2_A2_1 --> M2_A2_2
        M1_A2_2 --> A2_EXPORT
        M2_A2_2 --> A2_EXPORT
        M3_A2_1 --> A2_EXPORT
    end

    subgraph A3 ["🚀 ASSIGNMENT 3: Full-Stack App, Dashboard & Demo"]
        direction TB
        A2_EXPORT --> A3_Init

        subgraph A3_Init ["Step 1: Parallel Scaffold & Contracts ⚡"]
            M1_A3_1["M1: FastAPI App Scaffold\n& Lifespan Model Loader"]:::m1
            M2_A3_1["M2: React + Vite + Tailwind Scaffold\n& App Shell / Layout"]:::m2
            M3_A3_1["M3: Extract Graph & Metrics JSON\nfrom A2 Experiments"]:::m3
        end

        subgraph A3_Core ["Step 2: Core Development ⚡"]
            M1_A3_2["M1: POST /predict Endpoint\n& Preprocessing Integration"]:::m1
            M2_A3_2["M2: Claim Input Form\n& Animated Veracity Gauge"]:::m2
            M3_A3_2["M3: GET /metrics & /cascades APIs\n+ Interactive Recharts & D3 Graph"]:::m3
        end

        subgraph A3_Advanced ["Step 3: Advanced Features & Polish ⚡"]
            M1_A3_3["M1: Pytest Test Suite\n& Error Handlers (400/500)"]:::m1
            M2_A3_3["M2: Model Comparison Mode\n& Responsive Mobile/Tablet Check"]:::m2
            M3_A3_3["M3: CSV Export & Batch Upload\n+ Echo Chamber Filter"]:::m3
        end

        subgraph A3_Final ["Step 4: Final Verification & Video Demo 🔒"]
            A3_TEST["Run Semantic Control Test Verification"]:::sync
            M2_VIDEO["M2 Lead: Record & Edit 7-min HD Video Demo\n(All 3 members present their parts)"]:::m2
            A3_DONE["🎉 Final Submission & Project Closure"]:::sync
        end

        M1_A3_1 --> M1_A3_2
        M2_A3_1 --> M2_A3_2
        M3_A3_1 --> M3_A3_2

        M1_A3_2 --> M1_A3_3
        M2_A3_2 --> M2_A3_3
        M3_A3_2 --> M3_A3_3

        M1_A3_3 --> A3_TEST
        M2_A3_3 --> A3_TEST
        M3_A3_3 --> A3_TEST

        A3_TEST --> M2_VIDEO
        M2_VIDEO --> A3_DONE
    end
```

---

## 📅 Chronological Execution Schedule

| Timeline Phase | Member 1 (Integration) | Member 2 (Core Tech) | Member 3 (Analytics) | Execution Mode |
|---|---|---|---|---|
| **A1: Days 1–3** | Draft Project Charter & Scope Risk Register | Draft System Architecture & Technology Stack | Design UI Wireframes & Dashboard Layouts | **Parallel ⚡** |
| **A1: Days 4–6** | Draft Timeline, Gantt Chart & Milestones | Build Work Breakdown Structure (WBS) | Write Acceptance Criteria & Control Test Specs | **Coordinated 🔄** |
| **A1: Day 7** | *All Members Review, Format, and Submit Assignment 1 Package* | | | **Milestone 🎯** |
| **A2: Days 8–10** | Source FakeNewsNet + PHEME & Write Preprocessor | *Prepare training environment (PyTorch MPS/CUDA)* | *Analyze social graph schema & feature set* | **Prerequisite 🔒** *(M1 leads)* |
| **A2: Days 11–15** | Train TF-IDF + Logistic Regression Baseline | Fine-Tune DistilBERT Transformer | Perform Graph Community Detection & Ridge Regression | **Parallel ⚡** *(All 3 train models)* |
| **A2: Days 16–18** | Benchmark Baseline metrics (F1, confusion matrix) | Perform INT8 Dynamic Quantization (<200MB) | Extract feature importance & community cluster data | **Parallel ⚡** |
| **A2: Day 19** | *All Members Consolidate Notebooks, Model Artifacts & ML Report* | | | **Milestone 🎯** |
| **A3: Days 20–22** | Scaffold FastAPI app & Lifespan model loader | Scaffold React+Vite+Tailwind & Main Layout | Format graph/metrics JSON data for API responses | **Parallel ⚡** |
| **A3: Days 23–26** | Build & test `POST /predict` endpoint | Build Input Form, Veracity Card & Gauge | Build `GET /metrics` routes & Interactive Charts | **Parallel ⚡** |
| **A3: Days 27–29** | Write Pytest suite & input validation | Implement Model Comparison & Responsive UI | Implement CSV Export & Batch Claim Upload | **Parallel ⚡** |
| **A3: Day 30** | Run Semantic Control Tests & API benchmarks | Coordinate & Record 7-min Video Demo | Verify chart tooltips & visual clarity | **Final Sprint 🚀** |

---

## 💡 Why This Distribution Maximizes Grades & Minimizes Risk

1. **No Single Point of Failure:** Because all three members understand the machine learning pipeline and the full-stack architecture, if one person gets sick or busy, another can easily support them.
2. **Balanced Grading Rubric Alignment:**
   - **A1:** Balanced between project planning, architectural design, and UI specs.
   - **A2:** Satisfies all requirements for primary model (DistilBERT), baseline model (TF-IDF), clustering (Louvain), and regression (Ridge).
   - **A3:** Satisfies frontend, backend, chart diversity (≥5 charts), error handling, and video presentation criteria.
3. **Clear Interface Contracts:** Once M1 finishes the preprocessing script in A2, all 3 can train models independently. Once M1 defines the API schemas in A3, frontend and backend development happen concurrently without blocking.
