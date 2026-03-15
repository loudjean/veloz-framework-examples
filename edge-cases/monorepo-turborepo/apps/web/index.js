const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ app: "web", monorepo: "turborepo", status: "ok" });
});

app.listen(port, () => console.log(\`Web running on \${port}\`));
