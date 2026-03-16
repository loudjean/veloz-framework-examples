const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const db = new Database(":memory:");
db.exec("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT, created_at TEXT)");

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    database: "sqlite",
    endpoints: ["GET /items", "POST /items"]
  });
});

app.get("/items", (req, res) => {
  const items = db.prepare("SELECT * FROM items").all();
  res.json(items);
});

app.post("/items", (req, res) => {
  const { name } = req.body;
  const stmt = db.prepare("INSERT INTO items (name, created_at) VALUES (?, ?)");
  const result = stmt.run(name, new Date().toISOString());
  res.json({ id: result.lastInsertRowid, name });
});

app.listen(port, () => console.log(`SQLite server on port ${port}`));
