import os
from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession

# Updated for native local execution
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/scraptrack")

# 1. Create the asynchronous database engine
# The connection pool manages multiple open connections efficiently.
async_engine = create_async_engine(
    DATABASE_URL,
    echo=True,       # Prints raw SQL execution statements to terminal (critical for learning)
    future=True
)

# 2. Build the Session Factory
# This generates individual transaction contexts (sessions) when requested.
async_session_factory = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# 3. The Dependency Injection Helper
# This yields an isolated database session for a single API request, then closes it automatically.
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        yield session