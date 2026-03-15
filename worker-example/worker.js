// Worker example - processes jobs from a queue
// This should run as ServiceType.WORKER (no HTTP)

const POLL_INTERVAL = 5000; // 5 seconds

async function processJob(job) {
  console.log(\`[Worker] Processing job: \${JSON.stringify(job)}\`);
  // Simulate work
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(\`[Worker] Job completed: \${job.id}\`);
}

async function main() {
  console.log("[Worker] Starting worker...");
  console.log(\`[Worker] Poll interval: \${POLL_INTERVAL}ms\`);
  
  let jobCount = 0;
  
  // Simulate polling a queue
  setInterval(() => {
    jobCount++;
    const mockJob = {
      id: \`job-\${jobCount}\`,
      type: "process",
      data: { value: Math.random() },
      timestamp: new Date().toISOString()
    };
    
    processJob(mockJob);
  }, POLL_INTERVAL);
  
  // Keep process alive
  console.log("[Worker] Worker running. Press Ctrl+C to stop.");
}

main().catch(console.error);
