# Project Management Plan - Phase 1

**Unit Code:** COS30048/COS30049
**Project Title:** Health Misinformation Fact-Checking Dashboard
**Student Name:** [Your Name]
**Date:** 17 October 2026

---

## Table of Contents
1. [Project Background & Introduction](#1-project-background--introduction)
2. [Team Introduction](#2-team-introduction)
3. [Project Requirements](#3-project-requirements)
   - [Functional Requirements](#31-functional-requirements)
   - [Non-Functional Requirements](#32-non-functional-requirements)
4. [References](#4-references)

---

## 1. Project Background & Introduction

The digital age has brought an unprecedented flow of information, but it has also facilitated the rapid spread of misinformation, particularly on social media platforms. Health misinformation is a critical societal and cybersecurity challenge, as false medical claims can directly harm public health, undermine trust in medical institutions, and create widespread panic. Addressing this issue requires automated, intelligent systems capable of distinguishing factual scientific consensus from misleading claims—traditional keyword-based systems fall short as they often miss semantic nuances.

This project aims to develop a Health Misinformation Detection Dashboard, an interactive machine learning web application that accurately classifies health-related claims into categories such as true, false, mixture, and unproven. By leveraging the advanced natural language processing capabilities of the DistilBERT transformer model, the system will analyze the deeper semantic context of claims. The model's attention mechanism ensures that nuanced phrasing is correctly understood.

The project utilizes two robust datasets: the Constraint-English Fake dataset for baseline exploration (using TF-IDF with Logistic Regression), and the comprehensive PUBHEALTH dataset, which contains over 19,000 fact-checked health claims. The technical architecture involves a React.js frontend built with Vite for an intuitive, responsive user interface, and a FastAPI Python backend to handle data preprocessing and model inference efficiently. This comprehensive solution provides users with real-time classification, detailed confidence scores, and interactive data visualizations to explain model metrics and dataset statistics.

## 2. Team Introduction

**Solo Developer (1 person team):** 
I am responsible for the entire project lifecycle, acting across three primary domains:

- **Project Manager:** Responsible for project planning, timeline scheduling (WBS and Gantt charts), scope management, and risk assessment.
- **Machine Learning Engineer:** Handling data preprocessing, training baseline models, fine-tuning the DistilBERT model, and implementing dynamic quantization for optimization.
- **Full-Stack Developer:** Building the FastAPI RESTful backend and developing the responsive React dashboard with complex state management and interactive visualizations.

## 3. Project Requirements

To ensure the successful delivery of the Health Misinformation Fact-Checking Dashboard, a comprehensive set of requirements has been defined. These are split into functional requirements, which detail what the system must do, and non-functional requirements, which dictate how the system should perform.

### 3.1 Functional Requirements

1. **Text Input and Validation:** The system must allow users to input health claims via a text form on the main dashboard. The form must validate inputs, ensuring the text is not empty and does not exceed a 5000-character limit, providing clear error messages if these conditions are violated.
2. **Real-time Classification:** The system must classify input claims as True, False, Mixture, or Unproven. It must return not only the primary label but also a detailed breakdown of confidence scores for all four classes.
3. **Interactive Data Visualizations:** The system must provide at least three distinct interactive chart types (e.g., Bar Chart, Radar Chart, Area Chart, Confusion Matrix, Donut Chart) to display dataset statistics (like class distributions) and model evaluation metrics (like Precision, Recall, and F1-score).
4. **Backend RESTful API:** The system must include a robust backend API built with FastAPI, implementing at least two HTTP methods (POST and GET). Key endpoints must include `/predict` for model inference and `/metrics` for retrieving evaluation data.
5. **Advanced Text Preprocessing:** The backend must include a preprocessing pipeline capable of cleaning the input text before inference. This includes stripping emojis, normalizing Unicode homoglyphs (e.g., Cyrillic characters used to evade filters), and normalizing leetspeak patterns (e.g., "v@cc1ne").
6. **Advanced Functionality - Batch Processing & Export:** The system must support advanced features for power users, including the ability to perform batch analysis on multiple claims and export prediction histories as CSV files.

### 3.2 Non-Functional Requirements

1. **Performance and Memory Constraints:** The machine learning model must be optimized to run efficiently within a free-tier cloud environment or local hardware. Specifically, the DistilBERT model must utilize dynamic quantization (converting Linear layers to INT8) to reduce its memory footprint to under 200MB, allowing it to run within a 512MB–1GB RAM constraint.
2. **Responsiveness and Cross-Platform Accessibility:** The frontend React dashboard must be fully responsive. Using Tailwind CSS breakpoints, the interface must adapt seamlessly across desktop (1024px+), tablet (768px), and mobile (375px) devices, ensuring a consistent user experience.
3. **Model Accuracy:** The primary classification model (fine-tuned DistilBERT) must achieve a Macro F1 score of at least 0.75 on the PUBHEALTH test set, demonstrating a high degree of accuracy and balanced performance across all four classification categories.
4. **Usability and Error Handling:** The interface must adhere to strict usability heuristics. It must provide clear, color-coded results (e.g., red for misinformation, green for factual consensus) and handle system errors gracefully. Network failures or API timeouts must be communicated to the user via non-intrusive toast notifications with retry options.

## 4. References

FastAPI, 2026. *FastAPI Documentation*. [online] Available at: <https://fastapi.tiangolo.com/> [Accessed 17 Sep. 2026].

Hugging Face, 2026. *Transformers Documentation*. [online] Available at: <https://huggingface.co/docs/transformers/index> [Accessed 17 Sep. 2026].

Kotonya, N. and Toni, F., 2020. Explainable Automated Fact-Checking for Public Health Claims. *EMNLP 2020*.

Patwa, P. et al., 2021. Fighting an Infodemic: COVID-19 Fake News Dataset. *Constrained NLP*.

Pedregosa, F. et al., 2011. Scikit-learn: Machine Learning in Python. *Journal of Machine Learning Research*, 12, pp.2825-2830.

Project Management Institute, 2021. *A Guide to the Project Management Body of Knowledge (PMBOK Guide)*. 7th ed. Newtown Square, PA: Project Management Institute.

React, 2026. *React Documentation*. [online] Available at: <https://react.dev/> [Accessed 17 Sep. 2026].

Sanh, V., Debut, L., Chaumond, J. and Wolf, T., 2019. DistilBERT, a distilled version of BERT: smaller, faster, cheaper and lighter. *arXiv preprint arXiv:1910.01108*.
