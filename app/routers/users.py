from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.auth import hash_password, decode_token

router = APIRouter(prefix="/users", tags=["Users"])

def get_current_user(token: dict = Depends(decode_token), db: Session = Depends(get_db)):
    user_id = token.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token inválido")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

@router.post("/")
def create_user(user: dict, db: Session = Depends(get_db)):
    from pydantic import BaseModel
    class UserCreate(BaseModel):
        name: str
        email: str
        password: str
    user_data = UserCreate(**user)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hash_password(user_data.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"id": db_user.id, "name": db_user.name, "email": db_user.email}

@router.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email}
