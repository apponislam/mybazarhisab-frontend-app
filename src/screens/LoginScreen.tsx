import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/authSlice';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Focus States for styling inputs
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Error States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(val)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (val: string) => {
    if (!val) {
      setPasswordError('Password is required');
      return false;
    } else if (val.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = () => {
    setGeneralError('');
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      // Perform simple mock credentials check for demonstration
      if (email.toLowerCase() === 'admin@bazar.com' && password === '123456') {
        dispatch(login(email));
      } else {
        // Fallback: let them login anyway, but show brief success or custom info
        // For development convenience, if they input anything valid, let them log in,
        // but if it's incorrect test credentials, show alert but allow demo bypass or standard flow.
        dispatch(login(email));
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Background Decorative Mesh Gradients */}
      <View style={[styles.gradientCircle, styles.circleTopRight]} />
      <View style={[styles.gradientCircle, styles.circleBottomLeft]} />

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Header section */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>৳</Text>
          </View>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to manage your daily bazar ledger</Text>
        </View>

        {/* Card Form */}
        <View style={[styles.formCard, SHADOWS.sm]}>
          {generalError ? (
            <View style={styles.errorAlert}>
              <Text style={styles.errorAlertText}>{generalError}</Text>
            </View>
          ) : null}

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, emailFocused && styles.inputLabelFocused]}>
              Email Address
            </Text>
            <View
              style={[
                styles.inputWrapper,
                emailFocused && styles.inputWrapperFocused,
                !!emailError && styles.inputWrapperError,
              ]}
            >
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.placeholder}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) validateEmail(text);
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => {
                  setEmailFocused(false);
                  validateEmail(email);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {emailError ? <Text style={styles.fieldErrorText}>{emailError}</Text> : null}
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={[styles.inputLabel, passwordFocused && styles.inputLabelFocused]}>
                Password
              </Text>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputWrapper,
                passwordFocused && styles.inputWrapperFocused,
                !!passwordError && styles.inputWrapperError,
              ]}
            >
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.placeholder}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => {
                  setPasswordFocused(false);
                  validatePassword(password);
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.passwordToggleText}>
                  {showPassword ? 'HIDE' : 'SHOW'}
                </Text>
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.fieldErrorText}>{passwordError}</Text> : null}
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInButton, SHADOWS.md]}
            activeOpacity={0.85}
            onPress={handleLogin}
          >
            <Text style={styles.signInButtonText}>Sign In to Account</Text>
          </TouchableOpacity>
        </View>

        {/* Divider "Or continue with" */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Quick Social Logins */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
            <Text style={styles.socialButtonText}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signUpLinkText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: SPACING.xl,
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  circleTopRight: {
    width: width,
    height: width,
    backgroundColor: COLORS.primary,
    top: -width * 0.3,
    right: -width * 0.3,
  },
  circleBottomLeft: {
    width: width,
    height: width,
    backgroundColor: COLORS.accent,
    bottom: -width * 0.3,
    left: -width * 0.3,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoText: {
    color: COLORS.primary,
    fontSize: SIZES.h2,
    fontWeight: 'bold',
  },
  welcomeTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: SIZES.body - 2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorAlert: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: SIZES.radiusSm,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  errorAlertText: {
    color: COLORS.error,
    fontSize: SIZES.caption + 1,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  inputLabel: {
    fontSize: SIZES.caption + 1,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  inputLabelFocused: {
    color: COLORS.primaryLight,
  },
  inputWrapper: {
    height: 52,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapperFocused: {
    borderColor: COLORS.borderFocus,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  textInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.body,
    paddingVertical: 0,
  },
  passwordToggle: {
    padding: SPACING.sm,
  },
  passwordToggleText: {
    fontSize: SIZES.caption,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  forgotPasswordText: {
    fontSize: SIZES.caption + 1,
    color: COLORS.accent,
    fontWeight: '600',
  },
  fieldErrorText: {
    color: COLORS.error,
    fontSize: SIZES.caption,
    marginTop: 4,
    marginLeft: 4,
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: SIZES.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  signInButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: SIZES.body,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.textMuted,
    fontSize: SIZES.caption + 1,
    paddingHorizontal: SPACING.md,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  socialButton: {
    flex: 1,
    height: 48,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: SIZES.body - 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.body - 2,
  },
  signUpLinkText: {
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: SIZES.body - 2,
  },
});
