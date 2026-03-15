const fastify = require("fastify")({ logger: true });

const port = process.env.PORT || 3000;

fastify.get("/", async (request, reply) => {
  return {
    status: "ok",
    framework: "fastify",
    message: "Hello from Fastify on Veloz!",
    timestamp: new Date().toISOString(),
  };
});

fastify.get("/health", async (request, reply) => {
  return { status: "healthy" };
});

const start = async () => {
  try {
    await fastify.listen({ port: Number(port), host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
