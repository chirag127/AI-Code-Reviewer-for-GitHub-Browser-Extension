# Security Policy

## Supported Versions

We are committed to maintaining a secure extension. The following versions are actively supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| 1.x     | :white_check_mark: |
| 2.x     | :x:                |

> Only the latest major version (currently 1.x) is actively maintained. Security vulnerabilities will be addressed on a best-effort basis for older versions.

## Reporting a Vulnerability

We appreciate your efforts to responsibly disclose security vulnerabilities in `CodeGuard-AI-Powered-GitHub-Code-Reviewer-Browser-Extension`. Please follow these steps:

1.  **DO NOT** report security vulnerabilities through public GitHub issues. This includes security-related bugs, architectural flaws, or other security concerns.
2.  **DO NOT** create a pull request for a security vulnerability. This could expose sensitive information.
3.  **PRIVATE REPORTING:** Please report any potential security vulnerability to us privately by sending an email to `security@example.com` (replace with actual security contact if available). 
    *   Include as much of the following information as possible:
        *   The vulnerability in question.
        *   Affected component(s).
        *   Steps to reproduce the vulnerability.
        *   Potential impact of the vulnerability.
        *   Any mitigation or remediation steps you recommend.
    *   We will respond within **48 hours** to acknowledge your report.
    *   We will send a follow-up email to notify you once the issue is resolved.

## Responsible Disclosure

We will not pursue or will grant a "safe harbor" to security researchers who act in good faith when reporting vulnerabilities according to this policy. We define the "security research" period as starting from the moment the vulnerability is reported to us until 90 days after we have addressed the vulnerability. During this period, we agree not to pursue legal action or report the identified vulnerability to law enforcement agencies.

## Supported Technologies

This policy applies to the `CodeGuard-AI-Powered-GitHub-Code-Reviewer-Browser-Extension` code and its direct dependencies managed by `uv` and `npm`/`yarn`.

## Security Tools & Practices

We are committed to securing `CodeGuard-AI-Powered-GitHub-Code-Reviewer-Browser-Extension` by employing the following practices and tools:

*   **Linters & Formatters:** `Ruff` (Python) and `Biome` (JavaScript/TypeScript) are used to enforce code quality and identify potential issues early.
*   **Testing:** `Pytest` (Python) and `Vitest`/`Playwright` (JavaScript/TypeScript) are used for comprehensive unit, integration, and end-to-end testing.
*   **Dependency Management:** `uv` (Python) and `npm`/`yarn` (JavaScript) are used to manage dependencies, and we regularly scan for known vulnerabilities using `npm audit` or similar tools integrated into our CI pipeline.
*   **AI Integration Security:** When interacting with AI services (e.g., GitHub Copilot, Gemini API), we ensure:
    *   Secure API key management (using environment variables or a secure vault).
    *   Input sanitization to prevent prompt injection attacks.
    *   Regular review of AI service provider security policies.
*   **Browser Extension Security:** Adherence to best practices for browser extension development, including:
    *   Content security policies (CSP).
    *   Minimizing required permissions.
    *   Sanitizing all user input and cross-origin communication.
    *   Regularly updating browser extension APIs and frameworks.

This security policy is a living document and will be updated as needed. For the latest information, please refer to the repository's `SECURITY.md` file at `https://github.com/chirag127/CodeGuard-AI-Powered-GitHub-Code-Reviewer-Browser-Extension`.