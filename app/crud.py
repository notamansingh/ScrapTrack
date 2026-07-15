from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.models import EnvironmentalMatrix, EnvironmentalMatrixCreate, MetalGrade

async def get_environmental_metrics(session: AsyncSession):
    statement = select(EnvironmentalMatrix)
    result = await session.execute(statement)
    return result.scalars().all()

async def get_metrics_by_grade(session: AsyncSession, grade: MetalGrade):
    statement = select(EnvironmentalMatrix).where(EnvironmentalMatrix.metal_grade == grade)
    result = await session.execute(statement)
    return result.scalars().first()
async def create_environment_metric(session: AsyncSession, matrix_in: EnvironmentalMatrixCreate):
    db_matrix = EnvironmentalMatrix.model_validate(matrix_in.model_dump(exclude_unset=True))
    session.add(db_matrix)
    await session.commit()
    await session.refresh(db_matrix)
    return db_matrix
