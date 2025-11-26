import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout, setUsername } from '../redux/authSlice';
import { AppDispatch } from '../redux/store';

export const useAuthPersist = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

        if (isLoggedIn === 'true' && username) {
          dispatch(setUsername(username));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        dispatch(logout());
      }
    };

    loadAuthState();
  }, [dispatch]);
};
