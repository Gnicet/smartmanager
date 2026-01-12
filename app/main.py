# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import users, auth  # certifique-se que esses arquivos existem
from app.database import Base, engine

# Criar as tabelas no banco (se ainda não existirem)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartManager API",
    description="API para cadastro, login e dashboard",
    version="1.0.0"
)

# Configuração de CORS
origins = [
    "http://127.0.0.1:5500",  # frontend rodando no Live Server
    "http://localhost:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo routers
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
