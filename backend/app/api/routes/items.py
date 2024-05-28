from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Item, ItemCreate, ItemOut, ItemsOut, ItemUpdate, Message
from app.recommender.utils.find_movie import find_movie
from app.recommender.utils.calc_cosine_sim import calc_cosine_sim
from app.recommender.recommender import recommender

router = APIRouter()


@router.get("/", response_model=ItemsOut)
def read_items(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve all items from all users.
    """
    count_statement = select(func.count()).select_from(Item)
    count = session.exec(count_statement).one()
    statement = select(Item).offset(skip).limit(limit).order_by(Item.id.desc())
    items = session.exec(statement).all()
    return ItemsOut(data=items, count=count)


@router.get("/{id}", response_model=ItemOut)
def read_item(session: SessionDep, current_user: CurrentUser, id: int) -> Any:
    """
    Get item by ID.
    """
    item = session.get(Item, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    # if not current_user.is_superuser and (item.owner_id != current_user.id):
    #     raise HTTPException(status_code=400, detail="Not enough permissions")
    return item


@router.get("/str/{input_title}", response_model=ItemOut)
def find_item_by_title(session: SessionDep, current_user: CurrentUser, input_title: str) -> Any:
    """
    Get item by title.
    """
    movie_row = find_movie(input_title)
    movie_row_id = movie_row["id"]
    item = session.get(Item, movie_row_id)
    return item


@router.get("/recommender/{input_title}", response_model=ItemsOut)
def recommend_movie(session: SessionDep, current_user: CurrentUser, input_title: str) -> Any:
    """
    Recommend movie by input title.
    """
    movie_ids = recommender(input_title)
    statement = select(Item).where(Item.id.in_(movie_ids))
    items = session.exec(statement).all()
    return ItemsOut(data=items, count=len(items))


@router.post("/", response_model=ItemOut)
async def create_item(
    *, session: SessionDep, current_user: CurrentUser, item_in: ItemCreate
) -> Any:
    """
    Create new item.
    """
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    item = Item.model_validate(item_in, update={"owner_id": current_user.id})
    session.add(item)
    session.commit()
    session.refresh(item)
    calc_cosine_sim(force_calculation=True)
    return item


@router.put("/{id}", response_model=ItemOut)
async def update_item(
    *, session: SessionDep, current_user: CurrentUser, id: int, item_in: ItemUpdate
) -> Any:
    """
    Update an item.
    """
    item = session.get(Item, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    # if not current_user.is_superuser and (item.owner_id != current_user.id):
    #     raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = item_in.model_dump(exclude_unset=True)
    item.sqlmodel_update(update_dict)
    session.add(item)
    session.commit()
    session.refresh(item)
    calc_cosine_sim(force_calculation=True)
    return item


@router.delete("/{id}")
def delete_item(session: SessionDep, current_user: CurrentUser, id: int) -> Message:
    """
    Delete an item.
    """
    item = session.get(Item, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    # if not current_user.is_superuser and (item.owner_id != current_user.id):
    #     raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(item)
    session.commit()
    return Message(message="Item deleted successfully")
