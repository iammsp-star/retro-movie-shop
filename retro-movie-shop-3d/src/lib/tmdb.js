// TMDB API Client with Fallback Data for 3D VHS Video Store

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const GENRES = {
  Action: { id: 28, position: [-2.5, 0, 0], color: '#ff0055', label: 'ACTION & ADVENTURE' },
  SciFi: { id: 878, position: [0, 0, -1], color: '#00f3ff', label: 'SCI-FI & CYBERPUNK' },
  Horror: { id: 27, position: [2.5, 0, 0], color: '#ffaa00', label: 'HORROR & THRILLER' },
};

// Rich curated fallback dataset with high-res retro posters and trailer links
export const MOCK_MOVIES = {
  Action: [
    {
      id: 101,
      title: 'Terminator 2: Judgment Day',
      genre: 'Action',
      release_year: '1991',
      vote_average: 8.6,
      overview: 'A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her ten-year-old son John Connor from a more advanced and lethal cyborg, the T-1000.',
      poster_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      trailer_id: 'CRRLbXDHOKE',
      runtime: '137 min',
    },
    {
      id: 102,
      title: 'Die Hard',
      genre: 'Action',
      release_year: '1988',
      vote_average: 8.2,
      overview: "NYPD cop John McClane's plan to reconcile with his estranged wife is derailed when terrorists seize control of the Los Angeles high-rise where she works.",
      poster_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      trailer_id: 'jaJuwKCmJbY',
      runtime: '132 min',
    },
    {
      id: 103,
      title: 'Mad Max 2: The Road Warrior',
      genre: 'Action',
      release_year: '1981',
      vote_average: 7.6,
      overview: 'In the post-apocalyptic Australian wasteland, a cynical vagabond agrees to help a small, gasoline-rich community escape a band of ruthless bandits.',
      poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      trailer_id: 'gLO8RF8xO0o',
      runtime: '95 min',
    },
    {
      id: 104,
      title: 'The Matrix',
      genre: 'Action',
      release_year: '1999',
      vote_average: 8.7,
      overview: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth—the life he knows is the elaborate deception of an evil cyber-intelligence.',
      poster_path: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      trailer_id: 'vKQi3bBA1y8',
      runtime: '136 min',
    },
    {
      id: 105,
      title: 'Predator',
      genre: 'Action',
      release_year: '1987',
      vote_average: 7.9,
      overview: 'A team of commandos on a mission in a Central American jungle find themselves hunted by an extraterrestrial warrior.',
      poster_path: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
      trailer_id: 'X2LTL8KgKv8',
      runtime: '107 min',
    },
  ],
  SciFi: [
    {
      id: 201,
      title: 'Blade Runner 2049',
      genre: 'SciFi',
      release_year: '2017',
      vote_average: 8.0,
      overview: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for thirty years.',
      poster_path: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
      trailer_id: 'gCcx85zbxz4',
      runtime: '164 min',
    },
    {
      id: 202,
      title: 'TRON: Legacy',
      genre: 'SciFi',
      release_year: '2010',
      vote_average: 6.8,
      overview: 'The son of a virtual world designer goes looking for his father and ends up trapped inside the digital world that his father created.',
      poster_path: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80',
      trailer_id: 'L9szn1QQfas',
      runtime: '125 min',
    },
    {
      id: 203,
      title: 'Back to the Future',
      genre: 'SciFi',
      release_year: '1985',
      vote_average: 8.5,
      overview: 'Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean invented by his close friend, the maverick scientist Doc Brown.',
      poster_path: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
      trailer_id: 'qvsgGtivCgs',
      runtime: '116 min',
    },
    {
      id: 204,
      title: 'RoboCop',
      genre: 'SciFi',
      release_year: '1987',
      vote_average: 7.6,
      overview: 'In a dystopic and crime-ridden Detroit, a terminally wounded cop returns to the force as a powerful cyborg haunted by submerged memories.',
      poster_path: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&auto=format&fit=crop&q=80',
      trailer_id: 'zbCbwP6ibR4',
      runtime: '102 min',
    },
    {
      id: 205,
      title: 'Alien',
      genre: 'SciFi',
      release_year: '1979',
      vote_average: 8.5,
      overview: 'The crew of a commercial spacecraft encounter a deadly lifeform after investigating a mysterious transmission on an uncharted planetoid.',
      poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      trailer_id: 'LjLamj-b0I8',
      runtime: '117 min',
    },
  ],
  Horror: [
    {
      id: 301,
      title: 'The Thing',
      genre: 'Horror',
      release_year: '1982',
      vote_average: 8.2,
      overview: 'A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims.',
      poster_path: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
      trailer_id: '5ftmr17M-1A',
      runtime: '109 min',
    },
    {
      id: 302,
      title: 'A Nightmare on Elm Street',
      genre: 'Horror',
      release_year: '1984',
      vote_average: 7.4,
      overview: 'The monstrous spirit of a slain child murderer seeks revenge by invading the dreams of teenage children whose parents burned him alive.',
      poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      trailer_id: 'dCVh4lBfW-c',
      runtime: '91 min',
    },
    {
      id: 303,
      title: 'Halloween',
      genre: 'Horror',
      release_year: '1978',
      vote_average: 7.7,
      overview: 'Fifteen years after murdering his sister on Halloween night 1963, Michael Myers escapes from a mental hospital and returns to the small town of Haddonfield to kill again.',
      poster_path: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
      trailer_id: 'T5ke9IPTIuE',
      runtime: '91 min',
    },
    {
      id: 304,
      title: 'The Shining',
      genre: 'Horror',
      release_year: '1980',
      vote_average: 8.4,
      overview: 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.',
      poster_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      trailer_id: '5Cb3ik6zP2I',
      runtime: '146 min',
    },
    {
      id: 305,
      title: 'Evil Dead II',
      genre: 'Horror',
      release_year: '1987',
      vote_average: 7.7,
      overview: 'The lone survivor of an onslaught of flesh-possessing spirits holes up in a cabin with a group of strangers while the demons continue their attack.',
      poster_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      trailer_id: '6lM3NpeEG24',
      runtime: '84 min',
    },
  ],
};

/**
 * Fetch movies by genre key (Action, SciFi, Horror).
 * Falls back seamlessly to mock retro collection if no API key is set.
 */
export async function getMoviesByGenreKey(genreKey) {
  const genreMeta = GENRES[genreKey];
  if (!genreMeta) return [];

  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreMeta.id}&sort_by=popularity.desc`
      );
      if (res.ok) {
        const data = await res.json();
        return data.results.slice(0, 5).map((item, index) => ({
          id: item.id,
          title: item.title,
          genre: genreKey,
          release_year: item.release_date ? item.release_date.split('-')[0] : 'N/A',
          vote_average: item.vote_average ? Number(item.vote_average.toFixed(1)) : 7.5,
          overview: item.overview || 'No overview available.',
          poster_path: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : MOCK_MOVIES[genreKey][index % 5].poster_url,
          poster_url: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : MOCK_MOVIES[genreKey][index % 5].poster_url,
          trailer_id: MOCK_MOVIES[genreKey][index % 5].trailer_id,
          runtime: '120 min',
        }));
      }
    } catch (err) {
      console.warn('TMDB API fetch failed, using fallback catalog:', err);
    }
  }

  // Fallback to mock catalog
  return MOCK_MOVIES[genreKey] || [];
}

/**
 * Fetch all movies grouped by genre (loads local dataset public/data/movies.json if available)
 */
export async function getAllStoreMovies() {
  // Check if public/data/movies.json is available
  try {
    const res = await fetch('/data/movies.json');
    if (res.ok) {
      const data = await res.json();
      const results = {};
      
      for (const cat of Object.keys(GENRES)) {
        if (data[cat] && data[cat].length > 0) {
          // Take top 6 movies for each 3D shelf
          results[cat] = data[cat].slice(0, 6);
        } else {
          results[cat] = MOCK_MOVIES[cat] || [];
        }
      }
      return results;
    }
  } catch (err) {
    console.info('Local movies.json dataset not found, using TMDB / default catalog.');
  }

  const categories = Object.keys(GENRES);
  const results = {};

  for (const cat of categories) {
    results[cat] = await getMoviesByGenreKey(cat);
  }

  return results;
}
