const express = require("express");
const { execSync } = require("child_process");
const { readFileSync, unlinkSync } = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// Check ffmpeg version
let ffmpegVersion = "not found";
try {
  ffmpegVersion = execSync("ffmpeg -version 2>&1 | head -1").toString().trim();
} catch (e) {
  console.error("FFmpeg check failed:", e.message);
}

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
      `ffprobe -v quiet -print_format json -show_format -show_streams "${url}"`,
      { timeout: 30000 }
    ).toString();
    res.json(JSON.parse(result));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", ffmpeg: ffmpegVersion !== "not found" });
});

app.listen(port, () => {
  console.log(`FFmpeg server on port ${port}`);
  console.log(`FFmpeg: ${ffmpegVersion}`);
});
