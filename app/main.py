from fastapi import FastAPI
from app.routers import materials

app = FastAPI()

# Make sure your router is registered here like before
app.include_router(materials.router)