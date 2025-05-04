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

    // Add a message to help users understand what's happening
    const messageElement = document.createElement("div");
    messageElement.className = "ai-code-reviewer-message";
    messageElement.textContent =
        "AI Code Reviewer is ready. Click the button above to analyze this PR.";
    messageElement.style.margin = "8px 0";
    messageElement.style.padding = "8px 16px";
    messageElement.style.backgroundColor = "#f0f8ff";
    messageElement.style.borderLeft = "3px solid #0366d6";
    messageElement.style.borderRadius = "3px";
    messageElement.style.fontSize = "14px";
    messageElement.style.color = "#24292e";

    // Try to insert the message after the PR header
    try {
        const prDescription = document.querySelector(
            ".js-comment-container, .js-discussion, .discussion-timeline"
        );
        if (prDescription) {
            prDescription.insertBefore(
                messageElement,
                prDescription.firstChild
            );
        } else {
            // If we can't find a good place, add it after the PR header
            prHeader.parentNode.insertBefore(
                messageElement,
                prHeader.nextSibling
            );
        }
    } catch (error) {
        console.error("AI Code Reviewer: Error adding message element:", error);
    }

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

    // Create a status message element
    const statusElement = document.createElement("div");
    statusElement.className = "ai-code-reviewer-status";
    statusElement.style.position = "fixed";
    statusElement.style.bottom = "20px";
    statusElement.style.right = "20px";
    statusElement.style.padding = "10px 20px";
    statusElement.style.backgroundColor = "#0366d6";
    statusElement.style.color = "white";
    statusElement.style.borderRadius = "5px";
    statusElement.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    statusElement.style.zIndex = "1000";
    statusElement.style.fontSize = "14px";
    statusElement.textContent = "AI Code Reviewer: Analyzing code changes...";
    document.body.appendChild(statusElement);

    try {
        // Update status
        statusElement.textContent = "AI Code Reviewer: Parsing diff content...";

        // Parse the diff content
        const diffData = parseDiffContent();

        if (diffData.length === 0) {
            statusElement.style.backgroundColor = "#d73a49";
            statusElement.textContent =
                "AI Code Reviewer: No code changes found to review.";

            setTimeout(() => {
                document.body.removeChild(statusElement);
                alert(
                    "No code changes found to review. Please make sure you're on the 'Files changed' tab and that the PR contains code changes."
                );
            }, 3000);

            isReviewInProgress = false;
            updateReviewButtonState(false);
            return;
        }

        // Update status with file count
        statusElement.textContent = `AI Code Reviewer: Analyzing ${diffData.length} files...`;

        // Log the diff data for debugging
        console.log(
            "AI Code Reviewer: Diff data to send to backend:",
            diffData
        );

        // Send diff data to backend
        statusElement.textContent =
            "AI Code Reviewer: Sending to AI for analysis...";
        const reviewResults = await sendDiffToBackend(diffData);

        // Log the review results for debugging
        console.log(
            "AI Code Reviewer: Review results from backend:",
            reviewResults
        );

        // Display review comments
        statusElement.textContent =
            "AI Code Reviewer: Displaying review comments...";
        displayReviewComments(reviewResults);

        // Update status on completion
        statusElement.style.backgroundColor = "#2ea44f";
        statusElement.textContent =
            "AI Code Reviewer: Review completed successfully!";

        // Remove the status element after a delay
        setTimeout(() => {
            try {
                document.body.removeChild(statusElement);
            } catch (e) {
                console.error(
                    "AI Code Reviewer: Error removing status element:",
                    e
                );
            }
        }, 3000);
    } catch (error) {
        console.error("AI Code Reviewer: Error during review:", error);

        statusElement.style.backgroundColor = "#d73a49";
        statusElement.textContent = `AI Code Reviewer: Error - ${error.message}`;

        setTimeout(() => {
            try {
                document.body.removeChild(statusElement);
                alert(
                    `Error during review: ${error.message}\n\nPlease check the console for more details.`
                );
            } catch (e) {
                console.error(
                    "AI Code Reviewer: Error removing status element:",
                    e
                );
            }
        }, 5000);
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
        ".js-file-content", // File content container
        ".diff-view", // Diff view container
        ".js-diff-table", // Diff table
        ".diff-table", // Another diff table variant
        "[id^='diff-']", // Elements with IDs starting with 'diff-'
        ".js-diff-progressive-container", // Progressive diff container
        ".js-diff-progressive-container .js-file", // Files within progressive container
    ];

    let fileElements = [];

    // Log all potential file elements for debugging
    console.log("AI Code Reviewer: Checking for potential file elements");
    for (const selector of fileElementSelectors) {
        const elements = document.querySelectorAll(selector);
        console.log(
            `AI Code Reviewer: Selector "${selector}" found ${elements.length} elements`
        );
    }

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

    // If no file elements found with standard selectors, try a more aggressive approach
    if (fileElements.length === 0) {
        console.log(
            "AI Code Reviewer: No file elements found with standard selectors, trying alternative approach"
        );

        // Look for file headers which often indicate file changes
        const fileHeaders = document.querySelectorAll(
            ".file-header, .js-file-header, [data-path], .js-file-header-path"
        );
        console.log(
            `AI Code Reviewer: Found ${fileHeaders.length} file headers`
        );

        if (fileHeaders.length > 0) {
            // Use the parent elements of file headers as file elements
            fileElements = Array.from(fileHeaders).map((header) =>
                header.closest(
                    ".file, .js-file, [data-file-type], .js-details-container"
                )
            );
            fileElements = fileElements.filter((el) => el !== null);
            console.log(
                `AI Code Reviewer: Found ${fileElements.length} file elements from headers`
            );
        }
    }

    // If still no file elements, try to find diff tables directly
    if (fileElements.length === 0) {
        console.log(
            "AI Code Reviewer: No file elements found from headers, trying to find diff tables directly"
        );

        const diffTables = document.querySelectorAll(
            ".diff-table, table.js-file-line-container"
        );
        console.log(`AI Code Reviewer: Found ${diffTables.length} diff tables`);

        if (diffTables.length > 0) {
            fileElements = Array.from(diffTables);
        }
    }

    if (fileElements.length === 0) {
        console.log(
            "AI Code Reviewer: No file elements found after all attempts"
        );

        // Last resort: check if we're on the files changed tab
        const filesChangedTab = document.querySelector(
            '[data-tab-item="files"]'
        );
        if (
            !filesChangedTab ||
            !filesChangedTab.classList.contains("selected")
        ) {
            console.log(
                "AI Code Reviewer: Not on the Files Changed tab. Please navigate to the Files Changed tab."
            );
            alert(
                "Please navigate to the 'Files changed' tab to use the AI Code Reviewer."
            );
        }

        return diffFiles;
    }

    fileElements.forEach((fileElement) => {
        // Try different selectors for file path elements
        const filePathSelectors = [
            ".file-header .file-info a",
            ".js-file-header .file-info a",
            "[data-path]",
            ".js-file-header-path",
            ".file-info a",
            ".js-file-header a",
            "a[title]", // Sometimes file paths are in title attributes
            "[data-file-type]", // Sometimes the file type element has the path
        ];

        let filePathElement = null;
        let filePath = null;

        // Try each selector until we find a file path element
        for (const selector of filePathSelectors) {
            const elements = fileElement.querySelectorAll(selector);
            for (const element of elements) {
                // Check if this element contains a file path
                const text = element.textContent.trim();
                const path =
                    element.getAttribute("data-path") ||
                    element.getAttribute("title") ||
                    "";

                if (text && (text.includes(".") || text.includes("/"))) {
                    filePathElement = element;
                    filePath = text;
                    break;
                } else if (path && (path.includes(".") || path.includes("/"))) {
                    filePathElement = element;
                    filePath = path;
                    break;
                }
            }

            if (filePathElement && filePath) {
                break;
            }
        }

        // If we still don't have a file path, try to find it in any element with a file path pattern
        if (!filePathElement || !filePath) {
            console.log(
                "AI Code Reviewer: No file path element found with standard selectors, trying text search"
            );

            // Look for elements that might contain file paths
            const allElements = fileElement.querySelectorAll("*");
            for (const element of allElements) {
                const text = element.textContent.trim();
                // Look for text that looks like a file path (contains extension or slashes)
                if (text && (text.includes(".") || text.includes("/"))) {
                    // Exclude common non-file-path elements
                    if (
                        !element.classList.contains("octicon") &&
                        !element.classList.contains("js-comment-body") &&
                        element.tagName !== "BUTTON" &&
                        element.tagName !== "svg"
                    ) {
                        filePathElement = element;
                        filePath = text;
                        console.log(
                            `AI Code Reviewer: Found potential file path by text search: ${filePath}`
                        );
                        break;
                    }
                }
            }
        }

        if (!filePath) {
            console.log(
                "AI Code Reviewer: Could not determine file path, using placeholder"
            );
            filePath = `unknown-file-${Math.floor(Math.random() * 1000)}`;
        }

        console.log(`AI Code Reviewer: Processing file: ${filePath}`);

        // Try different selectors for diff chunks
        const diffChunkSelectors = [
            ".js-file-content .js-file-line-container tr.js-expandable-line",
            ".js-file-content tr.js-expandable-line",
            ".js-file-content tr.blob-expanded",
            ".js-file-line-container tr",
            ".diff-table tr",
            "table tr", // Any table row in the file element
            "tr", // Any row
            ".blob-code", // Code blocks
            "[data-line-number]", // Elements with line numbers
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

        // If we still don't have diff chunks, try to find any elements that might contain code
        if (diffHunks.length === 0) {
            console.log(
                `AI Code Reviewer: No diff chunks found with standard selectors, trying code content search`
            );

            // Look for elements that might contain code
            const codeElements = fileElement.querySelectorAll(
                "pre, code, .blob-code, .js-file-line"
            );
            if (codeElements.length > 0) {
                console.log(
                    `AI Code Reviewer: Found ${codeElements.length} potential code elements`
                );
                diffHunks = codeElements;
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
                "td:not(.blob-num)", // Any non-line-number cell
                "td", // Any table cell
                "span.code", // Code spans
                "code", // Code elements
            ];

            let lineElements = [];

            // Try each selector until we find line elements
            for (const selector of lineElementSelectors) {
                lineElements = hunk.querySelectorAll(selector);
                if (lineElements.length >= 1) {
                    break;
                }
            }

            // If no line elements found, try to use the hunk itself if it contains code
            if (lineElements.length === 0 && hunk.textContent.trim()) {
                lineElements = [hunk];
            }

            if (lineElements.length === 0) {
                return;
            }

            // Get line numbers
            let oldLineNumber = null;
            let newLineNumber = null;

            // Try to get line numbers from data attributes on the hunk or its parents
            if (hunk.hasAttribute("data-line-number")) {
                newLineNumber = hunk.getAttribute("data-line-number");
            } else if (
                hunk.parentElement &&
                hunk.parentElement.hasAttribute("data-line-number")
            ) {
                newLineNumber =
                    hunk.parentElement.getAttribute("data-line-number");
            }

            // Try to get line numbers from data attributes on line elements
            if (
                !newLineNumber &&
                lineElements[0].hasAttribute("data-line-number")
            ) {
                newLineNumber =
                    lineElements[0].getAttribute("data-line-number");
            }

            // If line numbers are not available from data attributes, try to find them in other elements
            if (!newLineNumber) {
                const lineNumberElements = hunk.querySelectorAll(
                    ".blob-num, .line-num, [data-line-number]"
                );
                if (lineNumberElements.length >= 1) {
                    newLineNumber =
                        lineNumberElements[0].getAttribute(
                            "data-line-number"
                        ) || lineNumberElements[0].textContent.trim();
                }
            }

            // If we still don't have a line number, try to extract it from the text content
            if (!newLineNumber) {
                // Look for patterns like "L123" or "line 123" in the hunk or its parent
                const lineNumberMatch =
                    hunk.textContent.match(/L(\d+)/) ||
                    hunk.textContent.match(/line\s+(\d+)/i) ||
                    hunk.textContent.match(/\b(\d+)\b/);
                if (lineNumberMatch) {
                    newLineNumber = lineNumberMatch[1];
                }
            }

            // If we still don't have a line number, generate a sequential one
            if (!newLineNumber) {
                newLineNumber = diffChunks.length + 1;
            }

            // Use the same line number for old and new if we only have one
            oldLineNumber = oldLineNumber || newLineNumber;

            // Get code content
            let codeContent = "";

            // Try to get code content from the line element
            if (lineElements.length >= 1) {
                codeContent = lineElements[0].textContent.trim();
            }

            // If no code content, try to get it from the hunk itself
            if (!codeContent && hunk.textContent) {
                codeContent = hunk.textContent.trim();
            }

            // Check if this is an addition, deletion, or context line
            let lineType = "context";
            if (hunk.classList) {
                if (
                    hunk.classList.contains("addition") ||
                    hunk.classList.contains("blob-addition") ||
                    hunk.classList.contains("ins")
                ) {
                    lineType = "addition";
                    codeContent = "+ " + codeContent;
                } else if (
                    hunk.classList.contains("deletion") ||
                    hunk.classList.contains("blob-deletion") ||
                    hunk.classList.contains("del")
                ) {
                    lineType = "deletion";
                    codeContent = "- " + codeContent;
                }
            }

            // Add the diff chunk
            diffChunks.push({
                oldLineNumber,
                newLineNumber,
                codeContent,
                lineType,
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
        alert(
            "Error: Invalid review results received from the backend. Please check the console for details."
        );
        return;
    }

    // Clear any existing review comments
    clearExistingReviewComments();

    console.log(
        `AI Code Reviewer: Processing ${reviewResults.suggestions.length} suggestions`
    );

    // Create a summary element
    const summaryElement = document.createElement("div");
    summaryElement.className = "ai-code-reviewer-summary";
    summaryElement.style.position = "fixed";
    summaryElement.style.top = "20px";
    summaryElement.style.right = "20px";
    summaryElement.style.padding = "15px";
    summaryElement.style.backgroundColor = "#f6f8fa";
    summaryElement.style.border = "1px solid #e1e4e8";
    summaryElement.style.borderRadius = "6px";
    summaryElement.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    summaryElement.style.zIndex = "1000";
    summaryElement.style.maxWidth = "300px";
    summaryElement.style.maxHeight = "400px";
    summaryElement.style.overflow = "auto";

    // Add a title to the summary
    const summaryTitle = document.createElement("h3");
    summaryTitle.textContent = "AI Code Review Summary";
    summaryTitle.style.margin = "0 0 10px 0";
    summaryTitle.style.fontSize = "16px";
    summaryTitle.style.borderBottom = "1px solid #e1e4e8";
    summaryTitle.style.paddingBottom = "5px";
    summaryElement.appendChild(summaryTitle);

    // Add a close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.background = "none";
    closeButton.style.border = "none";
    closeButton.style.fontSize = "18px";
    closeButton.style.cursor = "pointer";
    closeButton.style.color = "#586069";
    closeButton.addEventListener("click", () => {
        document.body.removeChild(summaryElement);
    });
    summaryElement.appendChild(closeButton);

    // Count issues by severity
    const severityCounts = {
        error: 0,
        warning: 0,
        info: 0,
        security: 0,
    };

    // Process each suggestion
    let successCount = 0;
    let failureCount = 0;

    reviewResults.suggestions.forEach((suggestion) => {
        const { filePath, lineNumber, message, severity } = suggestion;

        // Update severity counts
        const normalizedSeverity = severity || "info";
        severityCounts[normalizedSeverity] =
            (severityCounts[normalizedSeverity] || 0) + 1;

        // Find the corresponding line in the diff
        const lineElement = findLineElement(filePath, lineNumber);
        if (!lineElement) {
            console.warn(
                `AI Code Reviewer: Could not find line ${lineNumber} in file ${filePath}`
            );
            failureCount++;
            return;
        }

        // Create and insert comment
        insertReviewComment(lineElement, message, severity);
        successCount++;
    });

    // Add severity counts to summary
    const countsList = document.createElement("ul");
    countsList.style.listStyle = "none";
    countsList.style.padding = "0";
    countsList.style.margin = "0 0 15px 0";

    Object.entries(severityCounts).forEach(([severity, count]) => {
        if (count > 0) {
            const listItem = document.createElement("li");
            listItem.style.margin = "5px 0";
            listItem.style.display = "flex";
            listItem.style.alignItems = "center";

            const icon = document.createElement("span");
            icon.textContent =
                severity === "error"
                    ? "❌ "
                    : severity === "warning"
                    ? "⚠️ "
                    : severity === "security"
                    ? "🔒 "
                    : "ℹ️ ";
            icon.style.marginRight = "8px";

            const text = document.createElement("span");
            text.textContent = `${count} ${severity} ${
                count === 1 ? "issue" : "issues"
            }`;

            listItem.appendChild(icon);
            listItem.appendChild(text);
            countsList.appendChild(listItem);
        }
    });

    summaryElement.appendChild(countsList);

    // Add success rate
    const successRate = document.createElement("p");
    successRate.textContent = `Successfully placed ${successCount} of ${reviewResults.suggestions.length} comments`;
    successRate.style.margin = "0";
    successRate.style.fontSize = "14px";
    summaryElement.appendChild(successRate);

    // Add the summary to the page
    document.body.appendChild(summaryElement);

    // Auto-hide the summary after 30 seconds
    setTimeout(() => {
        try {
            if (document.body.contains(summaryElement)) {
                document.body.removeChild(summaryElement);
            }
        } catch (e) {
            console.error(
                "AI Code Reviewer: Error removing summary element:",
                e
            );
        }
    }, 30000);

    console.log(
        `AI Code Reviewer: Review comments displayed (${successCount} successful, ${failureCount} failed)`
    );
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
        ".js-file-content", // File content container
        ".diff-view", // Diff view container
        ".js-diff-table", // Diff table
        ".diff-table", // Another diff table variant
        "[id^='diff-']", // Elements with IDs starting with 'diff-'
        ".js-diff-progressive-container", // Progressive diff container
        ".js-diff-progressive-container .js-file", // Files within progressive container
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
            `AI Code Reviewer: Could not find file element for ${filePath} with standard selectors, trying alternative approach`
        );

        // Look for file headers which often indicate file changes
        const fileHeaders = document.querySelectorAll(
            ".file-header, .js-file-header, [data-path], .js-file-header-path"
        );

        for (const header of fileHeaders) {
            // Check if this header contains the file path we're looking for
            let headerText = header.textContent.trim();
            let headerPath = header.getAttribute("data-path") || "";

            if (
                headerText.includes(filePath) ||
                headerPath.includes(filePath)
            ) {
                targetFileElement = header.closest(
                    ".file, .js-file, [data-file-type], .js-details-container"
                );
                if (targetFileElement) {
                    console.log(
                        `AI Code Reviewer: Found file element for ${filePath} from header`
                    );
                    break;
                }
            }
        }

        if (!targetFileElement) {
            console.log(
                `AI Code Reviewer: Could not find file element for ${filePath} after all attempts`
            );
            return null;
        }
    }

    // Try different selectors for line elements
    const lineElementSelectors = [
        ".js-file-line",
        "tr.blob-expanded",
        "tr[data-line-number]",
        ".diff-table tr",
        "tr.js-expandable-line",
        "tr.line-data",
        "tr.js-file-line",
        ".js-file-content tr",
        ".js-file-line-container tr",
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
        `AI Code Reviewer: Could not find line element for line ${lineNumber} with standard selectors, trying alternative approach`
    );

    // Try a more aggressive approach - look for any element that might contain the line number
    const allElements = targetFileElement.querySelectorAll("*");
    for (const element of allElements) {
        // Check if the element or any of its children contains the line number
        if (element.textContent.includes(lineNumber)) {
            // Check if this is a table row or can be used as a line element
            if (
                element.tagName === "TR" ||
                element.classList.contains("line") ||
                element.classList.contains("js-file-line") ||
                element.classList.contains("blob-code")
            ) {
                console.log(
                    `AI Code Reviewer: Found potential line element for line ${lineNumber} by text content`
                );
                return element;
            }

            // If not a suitable element itself, check if it has a parent that is
            const parentRow = element.closest("tr");
            if (parentRow) {
                console.log(
                    `AI Code Reviewer: Found potential line element for line ${lineNumber} via parent`
                );
                return parentRow;
            }
        }
    }

    console.log(
        `AI Code Reviewer: Could not find line element for line ${lineNumber} after all attempts`
    );

    // Last resort: just return the first line element we can find
    const anyLineElement = targetFileElement.querySelector("tr");
    if (anyLineElement) {
        console.log(
            `AI Code Reviewer: Using first available line element as fallback for line ${lineNumber}`
        );
        return anyLineElement;
    }

    return null;
}

/**
 * Insert a review comment after a specific line
 */
function insertReviewComment(lineElement, message, severity) {
    console.log(
        `AI Code Reviewer: Inserting comment with severity ${severity}`
    );

    try {
        // Create comment element
        const commentElement = document.createElement("tr");
        commentElement.className = `ai-code-reviewer-comment ai-severity-${
            severity || "info"
        }`;

        // Add inline styles to ensure visibility
        commentElement.style.backgroundColor =
            severity === "error"
                ? "#ffebe9"
                : severity === "warning"
                ? "#fff8c5"
                : severity === "security"
                ? "#ffebe9"
                : "#f0f8ff";
        commentElement.style.borderLeft = `3px solid ${
            severity === "error"
                ? "#d73a49"
                : severity === "warning"
                ? "#f9c513"
                : severity === "security"
                ? "#b08800"
                : "#0366d6"
        }`;
        commentElement.style.padding = "8px 16px";
        commentElement.style.margin = "4px 0";
        commentElement.style.fontSize = "14px";
        commentElement.style.lineHeight = "1.5";
        commentElement.style.position = "relative";
        commentElement.style.zIndex = "100";

        // Create comment content
        const commentContent = document.createElement("td");
        commentContent.className = "ai-code-reviewer-comment-content";
        commentContent.setAttribute("colspan", "3");
        commentContent.textContent = message;
        commentContent.style.padding = "8px 16px";
        commentContent.style.color = "#24292e";

        // Add icon based on severity
        const iconSpan = document.createElement("span");
        iconSpan.className = `ai-code-reviewer-icon ai-severity-${
            severity || "info"
        }-icon`;
        iconSpan.textContent =
            severity === "error"
                ? "❌ "
                : severity === "warning"
                ? "⚠️ "
                : severity === "security"
                ? "🔒 "
                : "ℹ️ ";
        iconSpan.style.marginRight = "8px";
        iconSpan.style.display = "inline-block";
        iconSpan.style.verticalAlign = "middle";
        commentContent.prepend(iconSpan);

        // Add comment content to comment element
        commentElement.appendChild(commentContent);

        // Insert comment after the line
        if (lineElement.parentNode) {
            lineElement.parentNode.insertBefore(
                commentElement,
                lineElement.nextSibling
            );
            console.log("AI Code Reviewer: Comment inserted successfully");
        } else {
            console.error("AI Code Reviewer: Line element has no parent node");

            // Try to find a suitable parent element
            const diffTable = document.querySelector(
                ".diff-table, .js-file-line-container"
            );
            if (diffTable) {
                diffTable.appendChild(commentElement);
                console.log(
                    "AI Code Reviewer: Comment appended to diff table as fallback"
                );
            } else {
                console.error(
                    "AI Code Reviewer: Could not find a suitable parent element for comment"
                );
            }
        }
    } catch (error) {
        console.error("AI Code Reviewer: Error inserting comment:", error);
    }
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
