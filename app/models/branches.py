from sqlalchemy import Column, Integer, String, Identity
from db.postgres import Base

class Branches(Base):
    __tablename__ = "branches"

    id = Column(Integer, Identity(always=False), primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
