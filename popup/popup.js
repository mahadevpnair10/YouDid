import { runApriori } from "../mining.js";

const runBtn = document.getElementById("runBtn");
const itemsetsDiv = document.getElementById("itemsets");
const rulesDiv = document.getElementById("rules");

runBtn.addEventListener("click", async () => {
    itemsetsDiv.innerHTML = "Loading...";
    rulesDiv.innerHTML = "";

    const minSupport = parseFloat(document.getElementById("minSupport").value);

    const result = await runApriori(minSupport, 3);

    if (!result) {
        itemsetsDiv.innerHTML = "No data available yet.";
        rulesDiv.innerHTML = "";
        return;
    }

    displayItemsets(result.frequentItemsets);
    displayRules(result.rules);
});

function displayItemsets(itemsets) {
    itemsetsDiv.innerHTML = "";

    itemsets.forEach(i => {
        const div = document.createElement("div");
        div.className = "item";

        div.textContent = `{ ${i.items.join(", ")} } → support: ${i.support.toFixed(2)}`;

        itemsetsDiv.appendChild(div);
    });
}

function displayRules(rules) {
    rulesDiv.innerHTML = "";

    rules.forEach(r => {
        const div = document.createElement("div");
        div.className = "item";

        div.textContent =
            `{ ${r.A.join(", ")} } → { ${r.B.join(", ")} } | conf: ${r.confidence.toFixed(2)}`;

        rulesDiv.appendChild(div);
    });
}