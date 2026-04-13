const KEY = "lastProcessedTimestamp";

export function getLastProcessed() {
    return new Promise((resolve) => {
        chrome.storage.local.get([KEY], (result) => {
            resolve(result[KEY] ?? 0); // ✅ safer than ||
        });
    });
}

export function setLastProcessed(timestamp) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [KEY]: timestamp }, () => {
            resolve();
        });
    });
}