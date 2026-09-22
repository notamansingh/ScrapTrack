from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

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

class Disposal(SQLModel, table = True):
    id: Optional[int] = Field(default= None, primary_key= True)
    driver_name: str
    metal_grade: MetalGrade
    total_weight_kg: float
    estimated_payout_aud: float
    image_key: Optional[str] = Field(default=None)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None)
    )

class DisposalCreate(SQLModel):
    driver_name: str
    metal_grade: MetalGrade
    total_weight_kg: float
    estimated_payout_aud: float


class DisposalRead(SQLModel):
    id: int
    driver_name: str
    metal_grade: MetalGrade
    total_weight_kg: float
    estimated_payout_aud: float
    created_at: datetime
    receipt_url: Optional[str] = None


class DashboardSummary(SQLModel):
    total_weight_kg: float
    total_valuation_aud: float
    carbon_mitigation_tons: float
