import express from "express";
import { execSync } from "child_process";
import { writeFileSync, readFileSync, unlinkSync } from "fs";

const app = express();
const port = process.env.PORT || 3000;

// Check imagemagick version
let magickVersion = "not found";
try {
  magickVersion = execSync("convert -version 2>&1 | head -1").toString().trim();
} catch {}

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    binary: "imagemagick",
    version: magickVersion,
    endpoints: [
      "/resize?url=<image-url>&width=200&height=200",
      "/blur?url=<image-url>&sigma=5",
      "/grayscale?url=<image-url>"
    ]
  });
});

app.get("/resize", async (req, res) => {
  const { url, width = 200, height = 200 } = req.query;
  if (!url) return res.status(400).json({ error: "url required" });
  
  try {
    const output = execSync(
      \`convert "\${url}" -resize \${width}x\${height} png:-\`,
      { maxBuffer: 50 * 1024 * 1024 }
    );
    res.set("Content-Type", "image/png");
    res.send(output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/blur", async (req, res) => {
  const { url, sigma = 5 } = req.query;
  if (!url) return res.status(400).json({ error: "url required" });
  
  try {
    const output = execSync(
      \`convert "\${url}" -blur 0x\${sigma} png:-\`,
      { maxBuffer: 50 * 1024 * 1024 }
    );
    res.set("Content-Type", "image/png");
    res.send(output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/grayscale", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "url required" });
  
  try {
    const output = execSync(
      \`convert "\${url}" -colorspace Gray png:-\`,
      { maxBuffer: 50 * 1024 * 1024 }
    );
    res.set("Content-Type", "image/png");
    res.send(output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", imagemagick: magickVersion !== "not found" });
});

app.listen(port, () => {
  console.log(\`ImageMagick server on port \${port}\`);
  console.log(\`ImageMagick: \${magickVersion}\`);
});
