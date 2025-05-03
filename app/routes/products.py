from fastapi import APIRouter, HTTPException
from db.mongo import mongo_db
from models.product import Product
from bson import ObjectId
from datetime import datetime
from pymongo.errors import DuplicateKeyError


router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/")
async def get_products():
    products = await mongo_db.products.find().to_list(100)
    for p in products:
        p["_id"] = str(p["_id"])
    return products

@router.post("/products")
async def add_product(product: Product):
    try:
        product_dict = product.dict()
        product_dict["created_at"] = datetime.utcnow()
        product_dict["updated_at"] = datetime.utcnow()

        result = await mongo_db.products.insert_one(product_dict)
        return {"id": str(result.inserted_id)}
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Product already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    result = await mongo_db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"deleted": True}
