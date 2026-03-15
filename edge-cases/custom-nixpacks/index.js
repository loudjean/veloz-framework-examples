const http = require("http");
const { execSync } = require("child_process");

const port = process.env.PORT || 3000;

// Check if custom packages are installed
let ffmpegVersion = "not installed";
let imagemagickVersion = "not installed";

try {
  ffmpegVersion = execSync("ffmpeg -version 2>&1 | head -1").toString().trim();
} catch {}

try {
  imagemagickVersion = execSync("convert -version 2>&1 | head -1").toString().trim();
} catch {}

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    status: "ok",
    message: "Custom nixpacks with system packages",
    packages: {
      ffmpeg: ffmpegVersion,
      imagemagick: imagemagickVersion
    }
  }, null, 2));
});

server.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
