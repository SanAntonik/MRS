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


# TODO replace email str with EmailStr when sqlmodel supports it
class UserRegister(SQLModel):
    email: str
    password: str
    full_name: str | None = None


# Properties to receive via API on update, all are optional
# TODO replace email str with EmailStr when sqlmodel supports it
class UserUpdate(UserBase):
    email: str | None = None  # type: ignore
    password: str | None = None


# TODO replace email str with EmailStr when sqlmodel supports it
class UserUpdateMe(SQLModel):
    full_name: str | None = None
    email: str | None = None


class UpdatePassword(SQLModel):
    current_password: str
    new_password: str


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner")


# Properties to return via API, id is always required
class UserOut(UserBase):
    id: int


class UsersOut(SQLModel):
    data: list[UserOut]
    count: int


# # Shared properties
# class ItemBase(SQLModel):
#     title: str
#     description: str | None = None
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


# # Properties to receive on item creation
# class ItemCreate(ItemBase):
#     title: str
# Properties to receive on item creation
class ItemCreate(ItemBase):
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


# # Properties to receive on item update
# class ItemUpdate(ItemBase):
#     title: str | None = None  # type: ignore
# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = None  # type: ignore
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
# class Item(ItemBase, table=True):
#     id: int | None = Field(default=None, primary_key=True)
#     title: str
#     owner_id: int | None = Field(default=None, foreign_key="user.id", nullable=False)
#     owner: User | None = Relationship(back_populates="items")
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


# Properties to return via API, id is always required
class ItemOut(ItemBase):
    id: int
    owner_id: int


class ItemsOut(SQLModel):
    data: list[ItemOut]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: int | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str