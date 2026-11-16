
const { matchKeywords, loadKeywords } = require("./keywordMatcher");

async function test() {
    const keywords = await loadKeywords();

    console.log("Total keywords loaded:", keywords.length);

    const sampleText = `
        The contractor must provide HYDRAULIC TORQUE WRENCHES
        for flange management during plant shutdown.

        The torque wrench must be calibrated.
    `;

    const result = await matchKeywords(sampleText);

    console.log("\nKeyword matching results:");
    console.log(JSON.stringify(result, null, 2));
}

test().catch(console.error);
