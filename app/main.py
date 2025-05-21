from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from routes.products import router as products_router
from routes.employee import router as employees_router
from routes.branches import router as branches_router
from authorization.auth import router as login_router
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
import logging
from fastapi import Request

# Инициализация приложения
app = FastAPI()

logging.basicConfig(level=logging.INFO)

@app.middleware("http")
async def log_request(request: Request, call_next):
    logging.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://frontend"
    ],  # Разрешаем доступ только с фронтенда на localhost:3000
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все HTTP методы
    allow_headers=["*"],  # Разрешаем все заголовки
)

# Настройка схемы аутентификации
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Включение роутеров
app.include_router(products_router)
app.include_router(employees_router)
app.include_router(branches_router)
app.include_router(login_router)

# Кастомная конфигурация OpenAPI для Swagger UI
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="Your API",
        version="1.0.0",
        description="API description",
        routes=app.routes,
    )
    
    # Добавляем поддержку Bearer токена в Swagger UI
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    
    # Добавляем глобальные требования безопасности
    openapi_schema["security"] = [{"BearerAuth": []}]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi