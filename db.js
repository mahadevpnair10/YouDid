const DB_NAME = "HistoryDB";
const DB_VERSION = 1;

let db = null;
let dbReady = null;

export function initDB() {
    if (dbReady) return dbReady; // reuse existing promise

    dbReady = new Promise((resolve, reject) => {
        const request = indexedDB.open("HistoryDB", 1);

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            const visits = db.createObjectStore("visits", { keyPath: "id", autoIncrement: true });
            visits.createIndex("timestamp", "timestamp");
            visits.createIndex("domain", "domain");

            const sessions = db.createObjectStore("sessions", { keyPath: "id", autoIncrement: true });
            sessions.createIndex("sessionId", "sessionId");
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = () => reject(request.error);
    });

    return dbReady;
}


export async function ensureDB() {
    if (!db) {
        console.log('ok1');
        await initDB();
        console.log('ok2');
    }
}


export async function addVisit(visit) {
    await ensureDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("visits", "readwrite");
        const store = tx.objectStore("visits");

        const request = store.add(visit);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function addSession(session) {
    await ensureDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("sessions", "readwrite");
        const store = tx.objectStore("sessions");

        const request = store.add(session);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}


export async function getVisitsAfter(timestamp) {
    await ensureDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("visits", "readonly");
        const store = tx.objectStore("visits");
        const index = store.index("timestamp");

        const range = IDBKeyRange.lowerBound(timestamp, true);
        const results = [];

        index.openCursor(range).onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                resolve(results);
            }
        };

        tx.onerror = () => reject(tx.error);
    });
}


export async function getAllSessions() {
    await ensureDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("sessions", "readonly");
        const store = tx.objectStore("sessions");

        const results = [];

        store.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                resolve(results);
            }
        };

        tx.onerror = () => reject(tx.error);
    });
}
