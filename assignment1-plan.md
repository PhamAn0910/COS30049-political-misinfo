# 📋 Assignment 1 Execution Plan: Comprehensive Project Management Plan

## Goal Description

**Assignment**: COS30048/COS30049 Assignment 1 — *Comprehensive Project Management Plan for the Innovation Project*
**Weight**: 15% of total unit mark | **Due**: 12 Oct by 3:59pm
**Topic**: Health Misinformation Detection on Social Media (Topic 1)
**Team**: Solo developer (1 person)
**Format**: Submit as `.pdf` or `.doc` via Canvas (Turnitin-checked)

> [!IMPORTANT]
> **AI Policy**: The assignment spec states: *"you must NOT use generative artificial intelligence (AI) to generate any materials or content."* Use the skills below as **structural aids and formatting tools only**. All written content (analysis, justifications, risk descriptions) must be your own original writing. The skills help you organize, diagram, and format — not generate essay content.

### Deliverables Required

| # | Deliverable | Rubric Pts |
|---|------------|------------|
| 1 | Professional writing & organization | 1 |
| 2 | Harvard-style references | 1 |
| 3 | Understanding of project requirements | 1 |
| 4 | Scope Management (Project Scope, WBS, WBS Dictionary) | 2 |
| 5 | Time Management (Gantt Chart + schedule) | 2 |
| 6 | Risk Management (Risk Register & Plan) | 2 |
| 7 | Monitor & Control (Change Control) | 1 |
| 8 | Closure Plan | 1 |
| 9 | Project Design (UI Prototype + usability principles) | 3 |
| 10 | Communication Plan (Meeting Minutes) | 1 |
| | **Total** | **15** |

### Constraint Reminder
The project vision and technical decisions from [health-misinfo-plan.md](file:///Users/phaman/Documents/COS30048%20-%20Inno/inno/health-misinfo-plan.md) define what you're managing. Assignment 1 is the **management wrapper** around that technical plan.

---

## Phased Execution

### Phase 1: Project Introduction & Requirements Analysis
**Effort**: ~1.5 hours | **Rubric**: Criteria 1, 2, 3 (3 pts)

#### What to produce
- Cover page (unit code, project title, student name, date)
- Table of contents
- Project background & introduction (~300 words)
- Team introduction (solo — describe your role covering PM, ML engineer, frontend dev)
- Project requirement list & description (functional + non-functional)
- Reference list (Harvard style)

#### Skills to use

| Skill | Purpose |
|-------|---------|
| **`ak-interview-docs`** | Interview yourself to extract and structure the project background, requirements, and team description into a well-organized markdown document. Run it to scaffold the document structure. |
| **`ak-document-skills`** | Format the final output as `.docx` with proper heading styles, table of contents, and page numbers. |

#### Steps
1. **Read** [assignment1.md](file:///Users/phaman/Documents/COS30048%20-%20Inno/inno/assignment1.md) and [misinformation_research.md](file:///Users/phaman/Documents/COS30048%20-%20Inno/inno/misinformation_research.md) for context
2. **Run `ak-interview-docs`** — answer prompts about:
   - Why health misinformation? (societal impact, cybersecurity angle)
   - What datasets? (Constraint-English Fake + PUBHEALTH)
   - What tech stack? (React + FastAPI + DistilBERT)
   - What are the functional requirements? (predict endpoint, dashboard, charts, etc.)
   - What are non-functional requirements? (performance, RAM limits, responsiveness)
3. **Write the content yourself** — the skill structures it, you fill in original prose
4. **Add 5–8 Harvard-style references** (PMBOK, React docs, FastAPI docs, PUBHEALTH paper, DistilBERT paper, OWASP, etc.)

#### Acceptance
- [ ] Cover page with all required info
- [ ] TOC with page numbers
- [ ] ≥800 words of original content (excluding references)
- [ ] All references cited in-text AND in reference list (Harvard style)

---

### Phase 2: Scope Management (WBS + WBS Dictionary)
**Effort**: ~2 hours | **Rubric**: Criterion 4 (2 pts)

#### What to produce
- Project scope statement (what's in/out)
- Work Breakdown Structure (WBS) — visual hierarchy diagram
- WBS Dictionary — table describing each work package

#### Skills to use

| Skill | Purpose |
|-------|---------|
| **`ak-mermaidjs-v11`** | Generate the WBS as a Mermaid.js `flowchart TD` diagram. The tree structure maps naturally: Project → Phases → Work Packages → Tasks. Export as image for the document. |
| **`ak-document-skills`** | Create the WBS Dictionary as a formatted table in the `.docx` file. |

#### Steps
1. **Define project scope** — write a scope statement:
   - **In scope**: ML pipeline, data preprocessing, model training, FastAPI backend, React dashboard, interactive charts, responsive design
   - **Out of scope**: User authentication, real-time Twitter scraping, mobile app, microservices
2. **Build WBS hierarchy** using `ak-mermaidjs-v11`:

```
Project: Health Misinfo Dashboard
├── 1.0 Project Management
│   ├── 1.1 Project Planning
│   ├── 1.2 Risk Management
│   └── 1.3 Status Reporting
├── 2.0 Data Engineering
│   ├── 2.1 Dataset Acquisition (PUBHEALTH + Basic)
│   ├── 2.2 Data Cleaning & Preprocessing
│   └── 2.3 Exploratory Data Analysis
├── 3.0 Machine Learning
│   ├── 3.1 Baseline Model (TF-IDF + LogReg)
│   ├── 3.2 Transformer Model (DistilBERT fine-tuning)
│   ├── 3.3 Clustering (K-Means)
│   └── 3.4 Model Quantization & Export
├── 4.0 Backend Development
│   ├── 4.1 FastAPI Skeleton & CORS
│   ├── 4.2 Prediction Endpoint (POST /predict)
│   ├── 4.3 Metrics & Dataset Endpoints (GET)
│   └── 4.4 Error Handling & Validation
├── 5.0 Frontend Development
│   ├── 5.1 React + Vite Setup
│   ├── 5.2 Prediction UI (Input, Results, Gauge)
│   ├── 5.3 Charts (Bar, Radar, Area, Matrix, Donut)
│   ├── 5.4 Responsive Design & Dark Mode
│   └── 5.5 Advanced Features (CSV Export, Batch, Compare)
└── 6.0 Integration & Delivery
    ├── 6.1 End-to-End Testing
    ├── 6.2 Video Demo Recording
    └── 6.3 Final Report & Submission
```

3. **Create WBS Dictionary table** — for each work package, document:

| WBS ID | Work Package | Description | Deliverable | Estimated Effort | Dependencies |
|--------|-------------|-------------|-------------|-----------------|--------------|
| 2.1 | Dataset Acquisition | Download PUBHEALTH TSV + extract Basic .xlsx | Raw data files | 1h | None |
| 3.2 | DistilBERT Fine-tuning | Train on PUBHEALTH, 3 epochs, weighted loss | `.pt` model file | 4h | 2.2 |
| ... | ... | ... | ... | ... | ... |

#### Acceptance
- [ ] Scope statement clearly defines in/out boundaries
- [ ] WBS diagram is hierarchical with ≥3 levels
- [ ] WBS Dictionary covers all work packages with descriptions

---

### Phase 3: Time Management (Gantt Chart)
**Effort**: ~1.5 hours | **Rubric**: Criterion 5 (2 pts)

#### What to produce
- Development schedule / timeline
- Gantt chart showing tasks, durations, dependencies, and critical path
- Milestones for each assignment deadline

#### Skills to use

| Skill | Purpose |
|-------|---------|
| **`ak-mermaidjs-v11`** | Generate the Gantt chart using Mermaid.js `gantt` syntax. Mermaid natively supports task durations, dependencies, milestones, and sections. Export as image. |
| **`ak-document-skills`** | Embed the chart image and add a supporting schedule table in `.docx`. |

#### Steps
1. **Map the timeline** (from now to end of semester):
   - Assignment 1 due: Week 4 (12 Oct)
   - Assignment 2 due: ~Week 8 (estimate)
   - Assignment 3 due: ~Week 12 (estimate)

2. **Create Gantt chart** with `ak-mermaidjs-v11`:

```mermaid
gantt
    title Health Misinfo Dashboard - Project Schedule
    dateFormat  YYYY-MM-DD
    
    section Assignment 1
    Project Management Plan     :a1_1, 2026-09-15, 14d
    WBS & Scope Definition      :a1_2, 2026-09-15, 7d
    Gantt Chart & Schedule      :a1_3, after a1_2, 5d
    Risk Register               :a1_4, 2026-09-20, 7d
    UI Prototype Design         :a1_5, 2026-09-22, 10d
    A1 Submission               :milestone, 2026-10-12, 0d

    section Assignment 2
    Dataset Acquisition         :a2_1, 2026-10-13, 3d
    Data Preprocessing          :a2_2, after a2_1, 4d
    EDA & Visualization         :a2_3, after a2_2, 3d
    Baseline Model (TF-IDF)     :a2_4, after a2_3, 3d
    DistilBERT Fine-tuning      :a2_5, after a2_3, 5d
    K-Means Clustering          :a2_6, after a2_3, 2d
    Model Quantization          :a2_7, after a2_5, 2d
    A2 Report & Submission      :a2_8, after a2_7, 3d
    A2 Submission               :milestone, 2026-11-09, 0d

    section Assignment 3
    FastAPI Backend Setup       :a3_1, 2026-11-10, 3d
    API Endpoints               :a3_2, after a3_1, 5d
    React Frontend Setup        :a3_3, 2026-11-10, 3d
    Dashboard UI Components     :a3_4, after a3_3, 7d
    Charts & Visualization      :a3_5, after a3_4, 5d
    Integration Testing         :a3_6, after a3_2, 5d
    Responsive & Polish         :a3_7, after a3_5, 4d
    Video Demo                  :a3_8, after a3_7, 2d
    A3 Submission               :milestone, 2026-12-07, 0d
```

3. **Identify the critical path** — the longest chain of dependent tasks (Data → DistilBERT → Quantization → Backend → Frontend → Integration → Demo)
4. **Add a schedule table** summarizing key milestones

#### Acceptance
- [ ] Gantt chart shows all 3 assignment phases
- [ ] Task dependencies are visible (arrows/`after` keywords)
- [ ] Critical path is identified and discussed
- [ ] Milestones marked for each submission deadline

---

### Phase 4: Risk Management
**Effort**: ~1.5 hours | **Rubric**: Criterion 6 (2 pts)

#### What to produce
- Risk Register (table of identified risks)
- Risk Management Plan (mitigation strategies)

#### Skills to use

| Skill | Purpose |
|-------|---------|
| **`ak-document-skills`** | Format the Risk Register and Plan as professional tables in `.docx`. |

> [!TIP]
> You already have excellent risk analysis in [health-misinfo-plan.md](file:///Users/phaman/Documents/COS30048%20-%20Inno/inno/health-misinfo-plan.md) (Risk Assessment section) and [research_architecture_report.md](file:///Users/phaman/Documents/COS30048%20-%20Inno/inno/research_architecture_report.md) (Risk Mitigation Solutions). Rewrite these in your own words for the Risk Register.

#### Steps
1. **Build the Risk Register** — use your existing research but rewrite it in a formal register format:

| Risk ID | Risk Description | Likelihood | Impact | Severity | Mitigation Strategy | Owner | Status |
|---------|-----------------|------------|--------|----------|---------------------|-------|--------|
| R1 | PUBHEALTH dataset unavailable or corrupted | Low | High | High | Mirror dataset locally; use COVID Fake News dataset as fallback | PM | Open |
| R2 | DistilBERT model achieves F1 < 0.70 | Medium | High | High | Increase epochs, try DistilRoBERTa, add data augmentation | ML Lead | Open |
| R3 | Quantized model accuracy drops > 3% | Low | Medium | Medium | Use FP16 instead of INT8 quantization | ML Lead | Open |
| R4 | RAM exceeds free-tier limits on demo machine | Medium | High | High | Dynamic quantization reduces model to <100MB | Dev | Open |
| R5 | React/Recharts version conflicts | Low | Low | Low | Pin exact versions in package.json | Dev | Open |
| R6 | Solo developer illness/unavailability | Medium | High | High | Build buffer time into schedule; prioritize critical path | PM | Open |
| R7 | Class imbalance biases model toward majority class | High | High | Critical | Weighted Cross-Entropy Loss + Macro F1 evaluation | ML Lead | Open |

2. **Write the Risk Management Plan** — 1–2 paragraphs describing your overall approach to risk (proactive identification, weekly review, severity-based prioritization)
3. **Include a risk matrix** (Likelihood × Impact grid) — can be created with `ak-mermaidjs-v11` as a simple table or diagram

#### Acceptance
- [ ] ≥5 identified risks with all columns filled
- [ ] Each risk has a concrete mitigation strategy
- [ ] Risks cover technical, schedule, and resource categories

---

### Phase 5: Monitor & Control + Closure Plan + Meeting Minutes
**Effort**: ~1 hour | **Rubric**: Criteria 7, 8, 10 (3 pts)

#### What to produce
- Change Control process description
- Closure Plan (acceptance criteria)
- Weekly Meeting Minutes (≥1 per week since team inception)

#### Skills to use

| Skill | Purpose |
|-------|---------|
| **`ak-document-skills`** | Format Meeting Minutes from the provided template. Create the change control and closure sections in `.docx`. |

#### Steps

**Change Control (Criterion 7 — 1 pt):**
1. Describe the change control process:
   - How changes are requested (document change request with reason)
   - How changes are evaluated (impact on scope, time, risk)
   - How changes are approved (solo dev: self-review + commit log)
   - How changes are tracked (Git version control, conventional commits)

**Closure Plan (Criterion 8 — 1 pt):**
1. Define project acceptance criteria:
   - All 3 assignments submitted on time
   - Model achieves Macro F1 ≥ 0.75
   - Dashboard passes the "Control Test" (misinformation vs factual)
   - Responsive on desktop, tablet, mobile
   - Video demo ≤ 7 minutes covering all features
   - All code pushed to repository with documentation
2. Describe the closure process (final review, archiving, lessons learned)

**Meeting Minutes (Criterion 10 — 1 pt):**
1. Download the Meeting Minutes template from Canvas
2. Create at least **3 meeting minutes** (Weeks 1, 2, 3):
   - Week 1: Team formation, project selection, initial research
   - Week 2: Requirements analysis, tech stack decisions, dataset review
   - Week 3: WBS creation, risk identification, prototype sketching
3. Each minute should include: date, attendees, agenda, discussion points, action items, next meeting

> [!NOTE]
> Since you're solo, meeting minutes can reflect self-managed check-ins or meetings with your tutor. Keep them professional and realistic.

#### Acceptance
- [ ] Change control process clearly documented (request → evaluate → approve → track)
- [ ] Closure plan has measurable acceptance criteria
- [ ] ≥3 meeting minutes following the template format

---

### Phase 6: UI Prototype Design
**Effort**: ~2.5 hours | **Rubric**: Criterion 9 (3 pts — highest single criterion!)

#### What to produce
- Frontend prototype screens (3–5 screens minimum)
- Explanation of usability principles applied
- Design rationale connecting to project requirements

#### Skills to use

| Skill | Purpose |
|-------|---------|
| **`ak-stitch`** | Generate high-fidelity UI prototype screens from text prompts. Describe each screen (Dashboard, Analytics, About) and get polished HTML/Tailwind mockups. Screenshot these for the document. |
| **`ak-ui-ux-pro-max`** | Establish the design system: color palette, typography, spacing, layout grid, responsive breakpoints. This ensures your prototypes follow real usability principles you can explain in the document. |
| **`ak-frontend-design`** | If you want to go further and create interactive clickable prototypes or more polished component mockups. |
| **`ak-mermaidjs-v11`** | Create a user flow diagram showing how users navigate through the dashboard screens. |

#### Steps

1. **Define the screen inventory** (from [health-misinfo-plan.md](file:///Users/phaman/Documents/COS30048%20-%20Inno/inno/health-misinfo-plan.md)):
   - **Screen 1: Dashboard** — Text input form, result card (red/yellow/green/blue), confidence gauge
   - **Screen 2: Analytics** — 5 charts (Bar, Radar, Area, Confusion Matrix, Donut), model comparison toggle
   - **Screen 3: About** — Project description, team info, tech stack
   - **Screen 4: Batch Analysis** — File upload, bulk results table
   - **Screen 5: Mobile View** — Responsive single-column layout

2. **Run `ak-ui-ux-pro-max`** to establish:
   - Color system: Green (true) / Red (false) / Yellow (mixture) / Blue (unproven) / Dark mode
   - Typography: System fonts, heading hierarchy
   - Layout: Sidebar + main content area (desktop), bottom nav (mobile)
   - Accessibility: contrast ratios, focus indicators, screen reader labels

3. **Run `ak-stitch`** for each screen — provide detailed prompts:
   ```
   "A health misinformation fact-checking dashboard with a dark sidebar navigation,
   a main content area with a text input form labeled 'Enter Health Claim',
   a submit button, and below it a result card showing 'Health Misinformation'
   in red with a confidence score of 94%. Use Tailwind CSS styling, clean modern design."
   ```

4. **Create a user flow diagram** with `ak-mermaidjs-v11`:
   ```mermaid
   flowchart LR
       A["Landing / Dashboard"] --> B["Enter Claim"]
       B --> C["View Result Card"]
       C --> D["View Confidence Breakdown"]
       C --> E["Navigate to Analytics"]
       E --> F["Explore Charts"]
       F --> G["Toggle Model Comparison"]
       A --> H["Batch Analysis"]
       H --> I["Upload File"]
       I --> J["View Bulk Results"]
       J --> K["Export CSV"]
   ```

5. **Write usability principles justification** (your own words):
   - **Visibility of system status**: Loading spinner during prediction, live/demo mode indicator
   - **Match between system and real world**: Color coding (red = danger/false, green = safe/true)
   - **User control and freedom**: Clear button, history, back navigation
   - **Consistency and standards**: Uniform card layout, consistent button styles
   - **Error prevention**: Input validation, character limit counter
   - **Recognition over recall**: Labels on all charts, tooltips on data points
   - **Flexibility and efficiency**: Keyboard shortcuts, batch mode for power users
   - **Aesthetic and minimalist design**: Clean Tailwind layout, no visual clutter
   - Reference Nielsen's 10 Usability Heuristics (cite in Harvard style)

#### Acceptance
- [ ] ≥3 prototype screens (dashboard, analytics, mobile)
- [ ] Screens show realistic UI with actual project content (not generic)
- [ ] Usability principles explicitly named and connected to design decisions
- [ ] User flow diagram shows navigation between screens

---

## Final Assembly & Submission

### Skills to use for final document

| Skill | Purpose |
|-------|---------|
| **`ak-document-skills`** | Assemble all sections into a single `.docx` or `.pdf` with consistent formatting, headers, page numbers, TOC, and embedded images (WBS diagram, Gantt chart, prototypes, user flow). |

### Document Structure

```
1. Cover Page
2. Table of Contents
3. Project Background & Introduction
4. Team Introduction
5. Project Requirements (Functional + Non-Functional)
6. Scope Management
   6.1 Project Scope Statement
   6.2 Work Breakdown Structure (diagram)
   6.3 WBS Dictionary (table)
7. Time Management
   7.1 Development Schedule
   7.2 Gantt Chart (diagram)
   7.3 Critical Path Analysis
8. Risk Management
   8.1 Risk Register (table)
   8.2 Risk Management Plan
9. Monitor & Control
   9.1 Change Control Process
10. Closure Plan
    10.1 Acceptance Criteria
    10.2 Closure Process
11. Project Design
    11.1 UI Prototype Screens
    11.2 User Flow Diagram
    11.3 Usability Principles
12. References (Harvard Style)
Appendix A: Meeting Minutes
Appendix B: Contribution Form
```

### Checklist before submission
- [ ] File named following convention: `session-xx-group-x-project-management-plan.pdf`
- [ ] ≥800 words (excluding references)
- [ ] All diagrams embedded as images (not just code)
- [ ] Harvard-style citations in-text AND in reference list
- [ ] Turnitin-safe (all content is original, not AI-generated prose)
- [ ] Meeting minutes attached
- [ ] Contribution form attached

---

## Phase Summary

| Phase | Deliverable | Effort | Rubric Pts | Primary Skills |
|-------|------------|--------|------------|----------------|
| 1 | Introduction & Requirements | ~1.5h | 3 | `ak-interview-docs`, `ak-document-skills` |
| 2 | Scope Management (WBS) | ~2h | 2 | `ak-mermaidjs-v11`, `ak-document-skills` |
| 3 | Time Management (Gantt) | ~1.5h | 2 | `ak-mermaidjs-v11`, `ak-document-skills` |
| 4 | Risk Management | ~1.5h | 2 | `ak-document-skills` |
| 5 | Monitor/Control + Closure + Minutes | ~1h | 3 | `ak-document-skills` |
| 6 | UI Prototype Design | ~2.5h | 3 | `ak-stitch`, `ak-ui-ux-pro-max`, `ak-frontend-design`, `ak-mermaidjs-v11` |
| **Total** | | **~10h** | **15** | |

---

## Skill Quick Reference

| Skill | When to Use |
|-------|-------------|
| [`ak-interview-docs`](/Users/phaman/.gemini/config/skills/ak-interview-docs/SKILL.md) | Phase 1 — Structure your project introduction and requirements through guided interview |
| [`ak-mermaidjs-v11`](/Users/phaman/.gemini/config/skills/ak-mermaidjs-v11/SKILL.md) | Phase 2, 3, 6 — Generate WBS diagrams, Gantt charts, user flow diagrams |
| [`ak-document-skills`](/Users/phaman/.gemini/config/skills/ak-document-skills/SKILL.md) | All phases — Format and assemble `.docx`/`.pdf` with tables, TOC, images |
| [`ak-stitch`](/Users/phaman/.gemini/config/skills/ak-stitch/SKILL.md) | Phase 6 — Generate UI prototype screens from text descriptions |
| [`ak-ui-ux-pro-max`](/Users/phaman/.gemini/config/skills/ak-ui-ux-pro-max/SKILL.md) | Phase 6 — Establish design system (colors, typography, layout) |
| [`ak-frontend-design`](/Users/phaman/.gemini/config/skills/ak-frontend-design/SKILL.md) | Phase 6 (optional) — Create polished interactive prototypes |
