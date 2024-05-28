import re

import nltk
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.core.db import engine


def preprocess(text):
    """
    Summary:
        Preprocesses the input text by removing non-alphanumeric characters,
        converting to lowercase, tokenizing, and filtering out stopwords.
    Parameters:
        text (str): Input text to be preprocessed.
    Returns:
        str: Preprocessed text
    """
    # Handle NaN
    if not isinstance(text, str):
        return ""
    # Remove non-alphanumeric characters, convert to lowercase, and 
    # strip leading/trailing whitespaces
    text = re.sub(r"[^0-9a-zA-Z\s]", "", text, re.I | re.A).lower().strip()
    # Tokenize each sentence using WordPunctTokenizer from NLTK
    wpt = nltk.WordPunctTokenizer() # Get the list of stopwords in English from NLTK
    stop_words = nltk.corpus.stopwords.words("english")
    output = []
    # Tokenize and filter out stopwords to create a new list of tokens
    tokens = wpt.tokenize(text)
    filtered_tokens = [token for token in tokens if token not in stop_words]
    # Join the filtered tokens into a sentence. Then append it to the output list
    output.append(" ".join(filtered_tokens))
    # Join all the processed sentences into a single text string
    return " ".join(output)


def calc_cosine_sim(
    df=None,
    file_path="../backend/app/recommender/data/cosine_sim.npy",
    force_calculation=False
):
    """
    Summary:
        Calculate the cosine similarity matrix for a DataFrame containing movie features.
        If the cosine similarity matrix exists in the specified file path, read and return it.
        Otherwise, perform the calculations, save the matrix to the file, and return it.
    Parameters:
        df (DataFrame): DataFrame containing movie data.
        file_path (str): Path to save/read the cosine similarity matrix.
        force_calculation (bool): Forcefully recalculate matrix. Used when appending new movie.
    Returns:
        ndarray: Cosine similarity matrix for the movie features.
    """
    if not force_calculation:
        print("Calculations are forced")
        print("Calculations aren't forced")
        try:
            cosine_sim = np.load(file_path)
            print("File with cosine_sim matrix is already calculated and found")
            print("Returning it...")
            return cosine_sim
        except FileNotFoundError:
            print("File with cosine_sim matrix not found")
            print("Calculating the matrix...")
    else:
        print("Calculations are forced")

    if df is None:
        df = pd.read_sql_table(
            "item",
            con=engine,
            columns=[
                "franchise",
                "director",
                "top_actors",
                "genres",
                "keywords"
            ]
        )
    else:
        df = df.copy()
    # repeat director once, to give this column more weight
    df["combined"] = (
        df["franchise"].fillna("") + "; " +
        df["director"].fillna("") + "; " +
        df["director"].fillna("") + "; " +
        df["top_actors"].fillna("") + "; " +
        df["genres"].fillna("") + "; " +
        df["keywords"].fillna("")
    )
    df["preproc"] = df["combined"].apply(preprocess)
    cv = CountVectorizer()
    cv_matrix = cv.fit_transform(df["preproc"])
    cosine_sim = cosine_similarity(cv_matrix, cv_matrix)
    np.save(file_path, cosine_sim)
    return cosine_sim
