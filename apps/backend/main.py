from fastapi import FastAPI
from dotenv import load_dotenv

from db.database import Base
from db.database import engine
from modules.auth.router import router as auth_router
from modules.ai.router import router as ai_router
from middleware import setup_middleware

load_dotenv()

app = FastAPI(title="Authentication API")

# Setup middleware
setup_middleware(app)

Base.metadata.create_all(bind=engine)


# Include routes
app.include_router(auth_router)
app.include_router(ai_router)
