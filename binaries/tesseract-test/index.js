const express = require("express");
const { execSync } = require("child_process");

const app = express();
const port = process.env.PORT || 3000;

let tessVersion = "not found";
try {
  tessVersion = execSync("tesseract --version 2>&1 | head -1").toString().trim();
} catch (e) {}

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    binary: "tesseract",
    version: tessVersion,
    endpoints: ["/ocr?url=<image-url>"]
  });
});

app.get("/ocr", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "url required" });
  
  try {
    const result = execSync(
      `curl -s "${url}" | tesseract stdin stdout 2>/dev/null`,
      { timeout: 30000 }
    ).toString();
    res.json({ text: result.trim() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Tesseract server on port ${port}`));
