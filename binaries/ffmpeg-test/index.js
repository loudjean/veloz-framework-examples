import express from "express";
import { execSync } from "child_process";

const app = express();
const port = process.env.PORT || 3000;

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
    module: "esm",
    version: ffmpegVersion
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(port, () => {
  console.log(`FFmpeg ESM server on port ${port}`);
});
