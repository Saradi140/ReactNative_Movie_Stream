import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setMovies } from '../../src/redux/movieSlice';
import { colors, spacing } from '../../src/styles/theme';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { allMovies, loading } = useSelector((state: any) => state.movies);
  const [username, setUsername] = useState('');

  useEffect(() => {
    loadUsername();
    fetchMovies();
  }, []);

  const loadUsername = async () => {
    const name = await AsyncStorage.getItem('username');
    setUsername(name || 'User');
  };

  const fetchMovies = async () => {
    dispatch(setLoading(true));
    try {
      // Using DummyJSON recipes as "movies"
      const response = await axios.get('https://dummyjson.com/recipes?limit=20');
      const movies = response.data.recipes.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.name,
        description: `${recipe.cuisine} • ${recipe.difficulty}`,
        image: recipe.image,
        rating: recipe.rating,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTimeMinutes,
        cookTime: recipe.cookTimeMinutes,
      }));
      dispatch(setMovies(movies));
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('username');
    router.replace('/login');
  };

  const renderMovie = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/details', params: { movie: JSON.stringify(item) } })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={colors.success} />
          <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={allMovies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBackground,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  listContainer: {
    padding: spacing.sm,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    margin: spacing.sm,
    overflow: 'hidden',
    maxWidth: '48%',
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: colors.text,
    marginLeft: spacing.xs,
  },
});