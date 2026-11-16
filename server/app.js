
const express = require("express");
const cors = require("cors");
const scanRoutes = require("./routes/scanRoutes");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/scan", scanRoutes);

// Health check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Tritorc Relevance Checker backend is running!",
        service: "Express API"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
