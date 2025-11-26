import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../src/redux/movieSlice';
import { RootState } from '../src/redux/store';
import { colors, spacing } from '../src/styles/theme';

export default function DetailsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const [movie, setMovie] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const favorites = useSelector((state: RootState) => state.movies.favorites);

  useEffect(() => {
    try {
      if (params.movie && typeof params.movie === 'string') {
        const parsedMovie = JSON.parse(params.movie);
        setMovie(parsedMovie);
        
        // Check if it's a favorite
        const favorite = favorites.some((fav: any) => fav.id === parsedMovie.id);
        setIsFavorite(favorite);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load item details');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [params.movie, favorites]);

  const handleToggleFavorite = async () => {
    if (!movie) return;

    try {
      if (isFavorite) {
        dispatch(removeFavorite(movie.id));
        setIsFavorite(false);
      } else {
        dispatch(addFavorite(movie));
        setIsFavorite(true);
      }
      
      // Save to AsyncStorage
      const allFavorites = favorites.map((fav: any) => 
        fav.id === movie.id ? movie : fav
      );
      if (!isFavorite) {
        allFavorites.push(movie);
      } else {
        allFavorites.filter((fav: any) => fav.id !== movie.id);
      }
      await AsyncStorage.setItem('favorites', JSON.stringify(allFavorites));
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? colors.error : colors.text}
          />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: movie.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>

        {movie.rating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color={colors.success} />
            <Text style={styles.rating}>{movie.rating.toFixed(1)}/10 Rating</Text>
          </View>
        )}

        {movie.releaseDate && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Release Date:</Text>
            <Text style={styles.infoValue}>{movie.releaseDate}</Text>
          </View>
        )}

        {movie.popularity !== undefined && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Popularity:</Text>
            <Text style={styles.infoValue}>{Math.round(movie.popularity)}</Text>
          </View>
        )}

        {movie.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.description}>{movie.description}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.actionButton, isFavorite && styles.favoriteButton]}
          onPress={handleToggleFavorite}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? colors.error : colors.background}
          />
          <Text style={[styles.actionButtonText, isFavorite && styles.favoriteButtonText]}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.cardBackground,
  },
  backButton: {
    padding: spacing.sm,
  },
  favoriteButton: {
    padding: spacing.sm,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rating: {
    fontSize: 16,
    color: colors.success,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBackground,
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
  },
  section: {
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  ingredient: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  instruction: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.lg,
    gap: spacing.sm,
  },
  actionButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteButtonText: {
    color: colors.text,
  },
});
