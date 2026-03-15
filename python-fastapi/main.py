from fastapi import FastAPI
from datetime import datetime
import os

app = FastAPI()

@app.get("/")
def root():
    return {
        "status": "ok",
        "framework": "fastapi",
        "message": "Hello from FastAPI on Veloz!",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3000))
    uvicorn.run(app, host="0.0.0.0", port=port)
