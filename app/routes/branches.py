from fastapi import APIRouter, Depends, HTTPException
from authorization.permissions import require_role
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from models.branches import Branches
from db.postgres import get_db

router = APIRouter(prefix="/branches", tags=["Branches"])

class BranchIn(BaseModel):
    name: str
    location: str

class BranchOut(BranchIn):
    id: int

    class Config:
        orm_mode = True

@router.get("/", response_model=list[BranchOut])
async def get_branches(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Branches))
    return result.scalars().all()

@router.post("/", response_model=BranchOut)
async def add_branch(
    branch: BranchIn,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_role("admin"))
):
    new_branch = Branches(**branch.dict())
    db.add(new_branch)
    await db.commit()
    await db.refresh(new_branch)
    return new_branch

@router.delete("/{branch_id}")
async def delete_branch(
    branch_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_role("admin"))
):
    result = await db.execute(select(Branches).where(Branches.id == branch_id))
    branch = result.scalar_one_or_none()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    await db.delete(branch)
    await db.commit()
    return {"deleted": True}
