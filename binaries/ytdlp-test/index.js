import express from "express";
import { execSync, spawn } from "child_process";

const app = express();
const port = process.env.PORT || 3000;

// Check yt-dlp version
let ytdlpVersion = "not found";
try {
  ytdlpVersion = execSync("yt-dlp --version 2>&1").toString().trim();
} catch {}

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    binary: "yt-dlp",
    version: ytdlpVersion,
    endpoints: [
      "/info?url=<video-url>",
      "/formats?url=<video-url>"
    ]
  });
});

app.get("/info", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "url required" });
  
  try {
    const result = execSync(
      \`yt-dlp -j "\${url}"\`,
      { timeout: 30000, maxBuffer: 10 * 1024 * 1024 }
    ).toString();
    
    const info = JSON.parse(result);
    res.json({
      title: info.title,
      duration: info.duration,
      uploader: info.uploader,
      view_count: info.view_count,
      thumbnail: info.thumbnail,
      formats_count: info.formats?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/formats", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "url required" });
  
  try {
    const result = execSync(
      \`yt-dlp -F "\${url}"\`,
      { timeout: 30000 }
    ).toString();
    res.type("text/plain").send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", ytdlp: ytdlpVersion !== "not found" });
});

app.listen(port, () => {
  console.log(\`yt-dlp server on port \${port}\`);
  console.log(\`yt-dlp: \${ytdlpVersion}\`);
});
