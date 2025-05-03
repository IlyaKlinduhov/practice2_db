from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class QuantityItem(BaseModel):
    branch_id: int  
    count: int = Field(ge=0)

class Product(BaseModel):
    name: str
    description: Optional[str]
    price: float
    quantity: List[QuantityItem]
    category: Optional[str]
    tags: Optional[List[str]]
    available: bool
    created_at: datetime
    updated_at: datetime
