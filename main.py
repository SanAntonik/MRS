#!/usr/bin/env python3
import frontend
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


# Dummy movie data
movies = [
    {"id": 1, "title": "The Shawshank Redemption", "genre": "Drama"},
    {"id": 2, "title": "The Godfather", "genre": "Crime"},
    {"id": 3, "title": "Star Wars: Episode VI – Return of the Jedi", "genre": "Sci-Fi, Action"},
]
next_id = 4  # Next available id


class Movie(BaseModel):
    id: int
    title: str = None
    genre: str = None


# Routes
@app.get("/")
def root():
    return {"message": "Welcome to the Movie Recommendation System API"}


@app.get("/movies", response_model=list[Movie])
def get_all():
    return movies


@app.get("/movies/{movie_id}", response_model=Movie)
def get_by_id(movie_id: int) -> Movie:
    for m in movies:
        if m["id"] == movie_id:
            return m
    raise HTTPException(status_code=404, detail=f"Movie with id={movie_id} not found")


@app.post("/movies")
def create(movie: Movie):
    global next_id
    new_movie = {"id": next_id, "title": movie.title, "genre": movie.genre}
    movies.append(new_movie)
    next_id += 1
    return new_movie


@app.put("/movies/{movie_id}")
def update(movie_id: int, new_movie_info: Movie):
    for m in movies:
        if m["id"] == movie_id:
            m["title"] = new_movie_info.title
            m["genre"] = new_movie_info.genre
            return {"message": "Movie updated successfully"}
    raise HTTPException(status_code=404, detail=f"Movie with id={movie_id} not found")


@app.delete("/movies/{movie_id}")
def delete(movie_id: int):
    global movies
    movies = [m for m in movies if m["id"] != movie_id]
    return {"message": "Movie deleted successfully"}


frontend.init(app)


if __name__ == '__main__':
    print('Please start the app with the "uvicorn" command as shown in the start.sh script')
