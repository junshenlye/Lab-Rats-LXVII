"""
Maritime Finance Backend API
FastAPI server for DID verification and credential management.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routers import did, vessels, credentials
from config import DATA_DIR

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize FastAPI app
app = FastAPI(
    title="Maritime Finance API",
    description="Backend API for DID verification and credential management",
    version="1.0.0"
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(did.router, prefix="/api/did", tags=["DID"])
app.include_router(vessels.router, prefix="/api/vessels", tags=["Vessels"])
app.include_router(credentials.router, prefix="/api/credentials", tags=["Credentials"])


@app.get("/")
async def root():
    return {
        "message": "Maritime Finance API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
