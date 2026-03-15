import express from "express";
import { execSync } from "child_process";
import { writeFileSync, readFileSync, unlinkSync } from "fs";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.text({ type: "*/*", limit: "10mb" }));

// Check pandoc version
let pandocVersion = "not found";
try {
  pandocVersion = execSync("pandoc --version 2>&1 | head -1").toString().trim();
} catch {}

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    binary: "pandoc",
    version: pandocVersion,
    endpoints: [
      "POST /convert?from=markdown&to=html",
      "POST /convert?from=markdown&to=pdf"
    ]
  });
});

app.post("/convert", async (req, res) => {
  const { from = "markdown", to = "html" } = req.query;
  const content = req.body;
  
  if (!content) return res.status(400).json({ error: "body required" });
  
  try {
    const inputFile = \`/tmp/input.\${from}\`;
    writeFileSync(inputFile, content);
    
    if (to === "pdf") {
      const outputFile = "/tmp/output.pdf";
      execSync(\`pandoc "\${inputFile}" -o "\${outputFile}"\`);
      const pdf = readFileSync(outputFile);
      unlinkSync(inputFile);
      unlinkSync(outputFile);
      res.set("Content-Type", "application/pdf");
      res.send(pdf);
    } else {
      const result = execSync(\`pandoc "\${inputFile}" -t \${to}\`).toString();
      unlinkSync(inputFile);
      res.type(to === "html" ? "text/html" : "text/plain").send(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", pandoc: pandocVersion !== "not found" });
});

app.listen(port, () => {
  console.log(\`Pandoc server on port \${port}\`);
  console.log(\`Pandoc: \${pandocVersion}\`);
});
