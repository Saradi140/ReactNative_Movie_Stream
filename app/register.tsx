import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTheme } from '../src/hooks/useTheme';
import { loginSuccess } from '../src/redux/authSlice';
import { AppDispatch } from '../src/redux/store';
import { RegistrationFormData, registrationSchema } from '../src/utils/validationSchemas';

export default function RegisterScreen() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<RegistrationFormData>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { colors, spacing } = useTheme();

  const validateForm = async () => {
    try {
      await registrationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Partial<RegistrationFormData> = {};
      error.inner.forEach((err: any) => {
        newErrors[err.path as keyof RegistrationFormData] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleRegister = async () => {
    if (!(await validateForm())) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store user info
      await AsyncStorage.setItem('username', formData.username);
      await AsyncStorage.setItem('email', formData.email);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      
      // Update Redux state
      dispatch(loginSuccess(formData.username));

      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const styles = createStyles(colors, spacing);

  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join StreamBox Today</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              placeholder="Username"
              placeholderTextColor={colors.textSecondary}
              value={formData.username}
              onChangeText={(text) => handleInputChange('username', text)}
              autoCapitalize="none"
              editable={!loading}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
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

          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput, errors.confirmPassword && styles.inputError]}
                placeholder="Confirm Password"
                placeholderTextColor={colors.textSecondary}
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} disabled={loading}>
            <Text style={styles.loginLink}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any, spacing: any) =>
  StyleSheet.create({
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
    backButton: {
      marginBottom: spacing.lg,
    },
    backButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    title: {
      fontSize: 40,
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
      marginTop: spacing.lg,
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
    loginLink: {
      color: colors.primary,
      fontSize: 14,
      textAlign: 'center',
      marginTop: spacing.lg,
      fontWeight: '600',
    },
  });
