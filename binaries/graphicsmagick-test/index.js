import express from "express";
import { execSync } from "child_process";

const app = express();
const port = process.env.PORT || 3000;

// Check gm version
let gmVersion = "not found";
try {
  gmVersion = execSync("gm version 2>&1 | head -1").toString().trim();
} catch {}

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    binary: "graphicsmagick",
    version: gmVersion,
    endpoints: [
      "/thumbnail?url=<image-url>&size=100",
      "/rotate?url=<image-url>&degrees=90"
    ]
  });
});

app.get("/thumbnail", async (req, res) => {
  const { url, size = 100 } = req.query;
  if (!url) return res.status(400).json({ error: "url required" });
  
  try {
    const output = execSync(
      \`gm convert "\${url}" -thumbnail \${size}x\${size} png:-\`,
      { maxBuffer: 50 * 1024 * 1024 }
    );
    res.set("Content-Type", "image/png");
    res.send(output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/rotate", async (req, res) => {
  const { url, degrees = 90 } = req.query;
  if (!url) return res.status(400).json({ error: "url required" });
  
  try {
    const output = execSync(
      \`gm convert "\${url}" -rotate \${degrees} png:-\`,
      { maxBuffer: 50 * 1024 * 1024 }
    );
    res.set("Content-Type", "image/png");
    res.send(output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", gm: gmVersion !== "not found" });
});

app.listen(port, () => {
  console.log(\`GraphicsMagick server on port \${port}\`);
  console.log(\`GraphicsMagick: \${gmVersion}\`);
});
