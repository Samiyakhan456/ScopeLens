
const fs = require("fs");
const path = require("path");

const TERMS_FILE = path.join(
    __dirname,
    "../config/relatedTerms.json"
);

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFKC")
        .replace(/[-‐‑‒–—]/g, " ")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findRelatedTerms(documentText) {
    if (typeof documentText !== "string" || !documentText.trim()) {
        return [];
    }

    const config = JSON.parse(
        fs.readFileSync(TERMS_FILE, "utf8")
    );

    const normalizedDocument = normalizeText(documentText);
    const results = [];

    for (const category of config.categories) {
        const matchedTerms = [];

        for (const term of category.terms) {
            const normalizedTerm = normalizeText(term);
            const regex = new RegExp(
                `(?<![\\p{L}\\p{N}])${escapeRegex(normalizedTerm)}(?![\\p{L}\\p{N}])`,
                "gu"
            );

            const matches = [...normalizedDocument.matchAll(regex)];

            if (matches.length > 0) {
                matchedTerms.push({
                    term,
                    occurrences: matches.length
                });
            }
        }

        if (matchedTerms.length > 0) {
            results.push({
                category: category.name,
                matchedTerms
            });
        }
    }

    return results;
}

module.exports = findRelatedTerms;
