# 🎬 TMDb API Setup Guide

StreamBox now uses **The Movie Database (TMDb) API** to fetch real movie data!

## ✅ What's Included

- Popular movies with real posters
- Actual ratings and release dates
- Movie overviews and details
- Popularity scores
- High-quality movie images

## 🔑 Getting Your TMDb API Key

### Step 1: Create a TMDb Account
1. Visit [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Click "Sign Up" in the top right
3. Complete the registration process

### Step 2: Request an API Key
1. Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Click "Create" or "Request an API Key"
3. Select "Developer" as the API type
4. Accept the terms and conditions
5. Fill out the form with your information
6. Your API key will be generated

### Step 3: Add Your API Key to StreamBox
1. Open `src/config/tmdbConfig.ts`
2. Find this line:
   ```typescript
   API_KEY: 'b6801d9ddab7f53e631a50d2f7ddca3d',
   ```
3. Replace the existing key with your own:
   ```typescript
   API_KEY: 'YOUR_NEW_API_KEY_HERE',
   ```
4. Save the file

### Step 4: Restart the App
```bash
npm start
```

The app will now fetch real movies from TMDb!

---

## 📊 API Configuration

File: `src/config/tmdbConfig.ts`

```typescript
export const TMDB_CONFIG = {
  API_KEY: 'your-key-here',           // Your TMDb API key
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
  
  // Available endpoints
  ENDPOINTS: {
    POPULAR_MOVIES: '/movie/popular',       // Popular movies
    TOP_RATED_MOVIES: '/movie/top_rated',   // Top rated movies
    UPCOMING_MOVIES: '/movie/upcoming',     // Upcoming movies
    NOW_PLAYING_MOVIES: '/movie/now_playing',
    MOVIE_DETAILS: '/movie/:id',
    SEARCH_MOVIES: '/search/movie',
  },
};
```

## 🔄 Switching Between Endpoints

To show different movie lists, update the `fetchMovies` function in `app/(tabs)/index.tsx`:

```typescript
// Popular movies (current)
const url = buildApiUrl(TMDB_CONFIG.ENDPOINTS.POPULAR_MOVIES, { page: 1 });

// Top rated movies
const url = buildApiUrl(TMDB_CONFIG.ENDPOINTS.TOP_RATED_MOVIES, { page: 1 });

// Upcoming movies
const url = buildApiUrl(TMDB_CONFIG.ENDPOINTS.UPCOMING_MOVIES, { page: 1 });

// Now playing movies
const url = buildApiUrl(TMDB_CONFIG.ENDPOINTS.NOW_PLAYING_MOVIES, { page: 1 });
```

## 🔍 Features

### Home Screen
- Displays popular movies in 2-column grid
- Shows poster image, title, and rating
- Heart icon to add to favorites
- Tap to view full details

### Details Screen
Now shows:
- ✅ Movie poster
- ✅ Title
- ✅ Rating (0-10)
- ✅ Release date
- ✅ Popularity score
- ✅ Full overview/description
- ✅ Add/Remove from favorites

### Favorites
- Save movies to favorites
- Persist across app sessions
- View all saved movies in dedicated tab
- Remove individual items

## 🔐 API Rate Limits

The free TMDb API includes:
- **40 requests per 10 seconds** per IP
- Unlimited requests per day

This should be more than enough for the app!

## 🚀 Usage Tips

### Pagination
To load more movies, add pagination to the API call:
```typescript
const url = buildApiUrl(TMDB_CONFIG.ENDPOINTS.POPULAR_MOVIES, { 
  page: 1  // Change page number to load more
});
```

### Filtering by Genre
TMDb supports genre filtering:
```typescript
const url = buildApiUrl(TMDB_CONFIG.ENDPOINTS.POPULAR_MOVIES, { 
  with_genres: 28,  // Action movies
  page: 1
});
```

Common genre IDs:
- 28: Action
- 35: Comedy
- 18: Drama
- 27: Horror
- 10749: Romance
- 53: Thriller

## 🐛 Troubleshooting

### API Key Not Working?
- Check if you copied the key correctly
- Ensure there are no extra spaces
- Restart the app completely
- Check if the key is active on TMDb website

### No Movies Loading?
- Check your internet connection
- Verify the API key is correct
- Check the console for error messages
- Ensure you're not exceeding rate limits

### Images Not Showing?
- Check if the image URLs are correct
- Verify TMDb API is returning poster_path
- Check console for image loading errors

## 📚 More Information

- **TMDb API Docs:** https://www.themoviedb.org/settings/api
- **API Reference:** https://developer.themoviedb.org/docs
- **Rate Limits:** https://www.themoviedb.org/faq

---

**Now your StreamBox app has access to real movie data!** 🎬🍿

Enjoy browsing and saving your favorite movies! ⭐
