import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    module: "esm",
    message: "Hello from ESM on Veloz!"
  });
});

app.listen(port, () => {
  console.log(`ESM server on port ${port}`);
});
