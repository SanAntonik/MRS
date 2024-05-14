from sqlmodel import SQLModel, Session, create_engine, select
import pandas as pd

from crud import create_user
from config import settings
from models import User, UserCreate


engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# Make sure all SQLModel models are imported before initializing DB.
# Otherwise, SQLModel might fail to initialize relationships properly.
# For more details: https://github.com/tiangolo/full-stack-fastapi-template/issues/28
def init_db(session: Session) -> None:
    # This works because the models are already imported and registered from app.models
    SQLModel.metadata.create_all(engine)

    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = create_user(session=session, user_create=user_in)

    # Fill table 'item' with movie data
    df = pd.read_csv(settings.MOVIES_DATA_PATH)
    df["owner_id"] = 1  # set admin to be the owner
    df.to_sql(name="item", con=engine, if_exists="append", index=False)
