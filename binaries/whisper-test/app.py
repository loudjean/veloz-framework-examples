from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import whisper
import tempfile
import os

app = FastAPI()

# Load model on startup (use tiny for faster loading)
model = None

@app.on_event("startup")
async def load_model():
    global model
    model_name = os.getenv("WHISPER_MODEL", "tiny")
    print(f"Loading Whisper model: {model_name}")
    model = whisper.load_model(model_name)
    print("Model loaded!")

@app.get("/")
def root():
    return {
        "status": "ok",
        "binary": "whisper",
        "model": os.getenv("WHISPER_MODEL", "tiny"),
        "endpoints": ["/transcribe (POST with audio file)"]
    }

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        result = model.transcribe(tmp_path)
        return {
            "text": result["text"],
            "language": result.get("language"),
            "segments": len(result.get("segments", []))
        }
    finally:
        os.unlink(tmp_path)

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3000))
    uvicorn.run(app, host="0.0.0.0", port=port)
