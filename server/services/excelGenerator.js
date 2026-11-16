
const ExcelJS = require("exceljs");

const COLORS = {
    navy: "FFA5BCD6",
    white: "FFFFFFFF",
    black: "FF252525",
    grey: "FFF2F4F7",
    border: "FFD9DEE7",
    green: "FFE8F1E9",
    greenText: "FF347044",
    amber: "FFFFF2D9",
    amberText: "FF966515",
    red: "FFF8EAEA",
    redText: "FFA33A3A",
    muted: "FF777777"
};

function estimateWrappedLines(text, columnWidth) {
    if (!text) return 1;

    return text.split("\n").reduce((total, line) => {
        return total + Math.max(
            1,
            Math.ceil(line.length / columnWidth)
        );
    }, 0);
}

async function generateExcelReport(results) {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "ScopeLens";
    workbook.title = "Tritorc Tender Relevance Report";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Tender Analysis", {
        views: [{ state: "frozen", ySplit: 4 }]
    });

    worksheet.columns = [
        { key: "documentName", width: 34 },
        { key: "matchedKeywords", width: 42 },
        { key: "matchCount", width: 15 },
        { key: "relevance", width: 24 },
        { key: "relatedTerminology", width: 48 }
    ];

    // Report title
    worksheet.mergeCells("A1:E1");

    const title = worksheet.getCell("A1");
    title.value = "ScopeLens | Tender Analysis Report";
    title.font = {
        name: "Arial",
        size: 17,
        bold: true,
        color: COLORS.navy
    };
    title.alignment = {
        vertical: "middle",
        horizontal: "left"
    };

    worksheet.getRow(1).height = 34;

    // Subtitle and timestamp
    worksheet.mergeCells("A2:E2");

    const subtitle = worksheet.getCell("A2");
    subtitle.value = "TRITORC RELEVANCE CHECKER";
    subtitle.font = {
        name: "Arial",
        size: 9,
        bold: true,
        color: COLORS.muted
    };

    worksheet.getRow(2).height = 20;

    worksheet.mergeCells("A3:E3");

    const timestamp = worksheet.getCell("A3");
    timestamp.value = `Report generated: ${new Date().toLocaleString("en-IN")}`;
    timestamp.font = {
        name: "Arial",
        size: 9,
        italic: true,
        color: COLORS.muted
    };

    worksheet.getRow(3).height = 20;

    // Table headers
    const headers = [
        "Document Name",
        "Matched Keywords",
        "Match Count",
        "Relevance to Tritorc",
        "Related Terminology"
    ];

    const headerRow = worksheet.getRow(4);
    headerRow.values = headers;
    headerRow.height = 32;

    headerRow.eachCell(cell => {
        cell.font = {
            name: "Arial",
            size: 10,
            bold: true,
            color:"FF231815"
        };

        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: COLORS.navy }
        };

        cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true
        };

        cell.border = {
            bottom: {
                style: "medium",
                color: { argb: COLORS.navy }
            }
        };
    });

    // Document data
    results.forEach((result, index) => {
        const keywords = (result.matchedKeywords || [])
            .map(item =>
                `${item.keyword} (${item.occurrences})`
            )
            .join(", ");

        const relatedTerms = (result.relatedTerms || [])
            .map(category => {
                const terms = category.matchedTerms
                    .map(item =>
                        `${item.term} (${item.occurrences})`
                    )
                    .join(", ");

                return `${category.category}: ${terms}`;
            })
            .join("\n");

        const row = worksheet.addRow({
            documentName: result.documentName,
            matchedKeywords: keywords || "None",
            matchCount: result.matchCount,
            relevance: result.verdict,
            relatedTerminology: relatedTerms || "None"
        });

       const documentLines = estimateWrappedLines(
    result.documentName, 34
);

const keywordLines = estimateWrappedLines(
    keywords || "None", 42
);

const relatedLines = estimateWrappedLines(
    relatedTerms || "None", 48
);

row.height = Math.max(
    42,
    18 * Math.max(documentLines, keywordLines, relatedLines)
);

        row.eachCell(cell => {
            cell.font = {
                name: "Arial",
                size: 10,
                color: COLORS.black
            };

            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                    argb: index % 2 === 0
                        ? COLORS.white
                        : COLORS.grey
                }
            };

            cell.alignment = {
                vertical: "center",
                horizontal: "left",
                wrapText: true,
                indent: 1
            };

            cell.border = {
                bottom: {
                    style: "thin",
                    color: { argb: COLORS.border }
                }
            };
        });

        // Match count
        row.getCell(3).alignment = {
            horizontal: "center",
            vertical: "middle"
        };

        row.getCell(3).font = {
            name: "Arial",
            size: 11,
            bold: true,
            color: COLORS.black
        };

        // Relevance formatting
        const verdictCell = row.getCell(4);

        const verdictStyles = {
            "Related": [COLORS.green, COLORS.greenText],
            "Possibly Related": [COLORS.amber, COLORS.amberText],
            "Not Related": [COLORS.red, COLORS.redText]
        };

        const style = verdictStyles[result.verdict];

        if (style) {
            verdictCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: style[0] }
            };

            verdictCell.font = {
                name: "Arial",
                size: 10,
                bold: true,
                color: style[1]
            };

            verdictCell.alignment = {
                horizontal: "center",
                vertical: "middle",
                wrapText: true
            };
        }
    });

    // Filtering
    worksheet.autoFilter = {
        from: "A4",
        to: `E${Math.max(4, worksheet.rowCount)}`
    };

    // Print settings
    worksheet.pageSetup = {
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        paperSize: 9,
        margins: {
            left: 0.3,
            right: 0.3,
            top: 0.5,
            bottom: 0.5
        }
    };

    worksheet.headerFooter.oddFooter =
        "&LScopeLens Tender Analysis&RPage &P of &N";

    return workbook.xlsx.writeBuffer();
}

module.exports = generateExcelReport;
