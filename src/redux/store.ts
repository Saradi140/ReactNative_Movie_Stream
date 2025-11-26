import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './movieSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;