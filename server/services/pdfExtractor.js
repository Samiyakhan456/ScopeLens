
const pdfParse = require("pdf-parse");

/**
 * Extract text from a PDF document.
 * @param {Buffer} fileBuffer - PDF file contents
 * @returns {Promise<string>} Extracted text
 */
async function extractPDF(fileBuffer) {
    if (!Buffer.isBuffer(fileBuffer)) {
        throw new Error("Invalid PDF input. Expected a file buffer.");
    }

    if (fileBuffer.length === 0) {
        throw new Error("The uploaded PDF is empty.");
    }

    try {
        const data = await pdfParse(fileBuffer);

        const extractedText = data.text
            .replace(/\s+/g, " ")
            .trim();

        if (!extractedText) {
            throw new Error(
                "No readable text found. This PDF may be scanned or image-based."
            );
        }

        return extractedText;

    } catch (error) {
        throw new Error(`PDF extraction failed: ${error.message}`);
    }
}

module.exports = extractPDF;
