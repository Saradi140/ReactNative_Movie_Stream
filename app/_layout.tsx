import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { useAuthPersist } from '../src/hooks/useAuthPersist';
import { RootState, store } from '../src/redux/store';

function RootLayoutNav() {
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // Use auth persistence hook
  useAuthPersist();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      await AsyncStorage.getItem('isLoggedIn');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!isLoggedIn && inAuthGroup) {
      router.replace('/login');
    } else if (isLoggedIn && !inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="details" options={{ headerShown: true, title: 'Movie Details' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}