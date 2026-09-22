import os
from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import SQLModel

# Import all models so SQLModel metadata registers them before create_all is called
from app.models import EnvironmentalMatrix, Disposal

# Updated for native local execution
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/scraptrack")

# 1. Create the asynchronous database engine
async_engine = create_async_engine(
    DATABASE_URL,
    echo=True,       # Prints raw SQL execution statements to terminal
    future=True
)

# 2. Build the Session Factory
async_session_factory = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# 3. Dynamic Database Initialization Hook
async def init_db():
    # Use the async_engine defined right above!
    async with async_engine.begin() as conn:
        # Safely builds missing tables in Postgres
        await conn.run_sync(SQLModel.metadata.create_all)

# 4. The Dependency Injection Helper
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        yield session