
const extractPDF = require("../services/pdfExtractor");
const extractDOCX = require("../services/docxExtractor");

const { matchKeywords } = require("../services/keywordMatcher");
const findRelatedTerms = require("../services/relatedTermMatcher");

const calculateRelevance = require("../services/relevanceScorer");
const generateExcelReport = require("../services/excelGenerator");

async function processDocuments(files) {
    const results = [];

    for (const file of files) {
        let extractedText;

        const extension = file.originalname
            .split(".")
            .pop()
            .toLowerCase();

        if (extension === "pdf") {
            extractedText = await extractPDF(file.buffer);
        } else if (extension === "docx") {
            extractedText = await extractDOCX(file.buffer);
        } else {
            throw new Error(
                `Unsupported file format: ${file.originalname}`
            );
        }

        // Official keyword matching
        const matchingResult = await matchKeywords(extractedText);

        // Supplementary terminology matching
        const relatedTerms = findRelatedTerms(extractedText);

        // Official score remains unchanged
        const relevanceResult = calculateRelevance(
            matchingResult.uniqueMatchCount
        );

        results.push({
            documentName: file.originalname,
            matchedKeywords: matchingResult.matchedKeywords,
            matchCount: matchingResult.uniqueMatchCount,
            totalOccurrences: matchingResult.totalOccurrences,
            relatedTerms,
            relevance: relevanceResult.relevance,
            verdict: relevanceResult.verdict
        });
    }

    return results;
}

async function scanDocuments(req, res) {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one PDF or DOCX file."
            });
        }

        const results = await processDocuments(req.files);

        return res.status(200).json({
            success: true,
            message: "Documents scanned successfully.",
            totalDocuments: results.length,
            results
        });

    } catch (error) {
        console.error("Document scanning error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Document scanning failed."
        });
    }
}

async function exportScanReport(req, res) {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one PDF or DOCX file."
            });
        }

        const results = await processDocuments(req.files);
        const excelBuffer = await generateExcelReport(results);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="ScopeLens_Tender_Scan_Report.xlsx"'
        );

        return res.send(Buffer.from(excelBuffer));

    } catch (error) {
        console.error("Excel export error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Excel report generation failed."
        });
    }
}

module.exports = {
    scanDocuments,
    exportScanReport
};
