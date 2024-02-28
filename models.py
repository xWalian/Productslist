from typing import Optional

from sqlalchemy import UniqueConstraint
from sqlmodel import SQLModel, Field


class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="product.id")
    quantity: int
    status: str = "pending"
    owner: int = Field(foreign_key="users.id")
    __tablename__ = "ordering"


class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    price: float
    __tablename__ = "product"


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    password: str
    role: str = "customer"
    __table_args__ = (UniqueConstraint("username"),)
    __tablename__ = "users"

# class User(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     name: str
#     email: str
#     password: str
#     role: str = "customer"
#     __table_args__ = (UniqueConstraint("email"),)
#     __tablename__ = "users"




