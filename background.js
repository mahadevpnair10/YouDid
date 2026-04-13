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

chrome.alarms.create("sessionGen", {
    periodInMinutes: 0.083 // ~5 seconds
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "sessionGen") {
        console.log("ALARM FIRED: sessionGen");
        generateSessions();
    }
});


// Debug: run Apriori once
setTimeout(() => {
    runApriori(0.2, 3);
}, 10000);