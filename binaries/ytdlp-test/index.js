const express = require("express");
const { execSync } = require("child_process");

const app = express();
const port = process.env.PORT || 3000;

let ytdlpVersion = "not found";
try {
  ytdlpVersion = execSync("yt-dlp --version 2>&1").toString().trim();
} catch (e) {}

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    binary: "yt-dlp",
    version: ytdlpVersion,
    endpoints: ["/info?url=<video-url>"]
  });
});

app.get("/info", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "url required" });
  
  try {
    const result = execSync(
      `yt-dlp -j "${url}"`,
      { timeout: 60000 }
    ).toString();
    res.json(JSON.parse(result));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`yt-dlp server on port ${port}`));
