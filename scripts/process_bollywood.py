import pandas as pd
import json
import os

# Load dataset CSV files
df_meta = pd.read_csv('bollywood_meta.csv')
df_bolly = pd.read_csv('bollywood.csv')

# Merge metadata and poster links on imdb_id
merged = pd.merge(df_meta, df_bolly, on='imdb_id', how='inner', suffixes=('', '_dup'))

# Clean missing poster paths
merged_clean = merged.dropna(subset=['poster_path']).copy()

# Deduplicate by imdb_id
merged_clean = merged_clean.drop_duplicates(subset=['imdb_id'])

print(f"Total clean movies with valid posters: {len(merged_clean)}")

def map_to_genre_category(genres_str):
    if pd.isna(genres_str):
        return 'SciFi'
    genres = [g.strip() for g in str(genres_str).split('|')]
    
    # Priority mapping to Action, SciFi, Horror categories
    if any(g in genres for g in ['Action', 'Crime', 'Thriller', 'Adventure']):
        return 'Action'
    elif any(g in genres for g in ['Horror', 'Mystery', 'Fantasy', 'Sci-Fi']):
        return 'Horror'
    else:
        # Romance, Drama, Comedy, Musical fall into SciFi/Drama shelf
        return 'SciFi'

merged_clean['category'] = merged_clean['genres'].apply(map_to_genre_category)

# Build JSON structure for frontend
movies_data = {}
for category, group in merged_clean.groupby('category'):
    # Sort by year
    group_sorted = group.sort_values(by='year_of_release', ascending=False)
    movies_data[category] = []
    
    for _, row in group_sorted.iterrows():
        poster_url = str(row['poster_path']).strip()
        if not poster_url.startswith('http'):
            continue
            
        title = str(row['title_x'] if 'title_x' in row else row['title']).strip()
        year = int(row['year_of_release']) if pd.notna(row['year_of_release']) else 2000
        
        runtime_val = pd.to_numeric(row['runtime'], errors='coerce')
        runtime = f"{int(runtime_val)} min" if pd.notna(runtime_val) and runtime_val > 0 else "130 min"
        
        genres = [g.strip() for g in str(row['genres']).split('|')] if pd.notna(row['genres']) else ['Bollywood']
        wiki_url = str(row['wiki_link']) if pd.notna(row['wiki_link']) else ""
        
        movies_data[category].append({
            "id": str(row['imdb_id']),
            "title": title,
            "genre": category,
            "release_year": str(year),
            "vote_average": 8.2,
            "overview": f"A classic Bollywood {genres[0]} film released in {year}. Featuring an iconic story, timeless music, and memorable Indian cinema moments.",
            "poster_path": poster_url,
            "poster_url": poster_url,
            "runtime": runtime,
            "genres_list": genres,
            "wiki_url": wiki_url,
            "trailer_id": "CRRLbXDHOKE"  # Default YouTube trailer embed
        })

# Ensure public/data directory exists
os.makedirs('public/data', exist_ok=True)

with open('public/data/movies.json', 'w', encoding='utf-8') as f:
    json.dump(movies_data, f, indent=2)

print("Generated public/data/movies.json successfully!")
for cat, lst in movies_data.items():
    print(f" - {cat}: {len(lst)} movies")
