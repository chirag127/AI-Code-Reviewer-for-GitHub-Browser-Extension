Here's a complete **Product Requirements Document (PRD)** for the **"AI Code Reviewer for GitHub"** browser extension:

---

# 📄 Product Requirements Document (PRD)
## Product Name: **AI Code Reviewer for GitHub**
### TL;DR: Chrome/Edge/Firefox browser extension that injects inline AI-powered suggestions and security insights directly into GitHub PR diffs, using Gemini 2.0 Flash Lite.

---

## 📌 Problem Statement
Reviewing pull requests (PRs) is time-consuming, especially when checking for:
- Code quality issues
- Security vulnerabilities
- Style and logic problems
Manual reviews are inconsistent and prone to bias or oversight.

---

## 🎯 Goal
Build a browser extension that enhances GitHub’s PR interface by injecting inline AI code review suggestions using Gemini 2.0 Flash Lite.

---

## 🧠 Key Features

### 1. 🔍 **Inline AI Code Review Suggestions**
- Injects AI-generated comments into GitHub diff views.
- Suggestions cover:
  - Code quality
  - Logic flaws
  - Readability
  - Best practices

### 2. 🔐 **Security Risk Detection**
- Identifies and explains potential security issues (e.g., SQL injection, XSS, unsafe APIs).
- Ranks risk severity and gives fix suggestions.

### 3. ⚡ **Lightweight Review Mode**
- Button on the GitHub PR page: `Review with AI`
- Processes only modified lines in PR.
- Option to select between:
  - Full Review
  - Security Only
  - Optimization Tips

### 4. 🧪 **Experimental Review Modes (Optional)**
- “Junior Reviewer” (Beginner-level tips)
- “Senior Reviewer” (High-level design/architecture feedback)

---

## 🔧 Technical Specs

### 👁️ Frontend (extension/)
- **Browser Extension (Manifest V3)** supporting:
  - Chrome, Edge, Firefox
- Injects UI into GitHub PR pages:
  - A top-bar toggle button to trigger AI review
  - Injected comment nodes under each changed code line
- Technologies:
  - HTML, CSS, JS
  - Uses `MutationObserver` to detect GitHub PR DOM
  - Communicates with backend via REST API

### 🧠 Backend (backend/)
- **Express.js API Server**
- Exposes `/review` POST endpoint:
  - Input: Diff chunks with metadata (file, line numbers, code)
  - Output: Array of AI suggestions with target line numbers
- Uses **Gemini 2.0 Flash Lite** to:
  - Analyze code diffs
  - Generate concise, context-aware reviews
- Optionally caches past reviews in MongoDB for faster re-access

---

## 📁 Folder Structure

```
project-root/
├── extension/
│   ├── manifest.json
│   ├── contentScript.js
│   ├── background.js
│   ├── popup.html / settings UI
│   └── styles.css
├── backend/
│   ├── server.js
│   ├── routes/review.js
│   ├── services/gemini.js
│   └── utils/parser.js
```

---

## 🔐 Authentication & Security
- No GitHub API token needed (DOM scraping).
- All processing happens locally + via secured backend.
- No code is permanently stored unless the user enables history.

---

## 🧪 MVP Scope

| Feature                      | Included in MVP? |
|-----------------------------|------------------|
| Inline code suggestions     | ✅               |
| Security analysis           | ✅               |
| GitHub PR DOM injection     | ✅               |
| Full vs. security-only mode | ✅               |
| Reviewer personas           | ❌ (post-MVP)    |
| MongoDB storage             | ❌ (optional)    |
| Dark mode support           | ✅               |

---

## 🗓️ Timeline (Est. 2–3 Weeks MVP)

| Week | Tasks                                      |
|------|--------------------------------------------|
| 1    | DOM parsing, UI injection, basic backend   |
| 2    | Gemini integration, API review logic       |
| 3    | Final polish, testing (Chrome, Firefox)    |

---

## ✅ Success Metrics
- 95%+ inline accuracy for line-to-suggestion mapping.
- <3 sec response time for PRs <500 LOC.
- Positive feedback from dev testers (via GitHub repo)

---

## 🔮 Other Enhancements
- Reviewer personas (Junior/Senior)
- Inline edits and auto-fix suggestions
- GitHub API integration for posting comments
- PR review history dashboard
