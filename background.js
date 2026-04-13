import { initDB, addVisit } from "./db.js";
import { generateSessions } from "./session.js";
import { runApriori } from "./mining.js";


function extractDomain(url) {
    try {
        return new URL(url).hostname;
    } catch {
        return "unknown";
    }
}



// Initialize (optional but safe)
initDB();

// Capture visits
chrome.history.onVisited.addListener(async (item) => {
    const visit = {
        domain: extractDomain(item.url),
        timestamp: item.lastVisitTime
    };

    await addVisit(visit); // ensureDB handles safety
});

// Periodic session generation
setInterval(() => {
    generateSessions();
}, 5 * 60 * 1000);

// Debug: run Apriori once
setTimeout(() => {
    runApriori(0.2, 3);
}, 10000);