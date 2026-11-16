const fs = require("fs");
const extractPDF = require("./pdfExtractor");

async function test() {
    const filePath = "/Users/samiyakhan/Downloads/Fwd__Internship_Assignment_-_A/GeM-Bidding-9563430.pdf";

    const buffer = fs.readFileSync(filePath);
    const text = await extractPDF(buffer);

    console.log("Extracted text length:", text.length);
    console.log("\nFirst 3000 characters:\n");
    console.log(text.slice(0, 3000));
}

test().catch(console.error);