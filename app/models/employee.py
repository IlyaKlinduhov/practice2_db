from sqlalchemy import Column, Integer, String, ForeignKey
from db.postgres import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    branch_id = Column(Integer, ForeignKey("branches.id"))
