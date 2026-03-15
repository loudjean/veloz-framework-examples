import express from "express";
import { chromium } from "playwright";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  res.json({
    status: "ok",
    binary: "playwright",
    message: "Playwright test endpoint",
    endpoints: ["/screenshot?url=https://example.com"]
  });
});

app.get("/screenshot", async (req, res) => {
  const url = req.query.url || "https://example.com";
  
  try {
    const browser = await chromium.launch({ 
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    const screenshot = await page.screenshot({ type: "png" });
    await browser.close();
    
    res.set("Content-Type", "image/png");
    res.send(screenshot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(port, () => {
  console.log(\`Playwright server on port \${port}\`);
});
