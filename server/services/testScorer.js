const calculateRelevance = require("./relevanceScorer");

const testCases = [0, 1, 2, 3, 4, 5];

for (const count of testCases) {
    const result = calculateRelevance(count);

    console.log(
        `Matches: ${count} | Verdict: ${result.verdict} | Relevance: ${result.relevance}`
    );
}