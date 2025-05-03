from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.postgres import get_db
from models.employee import Employee
from pydantic import BaseModel

router = APIRouter(prefix="/employees", tags=["Employees"])

class EmployeeIn(BaseModel):
    first_name: str
    last_name: str
    role: str
    branch_id: int

@router.get("/")
async def get_employees(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Employee))
    return result.scalars().all()

@router.post("/")
async def add_employee(employee: EmployeeIn, db: AsyncSession = Depends(get_db)):
    new_emp = Employee(**employee.dict())
    db.add(new_emp)
    await db.commit()
    await db.refresh(new_emp)
    return new_emp

@router.delete("/{employee_id}")
async def delete_employee(employee_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Employee).where(Employee.id == employee_id))
    emp = result.scalar_one_or_none()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    await db.delete(emp)
    await db.commit()
    return {"deleted": True}
