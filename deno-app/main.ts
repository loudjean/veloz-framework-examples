const port = parseInt(Deno.env.get("PORT") || "3000");

Deno.serve({ port }, (req: Request) => {
  const url = new URL(req.url);
  
  if (url.pathname === "/health") {
    return Response.json({ status: "healthy" });
  }
  
  return Response.json({
    status: "ok",
    framework: "deno",
    message: "Hello from Deno on Veloz!",
    timestamp: new Date().toISOString(),
  });
});

console.log(\`Server running on port \${port}\`);
