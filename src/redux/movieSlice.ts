import { createSlice } from '@reduxjs/toolkit';

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    allMovies: [],
    favorites: [],
    loading: false,
  },
  reducers: {
    setMovies: (state, action) => {
      state.allMovies = action.payload;
    },
    addFavorite: (state, action) => {
      const exists = state.favorites.find(movie => movie.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(movie => movie.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    loadFavorites: (state, action) => {
      state.favorites = action.payload;
    },
  },
});

export const { setMovies, addFavorite, removeFavorite, setLoading, loadFavorites } = moviesSlice.actions;
export default moviesSlice.reducer;