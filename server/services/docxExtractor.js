
const mammoth = require("mammoth");

/**
 * Extract text from a DOCX document.
 * @param {Buffer} fileBuffer - DOCX file contents
 * @returns {Promise<string>} Extracted text
 */
async function extractDOCX(fileBuffer) {
    if (!Buffer.isBuffer(fileBuffer)) {
        throw new Error("Invalid DOCX input. Expected a file buffer.");
    }

    if (fileBuffer.length === 0) {
        throw new Error("The uploaded DOCX is empty.");
    }

    try {
        const result = await mammoth.extractRawText({
            buffer: fileBuffer
        });

        const extractedText = result.value
            .replace(/\s+/g, " ")
            .trim();

        if (!extractedText) {
            throw new Error("No readable text found in the DOCX.");
        }

        return extractedText;

    } catch (error) {
        throw new Error(`DOCX extraction failed: ${error.message}`);
    }
}

module.exports = extractDOCX;
