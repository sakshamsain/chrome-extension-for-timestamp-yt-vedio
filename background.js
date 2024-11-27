// background.js

// Function to update the action icon based on the current tab's URL
function updateIconBasedOnCurrentTab() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    if (tabs.length === 0) {
      // No active tabs, set icon to grey
      chrome.action.setIcon({
        path: {
          "48": "icons/icon_grey-48.png",
          "128": "icons/icon_grey.png",
        },
      });
      return;
    }
    const tab = tabs[0];
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      // Set the colorful icon when on a YouTube video page
      chrome.action.setIcon({
        path: {
          "48": "icons/icon-48.png",
          "128": "icons/icon.png",
        },
        tabId: tab.id,
      });
    } else {
      // Set the grey icon
      chrome.action.setIcon({
        path: {
          "48": "icons/icon_grey-48.png",
          "128": "icons/icon_grey.png",
        },
        tabId: tab.id,
      });
    }
  });
}

// Update the icon when a tab is updated (navigates to a new URL)
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" || changeInfo.url) {
    updateIconBasedOnCurrentTab();
  }
});

// Update the icon when the active tab changes
chrome.tabs.onActivated.addListener(function (activeInfo) {
  updateIconBasedOnCurrentTab();
});

// Update the icon when the window focus changes
chrome.windows.onFocusChanged.addListener(function (windowId) {
  // Ignore -1 (when all Chrome windows are minimized)
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    updateIconBasedOnCurrentTab();
  }
});

// Update the icon when the extension is first installed
chrome.runtime.onInstalled.addListener(function () {
  updateIconBasedOnCurrentTab();
});

// Update the icon when the browser starts up
chrome.runtime.onStartup.addListener(function () {
  updateIconBasedOnCurrentTab();
});

// Handle the action button click
chrome.action.onClicked.addListener((tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    console.log("Sending showQRCodeOverlay message.");
    chrome.tabs.sendMessage(tab.id, { action: "showQRCodeOverlay" });
  } else {
    console.log("Not a YouTube video page.");
  }
});

