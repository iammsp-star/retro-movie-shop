import streamlit as st
import json
import os
import pandas as pd

# ---------------------------------------------------------
# Page Configuration
# ---------------------------------------------------------
st.set_page_config(
    page_title="Retro Movie Shop 📼 | Virtual 3D Video Store",
    page_icon="📼",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------------------------------------------------
# Custom Retro VHS & CRT Styling
# ---------------------------------------------------------
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=VT323&display=swap');

/* Main Background & Font */
.stApp {
    background: radial-gradient(circle at center, #141428 0%, #080811 100%);
    color: #ffffff;
    font-family: 'Outfit', sans-serif;
}

/* Retro CRT Title */
.retro-title {
    font-family: 'VT323', monospace;
    font-size: 3.5rem;
    color: #00f3ff;
    text-shadow: 0 0 10px rgba(0, 243, 255, 0.8), 0 0 20px rgba(0, 243, 255, 0.4);
    letter-spacing: 2px;
    margin-bottom: 0px;
}

.retro-subtitle {
    font-family: 'VT323', monospace;
    font-size: 1.5rem;
    color: #ff007f;
    text-shadow: 0 0 10px rgba(255, 0, 127, 0.8);
}

/* VHS Tape Card Styling */
.vhs-card {
    background: rgba(15, 18, 30, 0.85);
    border: 1px solid rgba(0, 243, 255, 0.3);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
}

.vhs-card:hover {
    transform: translateY(-5px);
    border-color: #ff007f;
    box-shadow: 0 12px 30px rgba(255, 0, 127, 0.4);
}

.vhs-poster {
    border-radius: 8px;
    width: 100%;
    height: 320px;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.1);
}

/* Genre Pill Badges */
.genre-badge {
    background-color: rgba(255, 0, 127, 0.2);
    color: #ff007f;
    border: 1px solid #ff007f;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-family: monospace;
    font-weight: bold;
    display: inline-block;
    margin-right: 5px;
}

.rating-badge {
    background-color: rgba(255, 234, 0, 0.15);
    color: #ffea00;
    border: 1px solid #ffea00;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-family: monospace;
    font-weight: bold;
}
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Load Dataset
# ---------------------------------------------------------
@st.cache_data
def load_movie_catalog():
    json_path = 'public/data/movies.json'
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            all_movies = []
            for cat, movies in data.items():
                all_movies.extend(movies)
            return data, all_movies
    elif os.path.exists('bollywood_meta.csv') and os.path.exists('bollywood.csv'):
        df_meta = pd.read_csv('bollywood_meta.csv')
        df_bolly = pd.read_csv('bollywood.csv')
        merged = pd.merge(df_meta, df_bolly, on='imdb_id', how='inner').dropna(subset=['poster_path'])
        movies_list = []
        for _, row in merged.iterrows():
            movies_list.append({
                "id": str(row['imdb_id']),
                "title": str(row['title_x'] if 'title_x' in row else row['title']),
                "year": int(row['year_of_release']) if pd.notna(row['year_of_release']) else 2000,
                "runtime": f"{int(row['runtime'])} mins" if pd.notna(row['runtime']) else "120 mins",
                "genres": str(row['genres']).split('|') if pd.notna(row['genres']) else ['Bollywood'],
                "posterUrl": str(row['poster_path']),
                "wikiUrl": str(row['wiki_link']) if pd.notna(row['wiki_link']) else "",
                "overview": f"A classic Bollywood film released in {int(row['year_of_release'] if pd.notna(row['year_of_release']) else 2000)}."
            })
        return {"All": movies_list}, movies_list
    else:
        return {}, []

categorized_movies, all_movies = load_movie_catalog()

# ---------------------------------------------------------
# Sidebar Controls & Filters
# ---------------------------------------------------------
st.sidebar.markdown('<p class="retro-subtitle">📼 STORE CONTROLS</p>', unsafe_allow_html=True)

search_query = st.sidebar.text_input("🔍 Search Movie Title", "")

available_categories = ["All Categories", "Action", "SciFi", "Horror"]
selected_category = st.sidebar.selectbox("📂 Shelf Category", available_categories)

years = [m['year'] for m in all_movies if 'year' in m and isinstance(m['year'], int)]
min_year = min(years) if years else 1960
max_year = max(years) if years else 2025

selected_year_range = st.sidebar.slider("📅 Release Year Range", min_value=min_year, max_value=max_year, value=(min_year, max_year))

st.sidebar.markdown("---")
st.sidebar.markdown("### 📜 Employee Reminder")
st.sidebar.warning("⚠️ BE KIND, REWIND!\nLate fees: $2.50 / day for un-rewound tapes.")

# ---------------------------------------------------------
# Filter Logic
# ---------------------------------------------------------
filtered_movies = all_movies

if selected_category != "All Categories" and selected_category in categorized_movies:
    filtered_movies = categorized_movies[selected_category]

if search_query:
    filtered_movies = [m for m in filtered_movies if search_query.lower() in m['title'].lower()]

filtered_movies = [m for m in filtered_movies if min_year <= m.get('year', 2000) <= selected_year_range[1] and m.get('year', 2000) >= selected_year_range[0]]

# ---------------------------------------------------------
# Header & Banner
# ---------------------------------------------------------
col_head1, col_head2 = st.columns([3, 1])

with col_head1:
    st.markdown('<h1 class="retro-title">RETRO MOVIE SHOP 📼</h1>', unsafe_allow_html=True)
    st.markdown('<p class="retro-subtitle">YOUR 1990S VIRTUAL VHS VIDEO RENTAL VAULT</p>', unsafe_allow_html=True)

with col_head2:
    st.metric("Total VHS Tapes in Stock", f"{len(filtered_movies):,}")

st.markdown("---")

# ---------------------------------------------------------
# Movie Grid Rack Display
# ---------------------------------------------------------
if not filtered_movies:
    st.info("No VHS tapes match your search filters. Try resetting the category or year range.")
else:
    # Display in 4 columns grid layout
    cols = st.columns(4)
    for idx, movie in enumerate(filtered_movies[:32]):
        col = cols[idx % 4]
        with col:
            poster_url = movie.get('posterUrl') or movie.get('poster_url') or movie.get('poster_path')
            title = movie.get('title', 'Untitled')
            year = movie.get('year') or movie.get('release_year', 'N/A')
            runtime = movie.get('runtime', '120 mins')
            wiki_url = movie.get('wikiUrl') or movie.get('wiki_url')
            genres = movie.get('genres') or movie.get('genres_list') or []

            st.image(poster_url, use_container_width=True)
            st.markdown(f"### {title}")
            st.caption(f"📅 {year} • ⏱️ {runtime}")

            if genres:
                st.markdown(f'<span class="genre-badge">{genres[0]}</span>', unsafe_allow_html=True)

            with st.expander("📼 Feature Details & Synopsis"):
                st.write(movie.get('overview', 'Classic Bollywood feature film.'))
                if wiki_url:
                    st.link_button("🌐 Read on Wikipedia", wiki_url)
                
                trailer_id = movie.get('trailer_id', 'CRRLbXDHOKE')
                st.video(f"https://www.youtube.com/watch?v={trailer_id}")

# ---------------------------------------------------------
# Footer
# ---------------------------------------------------------
st.markdown("---")
st.markdown(
    '<div style="text-align: center; color: #6b7280; font-family: monospace; font-size: 0.85rem;">'
    '📼 RETRO MOVIE SHOP • Powered by Streamlit & Python • Be Kind, Rewind!'
    '</div>',
    unsafe_allow_html=True
)
