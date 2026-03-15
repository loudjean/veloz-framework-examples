import express from "express";
import { execSync } from "child_process";

const app = express();
const port = process.env.PORT || 3000;

// Check wkhtmltopdf version
let wkVersion = "not found";
try {
  wkVersion = execSync("wkhtmltopdf --version 2>&1 | head -1").toString().trim();
} catch {}

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    binary: "wkhtmltopdf",
    version: wkVersion,
    endpoints: ["/pdf?url=https://example.com"]
  });
});

app.get("/pdf", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "url required" });
  
  try {
    const pdf = execSync(
      \`wkhtmltopdf --quiet "\${url}" -\`,
      { timeout: 60000, maxBuffer: 50 * 1024 * 1024 }
    );
    res.set("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", wkhtmltopdf: wkVersion !== "not found" });
});

app.listen(port, () => {
  console.log(\`wkhtmltopdf server on port \${port}\`);
  console.log(\`wkhtmltopdf: \${wkVersion}\`);
});
