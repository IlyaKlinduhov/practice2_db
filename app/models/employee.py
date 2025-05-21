from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from db.postgres import Base
import enum

class RoleEnum(str, enum.Enum):
    seller = "seller"
    admin = "admin"

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    hashed_password = Column(String, nullable=False)
    branch_id = Column(Integer, ForeignKey("branches.id"))
