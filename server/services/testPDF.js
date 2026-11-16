const fs = require("fs");
const extractPDF = require("./pdfExtractor");

async function test() {
    const filePath = process.argv[2];

    if (!filePath) {
        console.error("Usage: node services/testPDF.js <path-to-pdf>");
        process.exit(1);
    }

    const buffer = fs.readFileSync(filePath);
    const text = await extractPDF(buffer);

    console.log("Extracted text length:", text.length);
    console.log("\nFirst 3000 characters:\n");
    console.log(text.slice(0, 3000));
}

test().catch(console.error);