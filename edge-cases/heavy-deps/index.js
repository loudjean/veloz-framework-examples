const express = require("express");
const sharp = require("sharp");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  // Test sharp is working
  const metadata = await sharp({
    create: {
      width: 100,
      height: 100,
      channels: 4,
      background: { r: 255, g: 77, b: 0, alpha: 1 }
    }
  }).png().metadata();

  res.json({
    status: "ok",
    message: "Heavy deps test (sharp)",
    sharp: {
      working: true,
      testImageSize: \`\${metadata.width}x\${metadata.height}\`
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
