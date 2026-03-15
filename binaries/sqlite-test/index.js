import express from "express";
import Database from "better-sqlite3";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize database
const dbPath = process.env.DB_PATH || "/data/app.db";
const db = new Database(dbPath);

// Create table if not exists
db.exec(\`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
\`);

app.get("/", (req, res) => {
  const count = db.prepare("SELECT COUNT(*) as count FROM items").get();
  res.json({
    status: "ok",
    binary: "sqlite",
    database: dbPath,
    items_count: count.count,
    endpoints: [
      "GET /items",
      "POST /items { name, value }",
      "DELETE /items/:id"
    ]
  });
});

app.get("/items", (req, res) => {
  const items = db.prepare("SELECT * FROM items ORDER BY id DESC").all();
  res.json(items);
});

app.post("/items", (req, res) => {
  const { name, value } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  
  const stmt = db.prepare("INSERT INTO items (name, value) VALUES (?, ?)");
  const result = stmt.run(name, value || null);
  res.json({ id: result.lastInsertRowid, name, value });
});

app.delete("/items/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM items WHERE id = ?");
  const result = stmt.run(id);
  res.json({ deleted: result.changes > 0 });
});

app.get("/health", (req, res) => {
  try {
    db.prepare("SELECT 1").get();
    res.json({ status: "healthy", database: "connected" });
  } catch {
    res.status(500).json({ status: "unhealthy", database: "error" });
  }
});

app.listen(port, () => {
  console.log(\`SQLite server on port \${port}\`);
  console.log(\`Database: \${dbPath}\`);
});
