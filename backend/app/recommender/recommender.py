import pandas as pd

from app.core.db import engine
from app.recommender.utils.find_movie import find_movie
from app.recommender.utils.calc_cosine_sim import calc_cosine_sim


def recommender(input_title, numb_of_recommendations=3):
    """
    Summary:
        Recommends similar movies based on the input movie title.
    Parameters:
        input_title (str): The title of the input movie. Some degree of spelling mistakes is allowed.
        numb_of_recommendations (int): Number of recommended movies to return. Default is 3.
    Returns:
        DataFrame: A DataFrame containing information of the recommended movies.
    """
    df = pd.read_sql_table("item", con=engine)
    movie = find_movie(input_title, df)
    print(movie[["title", "release_year"]])
    id = movie.index[0]
    # Get cosine_sim matrix
    cosine_sim = calc_cosine_sim(df)
    # Get the similarity scores of all movies with the movie above
    sim_scores = list(enumerate(cosine_sim[id]))
    # Sort the similarity scores in descending order
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    # Select the top 'numb_of_recommendations' similar movies
    # (excluding the input movie itself)
    sim_scores = sim_scores[1 : (numb_of_recommendations + 1)]
    print(sim_scores)
    # Extract the indices of the top similar movies
    similar_movies_ids = [i[0] for i in sim_scores]
    print(df.iloc[similar_movies_ids][["title", "id"]])
    # Get database indices
    db_ids = df.iloc[similar_movies_ids]["id"].values.tolist()
    return db_ids
