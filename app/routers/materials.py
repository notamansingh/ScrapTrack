from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from app.database import async_session_factory
from app.models import EnvironmentalMatrix, EnvironmentalMatrixCreate, MetalGrade
from app import crud

router = APIRouter(prefix="/materials", tags=["materials Ledger"])

async def get_db_session() -> AsyncSession:
    async with async_session_factory() as session:
        yield session

@router.get("/metrics", response_model=list[EnvironmentalMatrix])
async def get_metrics(session: AsyncSession = Depends(get_db_session)):
    result = await crud.get_environmental_metrics(session)
    return result

@router.get("/metrics/{grade}", response_model=EnvironmentalMatrix)
async def get_grade(grade: MetalGrade, session: AsyncSession = Depends(get_db_session)):
    metal_grade = await crud.get_metrics_by_grade(session, grade)
    if metal_grade is None:
        raise HTTPException(status_code=404, detail="Metrics not found")
    return metal_grade

@router.post("/", response_model = EnvironmentalMatrix, status_code = 201)
async def create_metric(matrix_in: EnvironmentalMatrixCreate, session: AsyncSession = Depends(get_db_session)):
    new_metric = await crud.create_environment_metric(session, matrix_in)
    return new_metric