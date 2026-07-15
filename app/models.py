from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field

# 1. Define the MetalGrade Enum used by your seed script
class MetalGrade(str, Enum):
    BRIGHT_COPPER = "Bright Copper"
    INSULATED_WIRE = "Insulated Wire"
    MIXED_BRASS = "Mixed Brass"
    ALUMINUM = "Aluminum"
    STAINLESS_STEEL = "Stainless Steel"

# 2. Base fields shared between creation schemas and database tables
class EnvironmentalMatrixBase(SQLModel):
    metal_grade: MetalGrade = Field(index=True, unique=True)
    co2_saved_per_kg: float
    energy_savings_pct: float

# 3. Request payload validation schema (NO ID field allowed!)
class EnvironmentalMatrixCreate(EnvironmentalMatrixBase):
    pass

# 4. Actual database table schema
class EnvironmentalMatrix(EnvironmentalMatrixBase, table=True):
    __tablename__ = "environmental_matrix"

    id: Optional[int] = Field(default=None, primary_key=True)