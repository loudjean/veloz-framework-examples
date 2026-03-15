import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || "/data";
const COUNTER_FILE = path.join(DATA_DIR, "counter.json");

app.use(express.json());

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {
    // Directory exists
  }
}

// Read counter
async function getCounter() {
  try {
    const data = await fs.readFile(COUNTER_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { count: 0, lastUpdated: null };
  }
}

// Write counter
async function setCounter(data) {
  await fs.writeFile(COUNTER_FILE, JSON.stringify(data, null, 2));
}

app.get("/", async (req, res) => {
  const counter = await getCounter();
  res.json({
    status: "ok",
    framework: "express",
    message: "Volume test app",
    dataDir: DATA_DIR,
    counter: counter,
  });
});

app.post("/increment", async (req, res) => {
  const counter = await getCounter();
  counter.count++;
  counter.lastUpdated = new Date().toISOString();
  await setCounter(counter);
  res.json({ success: true, counter });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(port, async () => {
  await ensureDataDir();
  console.log(\`Server running on port \${port}\`);
  console.log(\`Data directory: \${DATA_DIR}\`);
});
