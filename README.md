![CodeGuardian AI Banner](https://i.imgur.com/your_custom_banner_url.png)

# CodeGuardian-AI-GitHub-Code-Review-Browser-Extension

**The definitive intelligent layer for enhancing GitHub Pull Request analysis directly within your browser, powered by Google Gemini.** This extension injects actionable, context-aware code review suggestions, security vulnerability checks, and architectural feedback into the GitHub UI, leveraging the most advanced LLMs available.

---

## 🚀 Project Status & Metrics

[![Build Status](https://img.shields.io/github/actions/workflow/status/chirag127/CodeGuardian-AI-GitHub-Code-Review-Browser-Extension/ci.yml?label=Build&style=flat-square)](https://github.com/chirag127/CodeGuardian-AI-GitHub-Code-Review-Browser-Extension/actions/workflows/ci.yml)
[![Code Coverage](https://img.shields.io/codecov/c/github/chirag127/CodeGuardian-AI-GitHub-Code-Review-Browser-Extension?style=flat-square)](https://codecov.io/gh/chirag127/CodeGuardian-AI-GitHub-Code-Review-Browser-Extension)
[![Language](https://img.shields.io/github/languages/top/chirag127/CodeGuardian-AI-GitHub-Code-Review-Browser-Extension?style=flat-square&color=FFCA3A)](https://www.javascript.com/)
[![Linter Status](https://img.shields.io/badge/Linter-Biome-passing?style=flat-square&logo=biome)](https://biomejs.dev/)
[![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue?style=flat-square)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/chirag127/CodeGuardian-AI-GitHub-Code-Review-Browser-Extension?style=flat-square)](https://github.com/chirag127/CodeGuardian-AI-GitHub-Code-Review-Browser-Extension)

**Support the future of intelligent development tooling:**

<a href="https://github.com/chirag127/CodeGuardian-AI-GitHub-Code-Review-Browser-Extension/stargazers">
  <img src="https://img.shields.io/github/stars/chirag127/CodeGuardian-AI-GitHub-Code-Review-Browser-Extension?style=social" alt="Star on GitHub"/>
</a>

---

## 💡 Overview

**CodeGuardian-AI-GitHub-Code-Review-Browser-Extension** revolutionizes the Pull Request workflow by making advanced AI analysis a seamless, real-time part of the developer experience. Instead of context-switching to external tools, CodeGuardian leverages the robust **Gemini Pro Model** to provide instant feedback directly adjacent to the changed code on GitHub. It focuses on identifying subtle logic errors, enforcing coding standards, and flagging common security antipatterns.

## 🏗️ Architecture Map (Browser Extension Layer)

ascii
+-----------------------------+
|   Browser Environment (DOM)   |
| (GitHub PR Page Injection)    |
+--------------+--------------+
               |
         [Content Script Layer] (Runs in page context)
               |
+--------------v--------------+
|  Orchestrator (Vanilla JS/TS) |
| - MutationObserver: Detects   |
|   DOM changes (new comments,  |
|   file switching).            |
+--------------+--------------+
               |
+--------------v--------------+
|      API Proxy Handler        |
| - Sanitizes input/output.     |
| - Handles API Key Storage     |
|   (Encrypted via Storage API).|
+--------------+--------------+
               |
+--------------v--------------+
|     Gemini/LLM Integration    |
| - Prompts optimized for       |
|   Code Review (FSD/SOLID).    |
| - Asynchronous Call to Backend|
+-----------------------------+


## 📚 Documentation & Directives

This project adheres to the **Apex Technical Authority (ATA) Standard**. For detailed architectural requirements, linting rules, and agent execution protocols, consult the integrated documentation files.

<details>
<summary>🤖 AI Agent Directives (Customized for Browser Extension - JS/TS)</summary>

# AGENTS.md: APEX EXECUTION PROTOCOL

## 1. IDENTITY & PRIME DIRECTIVE (Browser Extension Context)
**Role:** Senior Principal Architect enforcing Zero-Defect standards for client-side tooling.
**Goal:** Ensure seamless, non-blocking integration into the GitHub DOM while maintaining strict security boundaries for stored API keys and respecting browser performance budgets.
**Philosophy:** "Non-Intrusive, High-Fidelity Feedback."

## 2. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)

*   **PRIMARY SCENARIO: WEB / APP / EXTENSION (TypeScript)**
    *   **Stack:** **TypeScript 6.x** (Strict Mode enforced via `tsconfig.json`), **Vite 7** (Build Tooling), **WXT** (Web Extension Build System).
    *   **Architecture:** **Feature-Sliced Design (FSD)** mapping strictly to extension layers (Content Scripts, Background/Service Workers, UI/Popup). State management via standard browser APIs (`chrome.storage`/`browser.storage`).
    *   **Lint/Test:** **Biome** for ultra-fast linting/formatting. **Vitest** for unit testing core logic. **Playwright** for end-to-end simulation of GitHub interactions.
    *   **AI Integration:** All calls to the Gemini API MUST be routed through a dedicated Service Worker to prevent exposing keys in the Content Script and to manage throttling/rate limiting gracefully.

## 3. ARCHITECTURAL PRINCIPLES
1.  **SOLID Compliance:** Particularly the **Single Responsibility Principle (SRP)**. Content scripts handle DOM manipulation ONLY; Background scripts handle heavy lifting/API calls.
2.  **DRY:** Abstract repetitive DOM manipulation patterns into reusable utility functions.
3.  **YAGNI:** Only implement features explicitly required by the current review scope. Avoid premature complexity.

## 4. VERIFICATION COMMANDS (APEX TOOLCHAIN)

| Command | Purpose | Toolchain Standard |
| :--- | :--- | :--- |
| `npx @biomejs/biome check --apply` | Format and Fix all code | Biome (Fast Linter) |
| `npx vitest run --coverage` | Execute Unit Tests & Generate Coverage Report | Vitest/Codecov |
| `npm run build:prod` | Compile TypeScript and package extension artifacts | Vite/WXT |
| `npx playwright test` | E2E Verification against GitHub staging environments | Playwright |

</details>

## 🛠️ Development & Setup

This project utilizes the modern JavaScript/TypeScript tooling ecosystem for peak velocity and strict type safety.

### Prerequisites

1.  Node.js (v20.0+ or higher recommended for 2025 standards).
2.  Git.

### Installation

bash
git clone https://github.com/chirag127/CodeGuardian-AI-GitHub-Code-Review-Browser-Extension.git
cd CodeGuardian-AI-GitHub-Code-Review-Browser-Extension
# Using uv for Python package management (if applicable for CLI/backend services, otherwise standard npm)
# Since this is a JS extension, we use npm/pnpm/yarn. Assuming npm for simplicity.
npm install
# Set your GEMINI_API_KEY in a .env file or via environment variables


### Scripts Table

| Script | Description | Execution Target |
| :--- | :--- | :--- |
| `npm run dev` | Start the dev server with hot-reloading | Vite/WXT |
| `npm run build` | Compile production-ready extension bundles | Vite/WXT |
| `npm run format` | Run Biome formatter | Biome |
| `npm run lint` | Check code quality | Biome |
| `npm run test:unit` | Run Vitest unit tests | Vitest |
| `npm run test:e2e` | Run Playwright end-to-end tests | Playwright |

## 📜 Development Principles

*   **Type Safety First:** Embrace TypeScript strict mode to catch errors at compile time, not runtime in a user's browser.
*   **Performance Budgets:** Ensure content scripts execute quickly and minimize DOM reflows.
*   **API Abstraction:** The Gemini integration layer must be decoupled, allowing easy swapping to other LLMs (e.g., Claude, internal models) without rewriting core UI logic.

## ⚖️ License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License**. See the [LICENSE](./LICENSE) file for details.
