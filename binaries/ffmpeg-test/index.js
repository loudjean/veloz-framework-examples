import express from "express";
import { execSync, spawn } from "child_process";
import { createWriteStream, unlinkSync, readFileSync } from "fs";
import { pipeline } from "stream/promises";

const app = express();
const port = process.env.PORT || 3000;

// Check ffmpeg version
let ffmpegVersion = "not found";
try {
  ffmpegVersion = execSync("ffmpeg -version 2>&1 | head -1").toString().trim();
} catch {}

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    binary: "ffmpeg",
    version: ffmpegVersion,
    endpoints: [
      "/convert?url=<video-url>&format=mp3",
      "/probe?url=<video-url>"
    ]
  });
});

app.get("/probe", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "url required" });
  
  try {
    const result = execSync(
      \`ffprobe -v quiet -print_format json -show_format -show_streams "\${url}"\`,
      { timeout: 30000 }
    ).toString();
    res.json(JSON.parse(result));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/convert", async (req, res) => {
  const url = req.query.url;
  const format = req.query.format || "mp3";
  if (!url) return res.status(400).json({ error: "url required" });
  
  try {
    const outputFile = \`/tmp/output.\${format}\`;
    execSync(
      \`ffmpeg -y -i "\${url}" -t 10 -q:a 2 "\${outputFile}"\`,
      { timeout: 60000 }
    );
    
    const data = readFileSync(outputFile);
    unlinkSync(outputFile);
    
    res.set("Content-Type", \`audio/\${format}\`);
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", ffmpeg: ffmpegVersion !== "not found" });
});

app.listen(port, () => {
  console.log(\`FFmpeg server on port \${port}\`);
  console.log(\`FFmpeg: \${ffmpegVersion}\`);
});
