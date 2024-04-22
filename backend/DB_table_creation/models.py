from datetime import date

from sqlmodel import Field, Relationship, SQLModel
from sqlalchemy import Column, BigInteger


# Shared properties
# TODO replace email str with EmailStr when sqlmodel supports it
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = None


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner")


# Shared properties
class ItemBase(SQLModel):
    title: str
    franchise: str | None = None
    release_date: date | None = None
    runtime: int | None = None
    genres: str | None = None
    production_country: str | None = None
    production_companies: str | None = None
    original_language: str | None = None
    budget: int | None = None
    revenue: int | None = Field(default=None, sa_column=Column(BigInteger()))
    popularity: float | None = None
    vote_average: float | None = None
    vote_count: int | None = None


# # Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    franchise: str | None = None
    release_date: date | None = None
    runtime: int | None = None
    genres: str | None = None
    production_country: str | None = None
    production_companies: str | None = None
    original_language: str | None = None
    budget: int | None = None
    revenue: int | None = Field(default=None, sa_column=Column(BigInteger()))
    popularity: float | None = None
    vote_average: float | None = None
    vote_count: int | None = None
    owner_id: int | None = Field(default=None, foreign_key="user.id", nullable=False)
    owner: User | None = Relationship(back_populates="items")
