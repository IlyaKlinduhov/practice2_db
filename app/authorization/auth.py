from passlib.hash import bcrypt
from jose import jwt
from fastapi import Depends, Form, HTTPException, APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.employee import Employee
from db.postgres import get_db
from datetime import datetime, timedelta
from sqlalchemy import and_
import os


SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter(tags=["Auth"])

@router.post("/token")
async def login(
    first_name: str = Form(...),
    last_name: str = Form(...),
    password: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Employee).where(
            and_(
                Employee.first_name == first_name,
                Employee.last_name == last_name
            )
        )
    )
    user = result.scalar_one_or_none()
    if not user or not bcrypt.verify(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_data = {
        "sub": str(user.id),
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}
