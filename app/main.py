from fastapi import FastAPI

app = FastAPI(
    title="ScrapTrack API",
    description="Circular economy material ledger for Australian trade assets.",
    version="0.1.0"
)

@app.get("/health")
async def health_check():
    """Simple status check to verify the API thread is active."""
    return {"status": "healthy", "engine": "running"}