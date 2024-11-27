
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

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" || changeInfo.url) {
    updateIconBasedOnCurrentTab();
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  updateIconBasedOnCurrentTab();
});

chrome.windows.onFocusChanged.addListener(function (windowId) {
  
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    updateIconBasedOnCurrentTab();
  }
});


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

