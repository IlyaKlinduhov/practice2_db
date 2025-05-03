from fastapi import FastAPI
from routes.products import router as products_router
from routes.employee import router as employees_router
from routes.branches import router as branches_router


app = FastAPI()
app.include_router(products_router)
app.include_router(employees_router)
app.include_router(branches_router)
