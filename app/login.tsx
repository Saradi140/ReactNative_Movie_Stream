import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../src/redux/authSlice';
import { AppDispatch } from '../src/redux/store';
import { colors, spacing } from '../src/styles/theme';
import { LoginFormData, loginSchema } from '../src/utils/validationSchemas';

export default function LoginScreen() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const validateForm = async () => {
    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Partial<LoginFormData> = {};
      error.inner.forEach((err: any) => {
        newErrors[err.path as keyof LoginFormData] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleLogin = async () => {
    if (!(await validateForm())) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await AsyncStorage.setItem('username', formData.username);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      dispatch(loginSuccess(formData.username));
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>StreamBox</Text>
          <Text style={styles.subtitle}>Your Entertainment Hub</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              placeholder="Username"
              placeholderTextColor={colors.textSecondary}
              value={formData.username}
              onChangeText={(text) => {
                setFormData({ ...formData, username: text });
                if (errors.username) setErrors({ ...errors, username: undefined });
              }}
              autoCapitalize="none"
              editable={!loading}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={formData.password}
                onChangeText={(text) => {
                  setFormData({ ...formData, password: text });
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.lg,
    minHeight: '100%',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    backgroundColor: colors.cardBackground,
    color: colors.text,
    padding: spacing.md,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  passwordInput: {
    flex: 1,
    paddingRight: spacing.lg + 8,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  eyeButton: {
    position: 'absolute',
    right: spacing.md,
    padding: spacing.sm,
  },
  eyeIcon: {
    fontSize: 18,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
});
