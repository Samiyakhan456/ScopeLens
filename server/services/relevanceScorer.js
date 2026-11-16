function calculateRelevance(uniqueMatchCount) {
    let relevance;

    if (uniqueMatchCount === 0) {
        relevance = "No";
    } else if (uniqueMatchCount <= 2) {
        relevance = "Possible";
    } else {
        relevance = "Yes";
    }

    let verdict;

    if (uniqueMatchCount === 0) {
        verdict = "Not Related";
    } else if (uniqueMatchCount <= 2) {
        verdict = "Possibly Related";
    } else {
        verdict = "Related";
    }

    return {
        matchCount: uniqueMatchCount,
        relevance,
        verdict
    };
}

module.exports = calculateRelevance;