import sys
import pandas as pd
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Function to connect to MongoDB and fetch data based on your schema
def fetch_properties_from_mongodb():
    try:
        # Replace with your MongoDB connection string
        client = MongoClient("mongodb+srv://aditya:aditya@mern-estate-1.xyrgkcg.mongodb.net/?retryWrites=true&w=majority")
        db = client["test"]  # Replace with your database name
        collection = db["listings"]  # Replace with your collection name
       
        # Fetch all property records
        properties = collection.find()
       
        # Convert to a list of dictionaries
        property_list = []
        for prop in properties:
            property_list.append({
                'property_id': str(prop.get('_id')),  # Convert ObjectID to string
                'name': prop.get('name', ''),
                'description': prop.get('description', ''),
                'address': prop.get('address', ''),
                'regularPrice': prop.get('regularPrice', 0),
                'discountPrice': prop.get('discountPrice', 0),
                'bathrooms': prop.get('bathrooms', 0),
                'bedrooms': prop.get('bedrooms', 0),
                'furnished': prop.get('furnished', False),
                'parking': prop.get('parking', False),
                'type': prop.get('type', ''),
                'offer': prop.get('offer', False),
                'imageUrls': prop.get('imageUrls', []),
                'userRef': prop.get('userRef', ''),
            })
       
        return pd.DataFrame(property_list)
   
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        sys.exit(1)

def recommend_properties(user_viewed_property_id, top_n=3):
    # Fetch data from MongoDB
    df = fetch_properties_from_mongodb()

    # If no data is available, return an empty list
    if df.empty:
        return []
   
    # Combine content fields for recommendations
    # df['content'] = (df['name'] + ' ' + df['description'] + ' ' + df['address'] + ' ' +
    #                  df['type'] + ' ' + df['furnished'].astype(str) + ' ' +
    #                  df['parking'].astype(str))
    df['content'] = (df['type'])
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['content'])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    try:
        # Find the index of the property the user viewed
        idx = df.index[df['property_id'] == user_viewed_property_id][0]
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        top_properties = [df.iloc[i[0]].to_dict() for i in sim_scores[1:top_n + 1]]
        return top_properties
    except IndexError:
        print(f"No property found with ID: {user_viewed_property_id}")
        return []

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No property ID provided.")
        sys.exit(1)
   
    try:
        user_viewed_property_id = sys.argv[1]
        recommendations = recommend_properties(user_viewed_property_id)
        print(recommendations)
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)
