from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def setup_middleware(app: FastAPI):
    """Configure middleware for the application"""
    # CORS configuration for React frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  # React dev server
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
