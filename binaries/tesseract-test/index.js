import express from "express";
import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import https from "https";
import http from "http";

const app = express();
const port = process.env.PORT || 3000;

// Check tesseract version
let tesseractVersion = "not found";
try {
  tesseractVersion = execSync("tesseract --version 2>&1 | head -1").toString().trim();
} catch {}

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    protocol.get(url, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    binary: "tesseract",
    version: tesseractVersion,
    endpoints: ["/ocr?url=<image-url>&lang=eng"]
  });
});

app.get("/ocr", async (req, res) => {
  const { url, lang = "eng" } = req.query;
  if (!url) return res.status(400).json({ error: "url required" });
  
  try {
    const imageData = await downloadImage(url);
    const inputFile = "/tmp/ocr_input.png";
    writeFileSync(inputFile, imageData);
    
    const result = execSync(
      \`tesseract "\${inputFile}" stdout -l \${lang}\`,
      { timeout: 60000 }
    ).toString();
    
    unlinkSync(inputFile);
    res.json({ text: result.trim(), lang });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", tesseract: tesseractVersion !== "not found" });
});

app.listen(port, () => {
  console.log(\`Tesseract OCR server on port \${port}\`);
  console.log(\`Tesseract: \${tesseractVersion}\`);
});
