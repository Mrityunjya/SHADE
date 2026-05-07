from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.websocket import router as ws_router
import os  # IMPORTANT: Needed to read the Port from the cloud environment

app = FastAPI(
    title="SHADE System API",
    description="Satellite Hazard Assessment and Debris Engine",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This allows your Vercel frontend to talk to Railway
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "system": "SHADE",
        "message": "Welcome to the SHADE Mission Control API",
        "documentation": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(ws_router, prefix="/ws", tags=["websocket"])

if __name__ == "__main__":
    import uvicorn
    # 1. READ THE PORT: Railway tells us which port to use via an environment variable.
    # 2. DEFAULT TO 8000: If running locally, it falls back to 8000.
    port = int(os.environ.get("PORT", 8000))
    
    # 3. USE 0.0.0.0: This tells the server to listen to external traffic.
    uvicorn.run(app, host="0.0.0.0", port=port)