
const express = require("express");
const multer = require("multer");

const {
    scanDocuments,
    exportScanReport
} = require("../controllers/scanController");

const router = express.Router();

// Store uploaded files temporarily in memory
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB per file
    },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = [".pdf", ".docx"];

        const extension = file.originalname
            .slice(file.originalname.lastIndexOf("."))
            .toLowerCase();

        if (allowedExtensions.includes(extension)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF and DOCX files are allowed."));
        }
    }
});

// API 1: Scan documents and return JSON
router.post(
    "/",
    upload.array("documents", 10),
    scanDocuments
);

// API 2: Scan documents and download Excel report
router.post(
    "/excel",
    upload.array("documents", 10),
    exportScanReport
);

module.exports = router;
