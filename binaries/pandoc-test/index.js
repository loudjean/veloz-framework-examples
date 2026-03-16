const express = require("express");
const { execSync } = require("child_process");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.text({ type: "*/*", limit: "10mb" }));

let pandocVersion = "not found";
try {
  pandocVersion = execSync("pandoc --version 2>&1 | head -1").toString().trim();
} catch (e) {}

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    binary: "pandoc",
    version: pandocVersion,
    endpoints: ["POST /convert?from=markdown&to=html"]
  });
});

app.post("/convert", (req, res) => {
  const from = req.query.from || "markdown";
  const to = req.query.to || "html";
  const input = req.body;
  
  if (!input) return res.status(400).json({ error: "body required" });
  
  try {
    const result = execSync(
      `echo '${input.replace(/'/g, "'\\''")}' | pandoc -f ${from} -t ${to}`,
      { timeout: 30000 }
    ).toString();
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Pandoc server on port ${port}`));
