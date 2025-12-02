# 🤝 Contributing to CodeGuard-AI-Powered-GitHub-Code-Reviewer-Browser-Extension

As an Apex Technical Authority project, we uphold the highest standards of quality, maintainability, and future-proofing. Contributions are critical to enhancing this elite tool.

## 1. Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold these standards. Be respectful, constructive, and professional.

## 2. The Apex Contribution Workflow

We enforce a strict contribution workflow modeled on **Zero-Defect, High-Velocity, Future-Proof** principles. All contributions must pass automated gating checks before manual review.

### A. Pre-Requisites (The Environment)

Ensure your environment aligns with the repository's defined stack (JavaScript/TypeScript, Vite, Browser Extension Standards).

1.  **Clone Repository:**
    bash
    git clone https://github.com/chirag127/CodeGuard-AI-Powered-GitHub-Code-Reviewer-Browser-Extension.git
    cd CodeGuard-AI-Powered-GitHub-Code-Reviewer-Browser-Extension
    
2.  **Install Dependencies (Using Apex Standard Tooling):**
    We utilize **npm** for dependency management in this JS/TS project.
    bash
    npm install
    
3.  **Environment Alignment (If applicable):**
    If integrating with external AI services (e.g., Gemini, OpenAI), ensure your `.env` file is correctly configured according to the project's local setup guide (see `README.md`).

### B. Development & Verification

All development must occur on a feature branch. Before submitting a Pull Request (PR), you **MUST** ensure all local checks pass.

1.  **Run Local Verification Suite:** This runs formatting checks (Biome), linting, unit tests (Vitest), and integration tests (Playwright).
    bash
    # Run fast checks (Linting/Formatting)
    npm run check

    # Run full test suite
    npm run test
    
2.  **Review Your Changes:** Manually verify that your code adheres to the **SOLID**, **DRY**, and **YAGNI** principles outlined in the Architectural documentation.

### C. Submitting a Pull Request

1.  **Push Feature Branch:** Push your verified branch to your fork.
2.  **Create PR:** Open a Pull Request targeting `main` in the upstream repository (`chirag127/CodeGuard-AI-Powered-GitHub-Code-Reviewer-Browser-Extension`).
3.  **Template Usage:** **You MUST** use the provided **Pull Request Template** (`.github/PULL_REQUEST_TEMPLATE.md`). Ensure the PR description clearly articulates:
    *   The problem solved (linking to an issue if necessary).
    *   The architectural pattern used (e.g., Adapter for GitHub API interaction).
    *   Verification steps taken.

## 3. Architectural Adherence (The Apex Mandates)

Contributions that deviate from the core architectural patterns will be flagged for rework.

*   **TypeScript Strictness:** All new code must adhere to strict TypeScript configuration (`tsconfig.json`). No `any` types allowed unless explicitly documented and approved by a core maintainer.
*   **Feature-Sliced Design (FSD):** Ensure new components/features are correctly layered (e.g., `features/`, `entities/`, `shared/`).
*   **AI Interaction Layer:** All calls to external AI models must route through the dedicated **Adapter** layer to facilitate future technology swaps (Ports & Adapters pattern).

## 4. Reporting Issues

If you encounter a bug or wish to suggest a feature, please use the **Issue Template** (`.github/ISSUE_TEMPLATE/bug_report.md`). Be precise and provide actionable steps for replication.

## 5. Security Disclosure

We take security seriously. If you discover a vulnerability, please follow the guidelines in **SECURITY.md** instead of opening a public issue.

--- 
*Thank you for your dedication to engineering excellence. Your contribution helps advance the state-of-the-art in developer tooling.*