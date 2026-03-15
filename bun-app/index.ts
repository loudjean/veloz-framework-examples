const port = parseInt(process.env.PORT || "3000");

const server = Bun.serve({
  port,
  fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === "/health") {
      return Response.json({ status: "healthy" });
    }
    
    return Response.json({
      status: "ok",
      framework: "bun",
      message: "Hello from Bun on Veloz!",
      timestamp: new Date().toISOString(),
    });
  },
});

console.log(\`Server running on port \${server.port}\`);
