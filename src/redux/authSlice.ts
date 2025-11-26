import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  username: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.isLoggedIn = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.username = null;
      state.isLoggedIn = false;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUsername: (state, action: PayloadAction<string | null>) => {
      state.username = action.payload;
    },
  },
});

export const { setLoading, loginSuccess, logout, setError, setUsername } = authSlice.actions;
export default authSlice.reducer;
