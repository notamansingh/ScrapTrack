from fastapi import APIRouter, Depends, HTTPException
from app.models import Disposal, DisposalCreate, DisposalRead, DashboardSummary, EnvironmentalMatrix
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.database import async_session_factory
from fastapi import UploadFile, File, Form
import json
from app.utils.storage import upload_image_to_r2, get_receipt_url


router = APIRouter(prefix="/disposals", tags=["Disposals"])

async def get_db_session() -> AsyncSession:
    async with async_session_factory() as session:
        yield session


async def _to_read(d: Disposal) -> DisposalRead:
    receipt_url = await get_receipt_url(d.image_key) if d.image_key else None
    return DisposalRead(**d.model_dump(), receipt_url=receipt_url)


def compute_summary(disposals: list[Disposal], co2_per_kg_by_grade: dict) -> DashboardSummary:
    total_weight_kg = sum(d.total_weight_kg for d in disposals)
    total_valuation_aud = sum(d.estimated_payout_aud for d in disposals)
    total_co2_kg = sum(
        d.total_weight_kg * co2_per_kg_by_grade.get(d.metal_grade, 0.0) for d in disposals
    )
    return DashboardSummary(
        total_weight_kg=total_weight_kg,
        total_valuation_aud=total_valuation_aud,
        carbon_mitigation_tons=total_co2_kg / 1000,
    )


@router.post("/create_disposal", response_model=DisposalRead, status_code=201)
async def create_disposal(file: UploadFile = File(...), metadata: str = Form(...), session: AsyncSession = Depends(get_db_session)):
    try:
        data_dict = json.loads(metadata)
        disposal_in = DisposalCreate(**data_dict)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON structure for disposal metadata.")

    try:
        image_key = await upload_image_to_r2(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cloud upload failed: {e}")

    disposal_data = Disposal(
        driver_name=disposal_in.driver_name,
        metal_grade=disposal_in.metal_grade,
        total_weight_kg=disposal_in.total_weight_kg,
        estimated_payout_aud=disposal_in.estimated_payout_aud,
        image_key=image_key,
    )
    session.add(disposal_data)
    await session.commit()
    await session.refresh(disposal_data)

    return await _to_read(disposal_data)


@router.get("/", response_model=list[DisposalRead])
async def list_disposals(session: AsyncSession = Depends(get_db_session)):
    result = await session.execute(select(Disposal).order_by(Disposal.created_at.desc()))
    disposals = result.scalars().all()
    return [await _to_read(d) for d in disposals]


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(session: AsyncSession = Depends(get_db_session)):
    disposals = (await session.execute(select(Disposal))).scalars().all()
    matrix_by_grade = {
        m.metal_grade: m.co2_saved_per_kg
        for m in (await session.execute(select(EnvironmentalMatrix))).scalars().all()
    }
    return compute_summary(disposals, matrix_by_grade)
