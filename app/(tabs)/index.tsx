import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { buildApiUrl, TMDB_CONFIG } from '../../src/config/tmdbConfig';
import { useTheme } from '../../src/hooks/useTheme';
import { addFavorite, removeFavorite, setLoading, setMovies, setSelectedMovie } from '../../src/redux/movieSlice';
import { RootState } from '../../src/redux/store';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { allMovies, loading, favorites } = useSelector((state: RootState) => state.movies);
  // Responsive card sizing
  const { width } = Dimensions.get('window');
  const { colors, spacing } = useTheme();
  const H_SCREEN_PADDING = spacing.md * 2; // contentContainer padding
  const NUM_COLUMNS = 3;
  const CARD_MARGIN = 8;
  const CARD_WIDTH = Math.floor((width - H_SCREEN_PADDING - CARD_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS);
    const CARD_IMAGE_HEIGHT = Math.round(CARD_WIDTH * 1.2);

  // Modal state + current selected movie from Redux
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const selectedMovie = useSelector((state: RootState) => state.movies.selectedMovie);

  useEffect(() => {
    fetchMovies();
    loadFavoritesFromStorage();
  }, []);

  const loadFavoritesFromStorage = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        // Favorites are already in Redux from previous sessions
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const fetchMovies = async () => {
    dispatch(setLoading(true));
    try {
      // Using The Movie Database (TMDb) API
      const url = buildApiUrl(TMDB_CONFIG.ENDPOINTS.POPULAR_MOVIES, { page: 1 });
      const response = await axios.get(url);
      
      const movies = response.data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        description: movie.overview,
        image: `${TMDB_CONFIG.IMAGE_BASE_URL}${movie.poster_path}`,
        rating: movie.vote_average,
        releaseDate: movie.release_date,
        genre: movie.genre_ids,
        popularity: movie.popularity,
      }));
      
      dispatch(setMovies(movies));
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Compute filtered movies based on release date
  const filteredMovies = useMemo(() => {
    if (!allMovies || !Array.isArray(allMovies)) return [];
    const today = new Date();
    return allMovies.filter((m: any) => {
      if (activeFilter === 'all') return true;
      if (!m.releaseDate) return false;
      const rd = new Date(m.releaseDate);
      const diffDays = (today.getTime() - rd.getTime()) / (1000 * 60 * 60 * 24);

      if (activeFilter === 'upcoming') return rd > today;
      if (activeFilter === 'ongoing') return rd <= today && diffDays <= 90;
      if (activeFilter === 'completed') return rd <= today && diffDays > 90;
      return true;
    });
  }, [allMovies, activeFilter]);

  const renderMovie = ({ item }: any) => {
    const isFavorite = favorites.some((fav: any) => fav.id === item.id);
    
    const handleToggleFavorite = async () => {
      try {
        if (isFavorite) {
          dispatch(removeFavorite(item.id));
          const updatedFavorites = favorites.filter((fav: any) => fav.id !== item.id);
          await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        } else {
          dispatch(addFavorite(item));
          const updatedFavorites = [...favorites, item];
          await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        }
      } catch (error) {
        console.error('Error updating favorites:', error);
      }
    };

    return (
      <TouchableOpacity
        style={[styles.card, { width: CARD_WIDTH, margin: CARD_MARGIN / 2 }]}
        onPress={() => {
  dispatch(setSelectedMovie(item));
  setModalVisible(true);
}}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={[styles.image, { height: CARD_IMAGE_HEIGHT }]} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
          />
          <TouchableOpacity
            style={styles.favoriteIcon}
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? colors.error : colors.text}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={colors.success} />
            <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const styles = createStyles(colors, spacing, CARD_WIDTH, CARD_IMAGE_HEIGHT, CARD_MARGIN);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterButton, activeFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>All</Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, activeFilter === 'upcoming' && styles.filterButtonActive]}
          onPress={() => setActiveFilter('upcoming')}
        >
          <Text style={[styles.filterText, activeFilter === 'upcoming' && styles.filterTextActive]}>Upcoming</Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, activeFilter === 'ongoing' && styles.filterButtonActive]}
          onPress={() => setActiveFilter('ongoing')}
        >
          <Text style={[styles.filterText, activeFilter === 'ongoing' && styles.filterTextActive]}>Ongoing</Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, activeFilter === 'completed' && styles.filterButtonActive]}
          onPress={() => setActiveFilter('completed')}
        >
          <Text style={[styles.filterText, activeFilter === 'completed' && styles.filterTextActive]}>Completed</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredMovies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
      />

      {/* Movie Details Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMovie ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={{ uri: selectedMovie.image }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                
                <View style={styles.modalInfoRow}>
                  <View style={styles.modalInfoItem}>
                    <Ionicons name="star" size={18} color={colors.success} />
                    <Text style={styles.modalInfoLabel}>Rating</Text>
                    <Text style={styles.modalInfoValue}>{selectedMovie.rating.toFixed(1)}</Text>
                  </View>
                  <View style={styles.modalInfoItem}>
                    <Ionicons name="calendar" size={18} color={colors.primary} />
                    <Text style={styles.modalInfoLabel}>Release</Text>
                    <Text style={styles.modalInfoValue}>{selectedMovie.releaseDate?.substring(0, 4) || 'N/A'}</Text>
                  </View>
                  <View style={styles.modalInfoItem}>
                    <Ionicons name="flame" size={18} color={colors.error} />
                    <Text style={styles.modalInfoLabel}>Popularity</Text>
                    <Text style={styles.modalInfoValue}>{Math.round(selectedMovie.popularity)}</Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Overview</Text>
                  <Text style={styles.modalOverview}>{selectedMovie.description}</Text>
                </View>

                <View style={styles.modalButtonContainer}>
                  <Pressable
                    style={[styles.modalButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      const isFav = favorites.some((fav: any) => fav.id === selectedMovie.id);
                      if (isFav) {
                        dispatch(removeFavorite(selectedMovie.id));
                      } else {
                        dispatch(addFavorite(selectedMovie));
                      }
                    }}
                  >
                    <Ionicons 
                      name={favorites.some((fav: any) => fav.id === selectedMovie.id) ? 'heart' : 'heart-outline'} 
                      size={20} 
                      color="white" 
                    />
                    <Text style={styles.modalButtonText}>
                      {favorites.some((fav: any) => fav.id === selectedMovie.id) ? 'Favorited' : 'Add to Favorites'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                    onPress={handleCloseModal}
                  >
                    <Text style={styles.modalButtonText}>Close</Text>
                  </Pressable>
                </View>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}
const createStyles = (colors: any, spacing: any, CARD_WIDTH: number, CARD_IMAGE_HEIGHT: number, CARD_MARGIN: number) =>
  StyleSheet.create({
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
    listContainer: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
    },
    row: {
      justifyContent: 'space-between',
    },
    card: {
      backgroundColor: '#1a1a1a',
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: spacing.md,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
      }),
      borderWidth: 1,
      borderColor: 'rgba(229,9,20,0.15)',
    },
    imageContainer: {
      position: 'relative',
      backgroundColor: '#0f0f0f',
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    image: {
      width: '100%',
      height: CARD_IMAGE_HEIGHT,
      resizeMode: 'cover',
    },
    favoriteIcon: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 24,
      padding: 8,
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.1)',
      zIndex: 10,
    },
    cardContent: {
      padding: spacing.sm,
      backgroundColor: '#0a0a0a',
    },
    title: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
      letterSpacing: 0.2,
    },
    description: {
      fontSize: 11,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      lineHeight: 14,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(229,9,20,0.1)',
      paddingHorizontal: spacing.xs,
      paddingVertical: 3,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    rating: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.success,
      marginLeft: 4,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginBottom: spacing.sm,
    },
    filterButton: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.06)',
      backgroundColor: 'transparent',
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '700',
    },
    filterTextActive: {
      color: colors.background,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.md,
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 16,
      overflow: 'hidden',
      padding: spacing.lg,
      width: '60%',
      maxHeight: '80%',
    },
    modalImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: spacing.md,
      resizeMode: 'cover',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text,
      marginBottom: spacing.sm,
    },
    modalRatingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    modalRating: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.success,
      marginLeft: 6,
    },
    modalOverview: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: spacing.lg,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    modalButton: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: 'white',
    },
    modalInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    modalInfoItem: {
      alignItems: 'center',
      gap: spacing.xs,
    },
    modalInfoLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    modalInfoValue: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    modalSection: {
      marginBottom: spacing.lg,
    },
    modalSectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: spacing.md,
    },
  });