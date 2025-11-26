import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import moviesReducer from './movieSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    auth: authReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;