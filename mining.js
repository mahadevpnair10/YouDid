import { getAllSessions } from "./db.js";

/**
 * Convert sessions → transactions
 */
function getTransactions(sessions) {
    return sessions.map(s => s.domains);
}

/**
 * Count support of an itemset
 */
function getSupport(itemset, transactions) {
    let count = 0;

    for (const t of transactions) {
        if (itemset.every(i => t.includes(i))) {
            count++;
        }
    }

    return count / transactions.length;
}

/**
 * Generate combinations
 */
function generateCombinations(items, k) {
    const result = [];

    function backtrack(start, path) {
        if (path.length === k) {
            result.push([...path]);
            return;
        }

        for (let i = start; i < items.length; i++) {
            path.push(items[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }

    backtrack(0, []);
    return result;
}

/**
 * Get unique items
 */
function getUniqueItems(transactions) {
    const set = new Set();

    for (const t of transactions) {
        t.forEach(item => set.add(item));
    }

    return Array.from(set);
}

/**
 * Main Apriori
 */
export async function runApriori(minSupport = 0.2, maxSize = 3) {
    const sessions = await getAllSessions();

    if (!sessions.length) {
        console.log("No sessions available");
        return;
    }

    const transactions = getTransactions(sessions);

    const uniqueItems = getUniqueItems(transactions);

    const frequentItemsets = [];

    // Level-wise generation
    for (let k = 1; k <= maxSize; k++) {
        const candidates = generateCombinations(uniqueItems, k);

        for (const itemset of candidates) {
            const support = getSupport(itemset, transactions);

            if (support >= minSupport) {
                frequentItemsets.push({
                    items: itemset,
                    support
                });
            }
        }
    }

    console.log("Frequent Itemsets:", frequentItemsets);

    const rules = generateRules(frequentItemsets, transactions);

    console.log("Association Rules:", rules);

    return { frequentItemsets, rules };
}

/**
 * Generate association rules
 */
function generateRules(frequentItemsets, transactions) {
    const rules = [];

    for (const itemsetObj of frequentItemsets) {
        const items = itemsetObj.items;

        if (items.length < 2) continue;

        // Split into A → B
        for (let i = 0; i < items.length; i++) {
            const A = [items[i]];
            const B = items.filter((_, idx) => idx !== i);

            const supportAB = getSupport(items, transactions);
            const supportA = getSupport(A, transactions);

            const confidence = supportAB / supportA;

            rules.push({
                A,
                B,
                support: supportAB,
                confidence
            });
        }
    }

    return rules;
}