import { getVisitsAfter, addSession } from "./db.js";
import { getLastProcessed, setLastProcessed } from "./state.js";

const SESSION_GAP = 5 * 60 * 1000;

function generateSessionId() {
    return "s_" + Date.now() + "_" + Math.random().toString(36).slice(2);
}

function buildSessionsFromVisits(visits) {
    if (!visits.length) return [];

    visits.sort((a, b) => a.timestamp - b.timestamp);

    const sessions = [];
    let currentSession = [visits[0]];

    for (let i = 1; i < visits.length; i++) {
        const prev = visits[i - 1];
        const curr = visits[i];

        if (curr.timestamp - prev.timestamp > SESSION_GAP) {
            sessions.push(currentSession);
            currentSession = [];
        }

        currentSession.push(curr);
    }

    if (currentSession.length) {
        sessions.push(currentSession);
    }

    console.log(currentSession);

    return sessions;
}

function convertToTransaction(sessionVisits) {
    const uniqueDomains = [...new Set(sessionVisits.map(v => v.domain))];

    return {
        sessionId: generateSessionId(),
        domains: uniqueDomains,
        startTime: sessionVisits[0].timestamp,
        endTime: sessionVisits[sessionVisits.length - 1].timestamp
    };
}

export async function generateSessions() {
    try {
        console.log("SESSION GENERATION TRIGGERED");
        const lastProcessed = await getLastProcessed();

        // ✅ IMPORTANT FIX: overlap to avoid session splitting
        const visits = await getVisitsAfter(lastProcessed - SESSION_GAP);

        console.log("LAST PROCESSED:", lastProcessed);
        console.log("VISITS FETCHED:", visits);


        if (!visits.length) return;

        const grouped = buildSessionsFromVisits(visits);

        for (const session of grouped) {
            const transaction = convertToTransaction(session);

            if (transaction.domains.length < 2) continue;

            await addSession(transaction);
        }

        // ✅ FIX: correct timestamp calculation
        const latestTimestamp = Math.max(...visits.map(v => v.timestamp));
        await setLastProcessed(latestTimestamp);

        console.log("Sessions generated:", grouped.length);

    } catch (err) {
        console.error("Session generation failed:", err);
    }
}