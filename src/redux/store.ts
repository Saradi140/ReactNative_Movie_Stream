import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import moviesReducer from './movieSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;