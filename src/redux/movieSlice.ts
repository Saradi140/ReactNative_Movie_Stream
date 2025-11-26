import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Movie {
  id: string | number;
  title: string;
  [key: string]: any;
}

interface MoviesState {
  allMovies: Movie[];
  favorites: Movie[];
  loading: boolean;
}

const initialState: MoviesState = {
  allMovies: [],
  favorites: [],
  loading: false,
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setMovies: (state, action: PayloadAction<Movie[]>) => {
      state.allMovies = action.payload;
    },
    addFavorite: (state, action: PayloadAction<Movie>) => {
      const exists = state.favorites.find(movie => movie.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string | number>) => {
      state.favorites = state.favorites.filter(movie => movie.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    loadFavorites: (state, action: PayloadAction<Movie[]>) => {
      state.favorites = action.payload;
    },
  },
});

export const { setMovies, addFavorite, removeFavorite, setLoading, loadFavorites } = moviesSlice.actions;
export default moviesSlice.reducer;