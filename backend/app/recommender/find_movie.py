import pandas as pd
from fuzzywuzzy import process

from app.core.db import engine


def find_movie(input):
    """
    Summary:
        Finds a movie in the DataFrame that closely matches the input title. Handles some spelling mistakes
    Parameters:
        input (str): The input movie title.
    Returns:
        DataFrame: A DataFrame row containing information about the matched movie.
    """
    # Load the DataFrame from the SQL table
    df = pd.read_sql_table("item", con=engine)
    all_titles = df["title"].tolist()
    closest_match = process.extractOne(input, all_titles)
    matched_title = closest_match[0]
    return df[df["title"] == matched_title]
