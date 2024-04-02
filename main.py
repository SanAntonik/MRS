from fastapi import FastAPI, HTTPException


app = FastAPI()


items = []


@app.get("/")
def home():
    return {"Data": "Test"}


@app.get("/items", response_model=list[str])
def get_all(limit: int = 10):
    return items[0:limit]


# @app.get("/items/{item_id}")
# def get_by_id(item_id: int) -> str:
#     item = items[item_id]
#     return item


@app.post("/items")
def create_item(item: str):
    items.append(item)
    return items
