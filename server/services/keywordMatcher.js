
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const KEYWORD_FILE = path.join(
    __dirname,
    "../config/keywords.csv"
);

// Load official keywords dynamically from CSV
async function loadKeywords() {
    return new Promise((resolve, reject) => {
        const keywords = [];

        fs.createReadStream(KEYWORD_FILE)
            .pipe(csv())
            .on("data", (row) => {
                const keyword = row.keyword?.trim();

                if (keyword) {
                    keywords.push(keyword);
                }
            })
            .on("end", () => resolve(keywords))
            .on("error", reject);
    });
}

// Normalise text for consistent matching
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFKC")
        .replace(/[-‐‑‒–—]/g, " ")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// Generate simple keyword variants
function generateVariants(keyword) {
    const normalized = normalizeText(keyword);

    const variants = new Set([normalized]);

    // Handle common English plural forms
    const words = normalized.split(" ");
    const lastWord = words[words.length - 1];

    let plural;

    if (lastWord.endsWith("y")) {
        plural = lastWord.slice(0, -1) + "ies";
    } else if (lastWord.endsWith("ch") || lastWord.endsWith("sh")) {
        plural = lastWord + "es";
    } else if (lastWord.endsWith("s")) {
        plural = lastWord;
    } else {
        plural = lastWord + "s";
    }

    words[words.length - 1] = plural;
    variants.add(words.join(" "));

    return [...variants];
}

// Match keywords against extracted document text
async function matchKeywords(documentText) {
    if (typeof documentText !== "string" || !documentText.trim()) {
        throw new Error("Document text cannot be empty.");
    }

    const keywords = await loadKeywords();
    const normalizedDocument = normalizeText(documentText);

    const matches = [];
    let totalOccurrences = 0;

    for (const keyword of keywords) {
        const variants = generateVariants(keyword);
        const matchedVariants = [];
        let occurrences = 0;

        for (const variant of variants) {
            const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            const regex = new RegExp(
                `(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`,
                "gu"
            );

            const found = [...normalizedDocument.matchAll(regex)];

            if (found.length > 0) {
                matchedVariants.push(variant);
                occurrences += found.length;
            }
        }

        if (occurrences > 0) {
            matches.push({
                keyword,
                matchedVariants,
                occurrences
            });

            totalOccurrences += occurrences;
        }
    }

    return {
        uniqueMatchCount: matches.length,
        totalOccurrences,
        matchedKeywords: matches
    };
}

module.exports = {
    loadKeywords,
    normalizeText,
    matchKeywords
};
