import express from "express";
import puppeteer from "puppeteer";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  res.json({
    status: "ok",
    binary: "puppeteer",
    message: "Puppeteer test endpoint",
    endpoints: ["/pdf?url=https://example.com"]
  });
});

app.get("/pdf", async (req, res) => {
  const url = req.query.url || "https://example.com";
  
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();
    
    res.set("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(port, () => {
  console.log(\`Puppeteer server on port \${port}\`);
});
