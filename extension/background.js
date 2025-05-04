/**
 * AI Code Reviewer for GitHub - Background Script
 *
 * This script runs in the background and handles:
 * 1. Extension initialization
 * 2. Communication with the content script
 * 3. Storage of user preferences
 * 4. Tab URL monitoring for GitHub PR pages
 */

// Default settings
const DEFAULT_SETTINGS = {
    apiEndpoint: "http://localhost:3000/review",
    reviewMode: "full",
    enableDarkMode: true,
    debugMode: true, // Enable debug mode by default for easier troubleshooting
};

// Initialize extension settings
chrome.runtime.onInstalled.addListener(() => {
    console.log("AI Code Reviewer: Extension installed/updated");

    // Set default settings
    chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
        console.log("AI Code Reviewer: Default settings initialized");
    });

    // Show welcome notification
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon48.png",
        title: "AI Code Reviewer Installed",
        message:
            "The AI Code Reviewer extension has been installed. Navigate to a GitHub PR page to use it.",
    });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("AI Code Reviewer: Received message", request.type);

    if (request.type === "GET_SETTINGS") {
        // Return settings to content script
        chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
            console.log(
                "AI Code Reviewer: Sending settings to content script",
                settings
            );
            sendResponse({ settings });
        });
        return true; // Required for async response
    }

    if (request.type === "SAVE_SETTINGS") {
        // Save new settings
        console.log("AI Code Reviewer: Saving settings", request.settings);
        chrome.storage.sync.set(request.settings, () => {
            sendResponse({ success: true });
        });
        return true; // Required for async response
    }

    if (request.type === "LOG") {
        // Log message from content script
        console.log("AI Code Reviewer (Content):", request.message);
        sendResponse({ success: true });
        return true;
    }

    if (request.type === "TEST_CONNECTION") {
        // Test connection from test page
        console.log("AI Code Reviewer: Test connection received");
        sendResponse({ success: true });
        return true;
    }
});

// Listen for browser action click (extension icon)
chrome.action.onClicked.addListener((tab) => {
    console.log("AI Code Reviewer: Extension icon clicked", tab.url);

    // Check if this is a GitHub PR page
    if (isGitHubPRPage(tab.url)) {
        console.log("AI Code Reviewer: GitHub PR page detected");

        // Send message to content script to toggle review panel
        chrome.tabs.sendMessage(
            tab.id,
            { type: "TOGGLE_REVIEW_PANEL" },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.log(
                        "AI Code Reviewer: Error sending message to content script",
                        chrome.runtime.lastError
                    );

                    // Content script might not be loaded yet, reload the page
                    chrome.tabs.reload(tab.id);
                } else {
                    console.log(
                        "AI Code Reviewer: Message sent to content script",
                        response
                    );
                }
            }
        );
    } else {
        console.log("AI Code Reviewer: Not a GitHub PR page");

        // Show notification that this is only for GitHub PR pages
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon48.png",
            title: "AI Code Reviewer",
            message: "This extension only works on GitHub Pull Request pages.",
        });
    }
});

// Monitor tab updates to inject content script when navigating to GitHub PR pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Only run when the page is fully loaded
    if (changeInfo.status === "complete" && tab.url) {
        console.log("AI Code Reviewer: Tab updated", tab.url);

        // Check if this is a GitHub PR page
        if (isGitHubPRPage(tab.url)) {
            console.log(
                "AI Code Reviewer: GitHub PR page detected on tab update"
            );

            // Send a message to the content script to initialize
            chrome.tabs.sendMessage(
                tabId,
                { type: "INITIALIZE" },
                (response) => {
                    // If there's an error, the content script might not be loaded yet
                    if (chrome.runtime.lastError) {
                        console.log(
                            "AI Code Reviewer: Content script not loaded yet"
                        );
                    } else {
                        console.log(
                            "AI Code Reviewer: Content script initialized",
                            response
                        );
                    }
                }
            );
        }
    }
});

/**
 * Check if a URL is a GitHub PR page
 */
function isGitHubPRPage(url) {
    // Match GitHub PR URLs
    // Examples:
    // - https://github.com/owner/repo/pull/123
    // - https://github.com/owner/repo/pull/123/files
    // - https://github.com/owner/repo/pull/123/commits
    return Boolean(url.match(/github\.com\/.*\/.*\/pull\/\d+/));
}
