from typing import List, Annotated

from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

import auth
from database import engine, SessionLocal
from fastapi import FastAPI, status, HTTPException, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlmodel import SQLModel
from models import Product, Order
from auth import get_current_user


class CreateOrderRequest(BaseModel):
    product_id: int
    quantity: int


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:4200",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)
app.include_router(auth.router)
SQLModel.metadata.create_all(engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@app.post("/", status_code=status.HTTP_200_OK)
async def log_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    return {"User": user}


# getting product list
@app.get("/products-list", response_model=List[Product], status_code=status.HTTP_200_OK)
async def get_all_products():
    with engine.connect() as conn:
        result = conn.execute(text("select * from product;"))
        return result.all()


# adding new order
@app.post("/orders-add", status_code=status.HTTP_201_CREATED)
async def create_order(create_order_request: CreateOrderRequest, current_user: user_dependency, db: db_dependency):
    if current_user['role'] not in ('admin', 'customer'):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Permission denied')
    create_order_request = Order(
        product_id=create_order_request.product_id,
        quantity=create_order_request.quantity,
        owner=current_user['id']
    )
    db.add(create_order_request)
    db.commit()


# getting order status

@app.get("/order-list", response_model=List[Order], status_code=status.HTTP_200_OK)
async def get_order_list(current_user: user_dependency):
    if current_user['role'] not in ('admin', 'customer'):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Permission denied')
    if current_user['role'] == 'admin':
        with engine.connect() as conn:
            result = conn.execute(text(f"select * from ordering"))
            return result.all()

    if current_user['role'] == 'customer':
        with engine.connect() as conn:
            result = conn.execute(text(f"select * from ordering where owner = {current_user['id']};"))
            return result.all()


@app.get("/order-status", response_model=List[Order], status_code=status.HTTP_200_OK)
async def get_order(order_id, current_user: user_dependency):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Permission denied')
    with engine.connect() as conn:
        result = conn.execute(text(f"select * from ordering where id = {order_id};"))
        return result.all()


@app.delete("/order-delete/{order_id}", status_code=status.HTTP_200_OK)
async def delete_order(order_id: int, current_user: user_dependency, db: db_dependency):
    print(order_id)
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Permission denied')
    db.execute(text(f"DELETE FROM ordering WHERE id = :order_id"), {"order_id": order_id})
    db.commit()
    return {"message": "Order deleted successfully"}
