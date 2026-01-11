from fastapi import FastAPI

app = FastAPI(title="SmartManager API")

@app.get("/")
def root():
    return {"message": "API rodando com sucesso 🚀"}
