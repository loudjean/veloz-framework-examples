const Fastify = require("fastify");

const app = Fastify({ logger: true });
const port = process.env.PORT || 3000;

app.get("/", async () => ({
  status: "ok",
  framework: "fastify",
  message: "Hello from Fastify on Veloz!",
  timestamp: new Date().toISOString()
}));

app.get("/health", async () => ({ status: "healthy" }));

app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`Fastify server on port ${port}`);
});
