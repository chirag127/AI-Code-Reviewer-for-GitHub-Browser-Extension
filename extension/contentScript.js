/**
 * AI Code Reviewer for GitHub - Content Script
 *
 * This script is injected into GitHub PR pages and handles:
 * 1. Detecting when a user is viewing a PR
 * 2. Injecting the "Review with AI" button
 * 3. Parsing the diff content when review is requested
 * 4. Sending diff data to the backend
 * 5. Displaying review comments inline with the code
 */

// Configuration
const API_ENDPOINT = "http://localhost:3000/review";
const REVIEW_MODES = {
    FULL: "full",
    SECURITY: "security",
    OPTIMIZATION: "optimization",
};

// State
let currentReviewMode = REVIEW_MODES.FULL;
let isReviewInProgress = false;

/**
 * Initialize the extension when the page is loaded
 */
function initialize() {
    console.log("AI Code Reviewer: Initializing...");
    console.log("AI Code Reviewer: Current URL:", window.location.href);

    // Check if we're on a GitHub PR page
    if (isGitHubPRPage()) {
        console.log("AI Code Reviewer: GitHub PR page detected");

        // Set up MutationObserver to detect when PR content is loaded
        setupMutationObserver();

        // Try to inject UI immediately in case the page is already loaded
        injectReviewUI();

        // Add a delayed retry to handle dynamic loading
        setTimeout(() => {
            console.log("AI Code Reviewer: Retrying UI injection after delay");
            injectReviewUI();
        }, 2000);
    } else {
        console.log("AI Code Reviewer: Not a GitHub PR page");
    }
}

/**
 * Check if the current page is a GitHub PR page
 */
function isGitHubPRPage() {
    return window.location.href.match(/github\.com\/.*\/.*\/pull\/\d+/);
}

/**
 * Set up MutationObserver to detect when PR content is loaded
 */
function setupMutationObserver() {
    console.log("AI Code Reviewer: Setting up MutationObserver");

    // Elements to watch for that indicate PR content is loaded
    const prContentSelectors = [
        ".js-diff-progressive-container", // Classic diff container
        ".js-file-content", // File content container
        ".js-diff-table", // Diff table
        ".diff-view", // Diff view container
        ".js-pull-refresh-on-pjax", // PR refresh container
    ];

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                // Check if any of our target elements have been loaded
                let shouldInject = false;

                for (const selector of prContentSelectors) {
                    if (document.querySelector(selector)) {
                        console.log(
                            `AI Code Reviewer: Detected PR content with selector: ${selector}`
                        );
                        shouldInject = true;
                        break;
                    }
                }

                if (shouldInject) {
                    injectReviewUI();
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Also set up a periodic check in case the MutationObserver misses something
    const checkInterval = setInterval(() => {
        console.log("AI Code Reviewer: Periodic check for PR content");

        let shouldInject = false;
        for (const selector of prContentSelectors) {
            if (document.querySelector(selector)) {
                console.log(
                    `AI Code Reviewer: Detected PR content with selector: ${selector} (periodic check)`
                );
                shouldInject = true;
                break;
            }
        }

        if (shouldInject) {
            injectReviewUI();
        }

        // Stop checking after 30 seconds
        if (document.querySelector(".ai-code-reviewer-button")) {
            console.log(
                "AI Code Reviewer: UI already injected, stopping periodic check"
            );
            clearInterval(checkInterval);
        }
    }, 3000);

    // Clear the interval after 30 seconds regardless
    setTimeout(() => {
        clearInterval(checkInterval);
        console.log("AI Code Reviewer: Stopped periodic check after timeout");
    }, 30000);
}

/**
 * Inject the "Review with AI" button and review mode selector
 */
function injectReviewUI() {
    // Check if UI is already injected
    if (document.querySelector(".ai-code-reviewer-button")) {
        console.log("AI Code Reviewer: UI already injected");
        return;
    }

    // Find the PR header where we'll inject our button
    // Try multiple selectors to handle different GitHub UI layouts
    const prHeaderSelectors = [
        ".pr-toolbar", // Classic PR header
        ".gh-header-actions", // New PR header actions
        ".js-updatable-content .d-flex.flex-items-center", // Alternative PR header
        ".js-issue-toolbar", // Issue toolbar that might be in PRs
        ".gh-header-meta", // Header meta section
    ];

    let prHeader = null;

    // Try each selector until we find a match
    for (const selector of prHeaderSelectors) {
        prHeader = document.querySelector(selector);
        if (prHeader) {
            console.log(
                `AI Code Reviewer: Found PR header with selector: ${selector}`
            );
            break;
        }
    }

    if (!prHeader) {
        console.log(
            "AI Code Reviewer: PR header not found. Available elements:"
        );
        console.log("Body classes:", document.body.className);
        console.log("Headers:", document.querySelectorAll("header").length);
        console.log(
            "Toolbars:",
            document.querySelectorAll("[class*='toolbar']").length
        );
        return;
    }

    // Create container for our UI
    const container = document.createElement("div");
    container.className = "ai-code-reviewer-container";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.margin = "0 10px";

    // Create the "Review with AI" button
    const reviewButton = document.createElement("button");
    reviewButton.className = "ai-code-reviewer-button btn btn-sm";
    reviewButton.textContent = "Review with AI";
    reviewButton.style.backgroundColor = "#2ea44f";
    reviewButton.style.color = "white";
    reviewButton.style.border = "1px solid rgba(27, 31, 35, 0.15)";
    reviewButton.style.borderRadius = "6px";
    reviewButton.style.padding = "5px 16px";
    reviewButton.style.fontSize = "14px";
    reviewButton.style.fontWeight = "500";
    reviewButton.style.cursor = "pointer";
    reviewButton.style.marginLeft = "8px";
    reviewButton.addEventListener("click", handleReviewButtonClick);

    // Create review mode selector
    const modeSelector = document.createElement("select");
    modeSelector.className = "ai-code-reviewer-mode-selector";
    modeSelector.style.border = "1px solid #e1e4e8";
    modeSelector.style.borderRadius = "6px";
    modeSelector.style.padding = "5px 24px 5px 8px";
    modeSelector.style.fontSize = "14px";
    modeSelector.style.backgroundColor = "#f6f8fa";
    modeSelector.style.color = "#24292e";

    const modes = [
        { value: REVIEW_MODES.FULL, text: "Full Review" },
        { value: REVIEW_MODES.SECURITY, text: "Security Only" },
        { value: REVIEW_MODES.OPTIMIZATION, text: "Optimization Tips" },
    ];

    modes.forEach((mode) => {
        const option = document.createElement("option");
        option.value = mode.value;
        option.textContent = mode.text;
        modeSelector.appendChild(option);
    });

    modeSelector.addEventListener("change", (e) => {
        currentReviewMode = e.target.value;
    });

    // Add elements to container
    container.appendChild(modeSelector);
    container.appendChild(reviewButton);

    // Add container to PR header
    prHeader.appendChild(container);

    console.log("AI Code Reviewer: UI injected successfully");
}

/**
 * Handle click on the "Review with AI" button
 */
async function handleReviewButtonClick() {
    if (isReviewInProgress) {
        alert("A review is already in progress. Please wait.");
        return;
    }

    isReviewInProgress = true;
    updateReviewButtonState(true);

    try {
        // Parse the diff content
        const diffData = parseDiffContent();

        if (diffData.length === 0) {
            alert("No code changes found to review.");
            isReviewInProgress = false;
            updateReviewButtonState(false);
            return;
        }

        // Send diff data to backend
        const reviewResults = await sendDiffToBackend(diffData);

        // Display review comments
        displayReviewComments(reviewResults);
    } catch (error) {
        console.error("AI Code Reviewer: Error during review:", error);
        alert(`Error during review: ${error.message}`);
    } finally {
        isReviewInProgress = false;
        updateReviewButtonState(false);
    }
}

/**
 * Update the review button state (loading/normal)
 */
function updateReviewButtonState(isLoading) {
    const button = document.querySelector(".ai-code-reviewer-button");
    if (button) {
        if (isLoading) {
            button.textContent = "Reviewing...";
            button.disabled = true;
        } else {
            button.textContent = "Review with AI";
            button.disabled = false;
        }
    }
}

/**
 * Parse the diff content from the GitHub PR page
 */
function parseDiffContent() {
    console.log("AI Code Reviewer: Parsing diff content");

    const diffFiles = [];

    // Try different selectors for file elements to handle different GitHub UI layouts
    const fileElementSelectors = [
        ".file", // Classic file container
        ".js-file", // New file container
        "[data-file-type]", // File type attribute
        ".js-details-container", // Details container that might contain files
    ];

    let fileElements = [];

    // Try each selector until we find file elements
    for (const selector of fileElementSelectors) {
        fileElements = document.querySelectorAll(selector);
        if (fileElements.length > 0) {
            console.log(
                `AI Code Reviewer: Found ${fileElements.length} file elements with selector: ${selector}`
            );
            break;
        }
    }

    if (fileElements.length === 0) {
        console.log("AI Code Reviewer: No file elements found");
        return diffFiles;
    }

    fileElements.forEach((fileElement) => {
        // Try different selectors for file path elements
        const filePathSelectors = [
            ".file-header .file-info a",
            ".js-file-header .file-info a",
            "[data-path]",
            ".js-file-header-path",
        ];

        let filePathElement = null;

        // Try each selector until we find a file path element
        for (const selector of filePathSelectors) {
            filePathElement = fileElement.querySelector(selector);
            if (filePathElement) {
                break;
            }
        }

        if (!filePathElement) {
            console.log(
                "AI Code Reviewer: No file path element found for a file"
            );
            return;
        }

        // Get file path from element text or data attribute
        let filePath = filePathElement.textContent.trim();
        if (!filePath && filePathElement.hasAttribute("data-path")) {
            filePath = filePathElement.getAttribute("data-path");
        }

        if (!filePath) {
            console.log("AI Code Reviewer: Could not determine file path");
            return;
        }

        console.log(`AI Code Reviewer: Processing file: ${filePath}`);

        // Try different selectors for diff chunks
        const diffChunkSelectors = [
            ".js-file-content .js-file-line-container tr.js-expandable-line",
            ".js-file-content tr.js-expandable-line",
            ".js-file-content tr.blob-expanded",
            ".js-file-line-container tr",
            ".diff-table tr",
        ];

        let diffHunks = [];

        // Try each selector until we find diff chunks
        for (const selector of diffChunkSelectors) {
            diffHunks = fileElement.querySelectorAll(selector);
            if (diffHunks.length > 0) {
                console.log(
                    `AI Code Reviewer: Found ${diffHunks.length} diff chunks with selector: ${selector}`
                );
                break;
            }
        }

        if (diffHunks.length === 0) {
            console.log(
                `AI Code Reviewer: No diff chunks found for file: ${filePath}`
            );
            return;
        }

        // Get diff chunks
        const diffChunks = [];

        diffHunks.forEach((hunk) => {
            // Try different selectors for line elements
            const lineElementSelectors = [
                "td.blob-code",
                "td.js-file-line",
                ".blob-code",
                ".js-file-line",
            ];

            let lineElements = [];

            // Try each selector until we find line elements
            for (const selector of lineElementSelectors) {
                lineElements = hunk.querySelectorAll(selector);
                if (lineElements.length >= 2) {
                    break;
                }
            }

            if (lineElements.length < 2) {
                return;
            }

            // Get line numbers
            let oldLineNumber = null;
            let newLineNumber = null;

            // Try to get line numbers from data attributes
            if (lineElements[0].hasAttribute("data-line-number")) {
                oldLineNumber =
                    lineElements[0].getAttribute("data-line-number");
            }

            if (lineElements[1].hasAttribute("data-line-number")) {
                newLineNumber =
                    lineElements[1].getAttribute("data-line-number");
            }

            // If line numbers are not available from data attributes, try to find them in other elements
            if (!oldLineNumber || !newLineNumber) {
                const lineNumberElements = hunk.querySelectorAll(
                    ".blob-num, .line-num"
                );
                if (lineNumberElements.length >= 2) {
                    oldLineNumber =
                        oldLineNumber ||
                        lineNumberElements[0].textContent.trim();
                    newLineNumber =
                        newLineNumber ||
                        lineNumberElements[1].textContent.trim();
                }
            }

            if (!oldLineNumber && !newLineNumber) {
                return;
            }

            // Get code content
            const codeContent = lineElements[1].textContent.trim();

            diffChunks.push({
                oldLineNumber,
                newLineNumber,
                codeContent,
            });
        });

        if (diffChunks.length > 0) {
            diffFiles.push({
                filePath,
                diffChunks,
            });
            console.log(
                `AI Code Reviewer: Added file with ${diffChunks.length} chunks: ${filePath}`
            );
        }
    });

    console.log(
        `AI Code Reviewer: Parsed ${diffFiles.length} files with diff content`
    );
    return diffFiles;
}

/**
 * Send diff data to the backend for review
 */
async function sendDiffToBackend(diffData) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                diffData,
                reviewMode: currentReviewMode,
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(
            "AI Code Reviewer: Error sending diff to backend:",
            error
        );
        throw error;
    }
}

/**
 * Display review comments inline with the code
 */
function displayReviewComments(reviewResults) {
    if (!reviewResults || !reviewResults.suggestions) {
        console.error("AI Code Reviewer: Invalid review results");
        return;
    }

    // Clear any existing review comments
    clearExistingReviewComments();

    // Process each suggestion
    reviewResults.suggestions.forEach((suggestion) => {
        const { filePath, lineNumber, message, severity } = suggestion;

        // Find the corresponding line in the diff
        const lineElement = findLineElement(filePath, lineNumber);
        if (!lineElement) {
            console.warn(
                `AI Code Reviewer: Could not find line ${lineNumber} in file ${filePath}`
            );
            return;
        }

        // Create and insert comment
        insertReviewComment(lineElement, message, severity);
    });

    console.log("AI Code Reviewer: Review comments displayed");
}

/**
 * Clear any existing review comments
 */
function clearExistingReviewComments() {
    const existingComments = document.querySelectorAll(
        ".ai-code-reviewer-comment"
    );
    existingComments.forEach((comment) => comment.remove());
}

/**
 * Find the DOM element for a specific line in a file
 */
function findLineElement(filePath, lineNumber) {
    console.log(
        `AI Code Reviewer: Finding line ${lineNumber} in file ${filePath}`
    );

    // Try different selectors for file elements to handle different GitHub UI layouts
    const fileElementSelectors = [
        ".file", // Classic file container
        ".js-file", // New file container
        "[data-file-type]", // File type attribute
        ".js-details-container", // Details container that might contain files
    ];

    let targetFileElement = null;

    // Try each file element selector
    for (const fileSelector of fileElementSelectors) {
        const fileElements = document.querySelectorAll(fileSelector);

        // Try to find the file with the matching path
        for (const fileElement of fileElements) {
            // Try different selectors for file path elements
            const filePathSelectors = [
                ".file-header .file-info a",
                ".js-file-header .file-info a",
                "[data-path]",
                ".js-file-header-path",
            ];

            let filePathElement = null;
            let foundFilePath = null;

            // Try each file path selector
            for (const pathSelector of filePathSelectors) {
                filePathElement = fileElement.querySelector(pathSelector);
                if (filePathElement) {
                    // Get file path from element text or data attribute
                    foundFilePath = filePathElement.textContent.trim();
                    if (
                        !foundFilePath &&
                        filePathElement.hasAttribute("data-path")
                    ) {
                        foundFilePath =
                            filePathElement.getAttribute("data-path");
                    }

                    if (foundFilePath === filePath) {
                        targetFileElement = fileElement;
                        console.log(
                            `AI Code Reviewer: Found file element for ${filePath}`
                        );
                        break;
                    }
                }
            }

            if (targetFileElement) break;
        }

        if (targetFileElement) break;
    }

    if (!targetFileElement) {
        console.log(
            `AI Code Reviewer: Could not find file element for ${filePath}`
        );
        return null;
    }

    // Try different selectors for line elements
    const lineElementSelectors = [
        ".js-file-line",
        "tr.blob-expanded",
        "tr[data-line-number]",
        ".diff-table tr",
    ];

    for (const lineSelector of lineElementSelectors) {
        const lineElements = targetFileElement.querySelectorAll(lineSelector);
        console.log(
            `AI Code Reviewer: Found ${lineElements.length} line elements with selector: ${lineSelector}`
        );

        for (const lineElement of lineElements) {
            // Try different selectors for line number elements
            const lineNumberSelectors = [
                ".blob-num",
                ".line-num",
                "[data-line-number]",
            ];

            for (const numSelector of lineNumberSelectors) {
                const lineNumberElement =
                    lineElement.querySelector(numSelector);

                if (lineNumberElement) {
                    // Try to get line number from data attribute
                    let foundLineNumber = null;

                    if (lineNumberElement.hasAttribute("data-line-number")) {
                        foundLineNumber =
                            lineNumberElement.getAttribute("data-line-number");
                    } else {
                        foundLineNumber = lineNumberElement.textContent.trim();
                    }

                    if (foundLineNumber === String(lineNumber)) {
                        console.log(
                            `AI Code Reviewer: Found line element for line ${lineNumber}`
                        );
                        return lineElement;
                    }
                }
            }

            // If the line element itself has the line number attribute
            if (
                lineElement.hasAttribute("data-line-number") &&
                lineElement.getAttribute("data-line-number") ===
                    String(lineNumber)
            ) {
                console.log(
                    `AI Code Reviewer: Found line element for line ${lineNumber} (direct attribute)`
                );
                return lineElement;
            }
        }
    }

    console.log(
        `AI Code Reviewer: Could not find line element for line ${lineNumber}`
    );
    return null;
}

/**
 * Insert a review comment after a specific line
 */
function insertReviewComment(lineElement, message, severity) {
    // Create comment element
    const commentElement = document.createElement("tr");
    commentElement.className = `ai-code-reviewer-comment ai-severity-${
        severity || "info"
    }`;

    // Create comment content
    const commentContent = document.createElement("td");
    commentContent.className = "ai-code-reviewer-comment-content";
    commentContent.setAttribute("colspan", "3");
    commentContent.textContent = message;

    // Add icon based on severity
    const iconSpan = document.createElement("span");
    iconSpan.className = `ai-code-reviewer-icon ai-severity-${
        severity || "info"
    }-icon`;
    commentContent.prepend(iconSpan);

    // Add comment content to comment element
    commentElement.appendChild(commentContent);

    // Insert comment after the line
    lineElement.parentNode.insertBefore(
        commentElement,
        lineElement.nextSibling
    );
}

/**
 * Handle messages from the background script
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(
        "AI Code Reviewer: Received message from background script",
        request.type
    );

    if (request.type === "TOGGLE_REVIEW_PANEL") {
        console.log("AI Code Reviewer: Toggle review panel");

        // Find the review button
        const reviewButton = document.querySelector(".ai-code-reviewer-button");

        if (reviewButton) {
            // Simulate a click on the review button
            reviewButton.click();
            sendResponse({ success: true });
        } else {
            console.log("AI Code Reviewer: Review button not found");

            // Try to inject the UI
            injectReviewUI();
            sendResponse({ success: false, error: "Review button not found" });
        }
    }

    if (request.type === "INITIALIZE") {
        console.log("AI Code Reviewer: Initialize from background script");
        initialize();
        sendResponse({ success: true });
    }

    return true; // Required for async response
});

/**
 * Send a log message to the background script
 */
function logToBackground(message) {
    chrome.runtime.sendMessage({ type: "LOG", message });
}

// Initialize the extension
console.log("AI Code Reviewer: Content script loaded");
initialize();
