# Contributing to CodeGuardian-AI-GitHub-Code-Review-Browser-Extension

Thank you for considering contributing to `CodeGuardian-AI-GitHub-Code-Review-Browser-Extension`! We strive to maintain a high standard of code quality, clarity, and professionalism, aligned with FAANG-level expectations and the principles of "Zero-Defect, High-Velocity, Future-Proof" development.

This project adheres to the **Apex Technical Authority** standards, focusing on robust architecture, clear documentation, and efficient development workflows. We welcome contributions that enhance its functionality, improve its reliability, or refine its user experience.

## 1. Our Guiding Principles

*   **Code Quality:** Strive for clean, well-documented, and maintainable code. Follow the **SOLID**, **DRY**, and **YAGNI** principles.
*   **Professionalism:** Maintain a respectful and constructive tone in all communications.
*   **Velocity:** Aim for efficient development cycles through clear processes and automation.
*   **Future-Proofing:** Consider scalability, extensibility, and long-term maintainability.
*   **Security:** Prioritize security in all aspects of development. Ensure that contributions do not introduce vulnerabilities.

## 2. How to Contribute

### 2.1. Development Environment Setup

To contribute, you'll need to set up a development environment that mirrors the project's stack. This project is a JavaScript/Node.js based browser extension.

1.  **Clone the Repository:**
    bash
    git clone https://github.com/chirag127/CodeGuardian-AI-GitHub-Code-Review-Browser-Extension.git
    cd CodeGuardian-AI-GitHub-Code-Review-Browser-Extension
    

2.  **Install Dependencies:**
    This project uses `npm` for package management. Ensure you have Node.js and npm installed.
    bash
    npm install
    

3.  **Environment Variables:**
    This project may rely on environment variables, especially for API keys (e.g., Gemini API). Create a `.env` file in the root directory:
    
    # Example .env file
    GEMINI_API_KEY=your_gemini_api_key_here
    # Add other necessary variables as per .env.example if provided
    
    *Note: Never commit `.env` files to the repository.*

### 2.2. Running the Extension Locally

Refer to the `README.md` for specific instructions on how to build and run the extension in development mode for your browser (Chrome/Firefox).

### 2.3. Workflow for Contributions

1.  **Fork the Repository:** Create your own fork of the `chirag127/CodeGuardian-AI-GitHub-Code-Review-Browser-Extension` repository.
2.  **Create a New Branch:** Fork the main repository and create a feature branch for your contribution.
    bash
    git checkout -b feature/your-feature-name
    
3.  **Make Your Changes:** Implement your feature or fix.
4.  **Test Your Changes:** Ensure your changes pass all existing tests and add new tests if necessary. Refer to testing instructions in the `README.md`.
5.  **Lint and Format:** Ensure your code adheres to the project's linting and formatting standards. Typically, this can be done with:
    bash
    npm run lint
    npm run format
    
6.  **Commit Your Changes:** Write clear and concise commit messages. Follow conventional commits if applicable.
    bash
    git commit -m "feat: Add new code analysis feature"
    
7.  **Push to Your Fork:** Push your branch to your forked repository.
    bash
    git push origin feature/your-feature-name
    
8.  **Open a Pull Request:** Create a Pull Request from your feature branch to the `main` branch of the `chirag127/CodeGuardian-AI-GitHub-Code-Review-Browser-Extension` repository.

### 2.4. Pull Request Guidelines

*   **Clear Description:** Provide a detailed description of your changes, including the problem they solve and how they were tested.
*   **Link to Issues:** If your PR addresses an existing issue, reference it using keywords like `Fixes #123` or `Closes #123`.
*   **Code Review:** Be prepared to engage in the code review process and address feedback promptly.
*   **CI Checks:** Ensure all Continuous Integration checks pass before your PR can be merged.

## 3. Code of Conduct

This project is governed by a Code of Conduct, which can be found at [`.github/CODE_OF_CONDUCT.md`](.github/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to `[email protected]`.

## 4. Issues and Feature Requests

*   **Reporting Bugs:** Please use the provided issue template for bug reports to ensure we have all the necessary information.
*   **Suggesting Features:** Feel free to open an issue to discuss potential new features or improvements.

## 5. Technical Standards & Agent Directives

This project adheres to the **Apex Technical Authority** directives. All contributions should align with the specified tech stack and architectural patterns. For detailed technical specifications and agent interaction protocols, please refer to the **AI Agent Directives** section within the `README.md` or the standalone `AGENTS.md` file.

Specifically, refer to:
*   **Tech Stack:** JavaScript, Node.js, Browser Extension APIs, Gemini API.
*   **Architecture:** Focus on modularity, clear separation of concerns, and efficient browser extension architecture.
*   **Verification:** Automated tests (e.g., Jest, Vitest) and manual testing are crucial.

## 6. Community & Support

We aim to foster a collaborative and supportive community. If you have questions or need assistance, please engage through GitHub Issues or Discussions.

Thank you for your contribution!

*Last updated: December 2025*
