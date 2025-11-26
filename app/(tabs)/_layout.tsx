import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs, useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../src/hooks/useTheme';
import { logout } from '../../src/redux/authSlice';
import { RootState } from '../../src/redux/store';
import { setTheme } from '../../src/redux/themeSlice';

function HeaderRight() {
  const username = useSelector((state: RootState) => state.auth.username);
  const router = useRouter();
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 12,
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      borderRadius: 8,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      backgroundColor: colors.primary,
    },
    avatarText: {
      color: colors.background,
      fontWeight: '700',
      fontSize: 14,
    },
    nameText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
    },
    subtitleText: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    logoutButton: {
      marginLeft: 10,
      backgroundColor: colors.cardBackground,
      padding: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.06)',
    },
    iconButton: {
      marginLeft: 12,
      padding: 6,
      borderRadius: 8,
      backgroundColor: colors.cardBackground,
    },
  });

  const handleLogout = async () => {
    console.log('HeaderRight: logout pressed');
    try {
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('isLoggedIn');
      console.log('HeaderRight: cleared AsyncStorage keys');
      dispatch(logout());
      console.log('HeaderRight: dispatched logout');
      router.replace('/login');
      console.log('HeaderRight: navigated to /login');
      // Fallback for web if router.replace doesn't navigate for any reason
      try {
        // eslint-disable-next-line no-undef
        if (typeof window !== 'undefined' && window.location) {
          setTimeout(() => { window.location.href = '/'; }, 300);
        }
      } catch (e) {
        // ignore
      }
    } catch (error) {
      console.error('Logout failed', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <View style={styles.headerRight}>
      <View style={styles.nameContainer} accessibilityLabel="username-badge">
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{username ? username.charAt(0).toUpperCase() : 'G'}</Text>
        </View>
        <View>
          <Text style={styles.nameText}>{username || 'Guest'}</Text>
          <Text style={styles.subtitleText}>{username ? 'Member' : 'Guest'}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleLogout} accessibilityLabel="logout-button" style={styles.logoutButton}>
        <Ionicons name="log-out" size={20} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity onPress={async () => {
        const newMode = themeMode === 'dark' ? 'light' : 'dark';
        dispatch(setTheme(newMode));
        await AsyncStorage.setItem('themeMode', newMode);
      }} accessibilityLabel="theme-toggle" style={styles.iconButton}>
        <Ionicons name={themeMode === 'dark' ? 'sunny' : 'moon'} size={18} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();

  const screenOptions = {
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarStyle: {
      backgroundColor: colors.background,
      borderTopColor: colors.cardBackground,
    },
    headerStyle: {
      backgroundColor: colors.background,
      height: 72,
    },
    headerTitleStyle: {
      fontSize: 26,
      fontWeight: '800' as any,
    },
    headerTintColor: colors.text,
    headerRight: () => <HeaderRight />,
  };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}