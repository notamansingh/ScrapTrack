import asyncio
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession

# Import your setup tools from your app folder
from app.database import async_engine, async_session_factory
from app.models import EnvironmentalMatrix, MetalGrade

async def init_db():
    print("Connecting to PostgreSQL and compiling tables...")
    
    # 1. Instruct the database engine to drop and recreate schemas
    async with async_engine.begin() as conn:
        # This reads your app/models.py metadata and creates the physical tables in Postgres
        await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)
    
    print("Tables generated successfully. Seeding environmental matrix...")
    
    # 2. Open an isolated transaction session context
    async with async_session_factory() as session:
        # Create standard reference metrics
        factors = [
            EnvironmentalMatrix(
                metal_grade=MetalGrade.BRIGHT_COPPER, 
                co2_saved_per_kg=4.2, 
                energy_savings_pct=85.0
            ),
            EnvironmentalMatrix(
                metal_grade=MetalGrade.INSULATED_WIRE, 
                co2_saved_per_kg=2.1, 
                energy_savings_pct=60.0
            ),
            EnvironmentalMatrix(
                metal_grade=MetalGrade.MIXED_BRASS, 
                co2_saved_per_kg=3.1, 
                energy_savings_pct=75.0
            ),
            EnvironmentalMatrix(
                metal_grade=MetalGrade.ALUMINUM, 
                co2_saved_per_kg=9.2, 
                energy_savings_pct=95.0
            ),
        ]
        
        # Add the array objects to the staging session memory loop
        session.add_all(factors)
        
        # Commit the transaction block securely to the disk
        await session.commit()
        
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(init_db())