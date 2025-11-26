/**
 * The Movie Database (TMDb) API Configuration
 * 
 * To get your own API key:
 * 1. Go to https://www.themoviedb.org/settings/api
 * 2. Sign up for a free account
 * 3. Request an API key
 * 4. Copy your key and replace the TMDB_API_KEY below
 */

export const TMDB_CONFIG = {
  // Replace this with your own API key from https://www.themoviedb.org/settings/api
  API_KEY: 'b6801d9ddab7f53e631a50d2f7ddca3d',
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
  
  // Endpoints
  ENDPOINTS: {
    POPULAR_MOVIES: '/movie/popular',
    TOP_RATED_MOVIES: '/movie/top_rated',
    UPCOMING_MOVIES: '/movie/upcoming',
    NOW_PLAYING_MOVIES: '/movie/now_playing',
    MOVIE_DETAILS: '/movie/:id',
    SEARCH_MOVIES: '/search/movie',
  },
  
  // Default query parameters
  DEFAULTS: {
    LANGUAGE: 'en-US',
    PAGE: 1,
    REGION: 'US',
  },
};

/**
 * Build full image URL for movie posters
 * @param posterPath - The poster path from TMDb API
 * @returns Full image URL
 */
export const getImageUrl = (posterPath: string | null): string => {
  if (!posterPath) {
    return 'https://via.placeholder.com/500x750?text=No+Image';
  }
  return `${TMDB_CONFIG.IMAGE_BASE_URL}${posterPath}`;
};

/**
 * Build API URL with parameters
 * @param endpoint - The endpoint path
 * @param params - Additional query parameters
 * @returns Full API URL
 */
export const buildApiUrl = (endpoint: string, params?: Record<string, any>): string => {
  const url = `${TMDB_CONFIG.BASE_URL}${endpoint}?api_key=${TMDB_CONFIG.API_KEY}`;
  const queryParams = new URLSearchParams();
  
  // Add default parameters
  queryParams.append('language', TMDB_CONFIG.DEFAULTS.LANGUAGE);
  
  // Add custom parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });
  }
  
  return `${url}&${queryParams.toString()}`;
};
