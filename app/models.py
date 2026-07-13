from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field

# 1. Define the MetalGrade Enum used by your seed script
class MetalGrade(str, Enum):
    BRIGHT_COPPER = "Bright Copper"
    INSULATED_WIRE = "Insulated Wire"
    MIXED_BRASS = "Mixed Brass"
    ALUMINUM = "Aluminum"

# 2. Define the EnvironmentalMatrix Table Schema
class EnvironmentalMatrix(SQLModel, table=True):
    __tablename__ = "environmental_matrix"

    id: Optional[int] = Field(default=None, primary_key=True)
    metal_grade: MetalGrade = Field(index=True, unique=True)
    co2_saved_per_kg: float
    energy_savings_pct: float
    