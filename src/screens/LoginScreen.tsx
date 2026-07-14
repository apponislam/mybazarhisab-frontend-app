import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { useAppDispatch } from '../redux/hooks';
import { login } from '../redux/features/auth/authSlice';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  User,
  Phone,
  ArrowLeft,
  CheckCircle,
  X,
  Camera,
  Plus,
} from '../components/CustomIcon';

const { width } = Dimensions.get('window');

type ScreenState =
  | 'login'
  | 'register'
  | 'forgot-email'
  | 'forgot-otp'
  | 'forgot-newpass'
  | 'forgot-success';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const [screen, setScreen] = useState<ScreenState>('login');

  // Input Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState(30);

  // Focus & UI States
  const [fN, setFN] = useState(false);
  const [fE, setFE] = useState(false);
  const [fPh, setFPh] = useState(false);
  const [fP, setFP] = useState(false);
  const [fR, setFR] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoSelected, setPhotoSelected] = useState(false);

  // OTP Input references
  const otpRefs = useRef<(TextInput | null)[]>([]);

  // Timer for OTP screen
  useEffect(() => {
    if (screen !== 'forgot-otp' || timer <= 0) return;
    const interval = setInterval(() => setTimer(v => v - 1), 1000);
    return () => clearInterval(interval);
  }, [screen, timer]);

  // Handle Login submission
  const handleLoginSubmit = () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(login({ email, token: 'mock-jwt-token' }));
    }, 1500);
  };

  // Handle Register submission
  const handleRegisterSubmit = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      password.length < 8 ||
      password !== repeatPassword
    )
      return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(login({ email, token: 'mock-jwt-token' }));
    }, 1600);
  };

  // Handle Send OTP click
  const handleSendOtp = () => {
    if (!forgotEmail.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTimer(30);
      setScreen('forgot-otp');
    }, 1500);
  };

  // Handle OTP verification
  const handleVerifyOtp = () => {
    const filled = otp.every(d => d !== '');
    if (!filled) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setScreen('forgot-newpass');
    }, 1500);
  };

  // Handle Reset Password submission
  const handleResetPassword = () => {
    if (password.length < 8 || password !== repeatPassword) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setScreen('forgot-success');
    }, 1500);
  };

  // Password strength calculation helper
  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return 0;
    if (pass.length < 6) return 1; // Weak
    if (pass.length < 10) return 2; // Fair
    return 3; // Strong
  };

  const getStrengthLabel = (strength: number) => {
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Strong';
    return '';
  };

  const getStrengthColor = (strength: number) => {
    if (strength === 1) return COLORS.error;
    if (strength === 2) return COLORS.primary;
    if (strength === 3) return COLORS.success;
    return 'transparent';
  };

  // Back Button Component
  const renderBackButton = (onPress: () => void, label = 'Back') => (
    <TouchableOpacity
      onPress={onPress}
      style={styles.backButton}
      activeOpacity={0.7}
    >
      <ArrowLeft color={COLORS.textSecondary} size={16} />
      <Text style={styles.backButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  // Step Indicators Component (OTP flow)
  const renderStepDots = (current: number) => (
    <View style={styles.dotsRow}>
      {[0, 1, 2].map(i => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              width: i === current ? 20 : 6,
              backgroundColor:
                i <= current ? COLORS.primary : 'rgba(232,160,32,0.2)',
            },
          ]}
        />
      ))}
    </View>
  );

  // 1. SIGN IN SCREEN
  const renderLoginScreen = () => (
    <View style={styles.cardWrapper}>
      {/* Top logo & app title */}
      <View style={styles.logoHeader}>
        <View style={styles.outerLogoBox}>
          <BookOpen color={COLORS.primary} size={28} />
        </View>
        <Text style={styles.appTitle}>
          My Bazar <Text style={{ color: COLORS.primary }}>Hisab</Text>
        </Text>
        <Text style={styles.appSubtitle}>Sign in to your account</Text>
      </View>

      {/* Main card */}
      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle}>Welcome back</Text>
        <Text style={styles.cardSubtitle}>
          Enter your credentials to continue
        </Text>

        {/* Email Field */}
        <View style={styles.fieldBox}>
          <Text style={styles.fieldLabel}>Email Address</Text>
          <View style={[styles.inputWrapper, fE && styles.inputWrapperFocused]}>
            <Mail
              color={COLORS.textSecondary}
              size={18}
              style={styles.fieldIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.placeholder}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFE(true)}
              onBlur={() => setFE(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Password Field */}
        <View style={styles.fieldBox}>
          <View style={styles.rowJustified}>
            <Text style={styles.fieldLabel}>Password</Text>
            <TouchableOpacity
              onPress={() => setScreen('forgot-email')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.inputWrapper, fP && styles.inputWrapperFocused]}>
            <Lock
              color={COLORS.textSecondary}
              size={18}
              style={styles.fieldIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="••••••••"
              placeholderTextColor={COLORS.placeholder}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFP(true)}
              onBlur={() => setFP(false)}
              secureTextEntry={!showPw}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPw(!showPw)}
              activeOpacity={0.7}
            >
              {showPw ? (
                <EyeOff color={COLORS.textSecondary} size={18} />
              ) : (
                <Eye color={COLORS.textSecondary} size={18} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign In Primary Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLoginSubmit}
          disabled={loading || !email.trim() || !password.trim()}
          activeOpacity={0.8}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={COLORS.textOnPrimary} size="small" />
              <Text style={styles.primaryButtonText}>Signing in…</Text>
            </View>
          ) : (
            <Text style={styles.primaryButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>New here?</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Secondary Account creation button */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setPassword('');
            setRepeatPassword('');
            setScreen('register');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 2. CREATE ACCOUNT SCREEN
  const renderRegisterScreen = () => {
    const pStrength = getPasswordStrength(password);
    const mismatch = repeatPassword.length > 0 && password !== repeatPassword;

    return (
      <View style={styles.fullScreenContent}>
        {renderBackButton(() => setScreen('login'))}

        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>Create Account</Text>
          <Text style={styles.screenSubtitle}>
            Fill in your details to get started
          </Text>
        </View>

        {/* Mock Photo Picker */}
        <View style={styles.photoPickerContainer}>
          <TouchableOpacity
            style={styles.photoPickerCircle}
            onPress={() => setPhotoSelected(!photoSelected)}
            activeOpacity={0.8}
          >
            {photoSelected ? (
              <View
                style={[
                  styles.avatarTextCircle,
                  { backgroundColor: COLORS.accent },
                ]}
              >
                <Text style={styles.avatarTextLabel}>AI</Text>
              </View>
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User color={COLORS.textSecondary} size={30} />
                <Text style={styles.photoText}>Photo</Text>
              </View>
            )}
            <View style={styles.photoBadge}>
              {photoSelected ? (
                <X color={COLORS.textOnPrimary} size={12} />
              ) : (
                <Camera color={COLORS.textOnPrimary} size={14} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View
              style={[styles.inputWrapper, fN && styles.inputWrapperFocused]}
            >
              <User
                color={COLORS.textSecondary}
                size={18}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Ahmed Hassan"
                placeholderTextColor={COLORS.placeholder}
                value={name}
                onChangeText={setName}
                onFocus={() => setFN(true)}
                onBlur={() => setFN(false)}
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View
              style={[styles.inputWrapper, fE && styles.inputWrapperFocused]}
            >
              <Mail
                color={COLORS.textSecondary}
                size={18}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="ahmed@email.com"
                placeholderTextColor={COLORS.placeholder}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFE(true)}
                onBlur={() => setFE(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <View
              style={[styles.inputWrapper, fPh && styles.inputWrapperFocused]}
            >
              <Phone
                color={COLORS.textSecondary}
                size={18}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="+880 1711 234567"
                placeholderTextColor={COLORS.placeholder}
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setFPh(true)}
                onBlur={() => setFPh(false)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View
              style={[styles.inputWrapper, fP && styles.inputWrapperFocused]}
            >
              <Lock
                color={COLORS.textSecondary}
                size={18}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Min. 8 characters"
                placeholderTextColor={COLORS.placeholder}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFP(true)}
                onBlur={() => setFP(false)}
                secureTextEntry={!showPw}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPw(!showPw)}
                activeOpacity={0.7}
              >
                {showPw ? (
                  <EyeOff color={COLORS.textSecondary} size={18} />
                ) : (
                  <Eye color={COLORS.textSecondary} size={18} />
                )}
              </TouchableOpacity>
            </View>

            {/* Password strength meter */}
            {password.length > 0 && (
              <View style={styles.strengthMeterRow}>
                <View style={styles.strengthBars}>
                  {[1, 2, 3].map(l => (
                    <View
                      key={l}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor:
                            pStrength >= l
                              ? getStrengthColor(pStrength)
                              : 'rgba(232,160,32,0.15)',
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text
                  style={[
                    styles.strengthText,
                    { color: getStrengthColor(pStrength) },
                  ]}
                >
                  {getStrengthLabel(pStrength)}
                </Text>
              </View>
            )}
          </View>

          {/* Repeat Password */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Repeat Password</Text>
            <View
              style={[
                styles.inputWrapper,
                fR && styles.inputWrapperFocused,
                mismatch && styles.inputWrapperError,
              ]}
            >
              <Lock
                color={COLORS.textSecondary}
                size={18}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Re-enter password"
                placeholderTextColor={COLORS.placeholder}
                value={repeatPassword}
                onChangeText={setRepeatPassword}
                onFocus={() => setFR(true)}
                onBlur={() => setFR(false)}
                secureTextEntry={!showRepeat}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowRepeat(!showRepeat)}
                activeOpacity={0.7}
              >
                {showRepeat ? (
                  <EyeOff color={COLORS.textSecondary} size={18} />
                ) : (
                  <Eye color={COLORS.textSecondary} size={18} />
                )}
              </TouchableOpacity>
            </View>
            {mismatch && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 10 }]}
            onPress={handleRegisterSubmit}
            disabled={
              loading ||
              !name.trim() ||
              !email.trim() ||
              !phone.trim() ||
              password.length < 8 ||
              password !== repeatPassword
            }
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={COLORS.textOnPrimary} size="small" />
                <Text style={styles.primaryButtonText}>Creating…</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footerLinkText}>
            Already have an account?{' '}
            <Text
              style={{ color: COLORS.primary }}
              onPress={() => setScreen('login')}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    );
  };

  // 3. FORGOT PASSWORD - EMAIL INPUT
  const renderForgotEmailScreen = () => (
    <View style={styles.fullScreenContent}>
      {renderBackButton(() => setScreen('login'))}
      {renderStepDots(0)}

      <View style={styles.screenHeader}>
        <View style={styles.iconCircleHeader}>
          <Mail color={COLORS.primary} size={24} />
        </View>
        <Text style={styles.screenTitle}>Forgot Password?</Text>
        <Text style={styles.screenSubtitle}>
          Enter your registered email and we will send a code.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.fieldBox}>
          <Text style={styles.fieldLabel}>Email Address</Text>
          <View style={[styles.inputWrapper, fE && styles.inputWrapperFocused]}>
            <Mail
              color={COLORS.textSecondary}
              size={18}
              style={styles.fieldIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.placeholder}
              value={forgotEmail}
              onChangeText={setForgotEmail}
              onFocus={() => setFE(true)}
              onBlur={() => setFE(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, styles.bottomFixedBtn]}
          onPress={handleSendOtp}
          disabled={loading || !forgotEmail.trim()}
          activeOpacity={0.8}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={COLORS.textOnPrimary} size="small" />
              <Text style={styles.primaryButtonText}>Sending…</Text>
            </View>
          ) : (
            <Text style={styles.primaryButtonText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // 4. FORGOT PASSWORD - OTP
  const renderForgotOtpScreen = () => {
    const filled = otp.every(d => d !== '');

    const handleOtpChange = (i: number, val: string) => {
      const cleanVal = val.replace(/\D/g, '').slice(-1);
      const nextOtp = [...otp];
      nextOtp[i] = cleanVal;
      setOtp(nextOtp);

      // Auto focus next
      if (cleanVal && i < 5) {
        otpRefs.current[i + 1]?.focus();
      }
    };

    const handleOtpKeyPress = (i: number, key: string) => {
      if (key === 'Backspace' && !otp[i] && i > 0) {
        otpRefs.current[i - 1]?.focus();
      }
    };

    return (
      <View style={styles.fullScreenContent}>
        {renderBackButton(() => setScreen('forgot-email'))}
        {renderStepDots(1)}

        <View style={styles.screenHeader}>
          <View style={styles.iconCircleHeader}>
            <Text style={{ fontSize: 20, color: COLORS.primary }}>🔐</Text>
          </View>
          <Text style={styles.screenTitle}>Enter OTP</Text>
          <Text style={styles.screenSubtitle}>
            6-digit code sent to{' '}
            <Text style={{ color: COLORS.primary, fontWeight: '500' }}>
              {forgotEmail}
            </Text>
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* OTP Code Box Grid */}
          <View style={styles.otpGrid}>
            {otp.map((digit, i) => (
              <View key={i} style={styles.otpInputBox}>
                <TextInput
                  ref={el => {
                    otpRefs.current[i] = el;
                  }}
                  style={[
                    styles.otpTextInput,
                    {
                      borderColor: digit ? COLORS.borderFocus : COLORS.border,
                    },
                  ]}
                  value={digit}
                  onChangeText={val => handleOtpChange(i, val)}
                  onKeyPress={({ nativeEvent }) =>
                    handleOtpKeyPress(i, nativeEvent.key)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              </View>
            ))}
          </View>

          {/* Timer text */}
          <View style={styles.timerWrapper}>
            {timer > 0 ? (
              <Text style={styles.timerText}>
                Resend in{' '}
                <Text
                  style={{ color: COLORS.primary, fontFamily: 'monospace' }}
                >
                  00:{String(timer).padStart(2, '0')}
                </Text>
              </Text>
            ) : (
              <TouchableOpacity
                onPress={() => setTimer(30)}
                activeOpacity={0.7}
              >
                <Text style={styles.resendLink}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, styles.bottomFixedBtn]}
            onPress={handleVerifyOtp}
            disabled={loading || !filled}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={COLORS.textOnPrimary} size="small" />
                <Text style={styles.primaryButtonText}>Verifying…</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Verify Code</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // 5. FORGOT PASSWORD - NEW PASSWORD INPUT
  const renderForgotNewPassScreen = () => {
    const pStrength = getPasswordStrength(password);
    const mismatch = repeatPassword.length > 0 && password !== repeatPassword;

    return (
      <View style={styles.fullScreenContent}>
        {renderBackButton(() => setScreen('forgot-otp'))}
        {renderStepDots(2)}

        <View style={styles.screenHeader}>
          <View style={styles.iconCircleHeader}>
            <Text style={{ fontSize: 20, color: COLORS.primary }}>🔑</Text>
          </View>
          <Text style={styles.screenTitle}>New Password</Text>
          <Text style={styles.screenSubtitle}>
            Create a strong password. At least 8 characters.
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* New Password */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>New Password</Text>
            <View
              style={[styles.inputWrapper, fP && styles.inputWrapperFocused]}
            >
              <Lock
                color={COLORS.textSecondary}
                size={18}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Min. 8 characters"
                placeholderTextColor={COLORS.placeholder}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFP(true)}
                onBlur={() => setFP(false)}
                secureTextEntry={!showPw}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPw(!showPw)}
                activeOpacity={0.7}
              >
                {showPw ? (
                  <EyeOff color={COLORS.textSecondary} size={18} />
                ) : (
                  <Eye color={COLORS.textSecondary} size={18} />
                )}
              </TouchableOpacity>
            </View>

            {/* Password strength meter */}
            {password.length > 0 && (
              <View style={styles.strengthMeterRow}>
                <View style={styles.strengthBars}>
                  {[1, 2, 3].map(l => (
                    <View
                      key={l}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor:
                            pStrength >= l
                              ? getStrengthColor(pStrength)
                              : 'rgba(232,160,32,0.15)',
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text
                  style={[
                    styles.strengthText,
                    { color: getStrengthColor(pStrength) },
                  ]}
                >
                  {getStrengthLabel(pStrength)}
                </Text>
              </View>
            )}
          </View>

          {/* Repeat Password */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Repeat Password</Text>
            <View
              style={[
                styles.inputWrapper,
                fR && styles.inputWrapperFocused,
                mismatch && styles.inputWrapperError,
              ]}
            >
              <Lock
                color={COLORS.textSecondary}
                size={18}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Re-enter password"
                placeholderTextColor={COLORS.placeholder}
                value={repeatPassword}
                onChangeText={setRepeatPassword}
                onFocus={() => setFR(true)}
                onBlur={() => setFR(false)}
                secureTextEntry={!showRepeat}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowRepeat(!showRepeat)}
                activeOpacity={0.7}
              >
                {showRepeat ? (
                  <EyeOff color={COLORS.textSecondary} size={18} />
                ) : (
                  <Eye color={COLORS.textSecondary} size={18} />
                )}
              </TouchableOpacity>
            </View>
            {mismatch && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, styles.bottomFixedBtn]}
            onPress={handleResetPassword}
            disabled={
              loading || mismatch || password.length < 8 || !repeatPassword
            }
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={COLORS.textOnPrimary} size="small" />
                <Text style={styles.primaryButtonText}>Saving…</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // 6. FORGOT PASSWORD - RESET SUCCESS SCREEN
  const renderForgotSuccessScreen = () => (
    <View
      style={[
        styles.fullScreenContent,
        { justifyContent: 'center', alignItems: 'center' },
      ]}
    >
      <View style={styles.successIconOuterCircle}>
        <CheckCircle color={COLORS.primary} size={48} />
      </View>

      <Text style={styles.successTitle}>Password Reset!</Text>
      <Text style={styles.successSubtitle}>
        Your password has been updated. You can now sign in.
      </Text>

      <TouchableOpacity
        style={[styles.primaryButton, { width: '100%', marginTop: 20 }]}
        onPress={() => {
          setEmail(forgotEmail);
          setPassword('');
          setScreen('login');
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );

  const getActiveScreenRenderer = () => {
    switch (screen) {
      case 'login':
        return renderLoginScreen();
      case 'register':
        return renderRegisterScreen();
      case 'forgot-email':
        return renderForgotEmailScreen();
      case 'forgot-otp':
        return renderForgotOtpScreen();
      case 'forgot-newpass':
        return renderForgotNewPassScreen();
      case 'forgot-success':
        return renderForgotSuccessScreen();
      default:
        return renderLoginScreen();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Mesh Glow Background */}
      <View style={styles.topAccentBar} />
      <View style={styles.bottomAccentBar} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          screen !== 'login' && {
            justifyContent: 'flex-start',
            paddingTop: 60,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {getActiveScreenRenderer()}
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
    paddingBottom: SPACING.xl,
  },
  topAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.primary,
    opacity: 0.5,
  },
  bottomAccentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.primary,
    opacity: 0.5,
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  logoHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  outerLogoBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
  },
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    padding: 24,
    width: '100%',
    ...SHADOWS.lg,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    fontFamily: 'sans-serif',
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
    fontFamily: 'sans-serif',
  },
  fieldBox: {
    marginBottom: 16,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(245, 237, 226, 0.8)',
    marginBottom: 8,
    fontFamily: 'sans-serif',
  },
  inputWrapper: {
    height: 52,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapperFocused: {
    borderColor: COLORS.borderFocus,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  fieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    paddingVertical: 0,
    fontFamily: 'sans-serif',
  },
  eyeButton: {
    padding: 8,
  },
  rowJustified: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'sans-serif',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    ...SHADOWS.md,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    marginLeft: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    letterSpacing: 1.2,
    fontFamily: 'monospace',
    paddingHorizontal: 12,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'sans-serif',
  },
  fullScreenContent: {
    width: '100%',
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingRight: 12,
  },
  backButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'sans-serif',
    marginLeft: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  screenHeader: {
    marginBottom: 24,
  },
  iconCircleHeader: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
  },
  photoPickerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoPickerCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.8,
    borderColor: 'rgba(232, 160, 32, 0.4)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: COLORS.surface,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 4,
  },
  avatarTextCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textOnPrimary,
  },
  photoBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: -2,
    right: -2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  strengthMeterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
    marginRight: 10,
  },
  strengthBar: {
    height: 4,
    flex: 1,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'sans-serif',
  },
  footerLinkText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 20,
    fontFamily: 'sans-serif',
  },
  bottomFixedBtn: {
    marginTop: 24,
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 12,
  },
  otpInputBox: {
    flex: 1,
    aspectRatio: 1,
  },
  otpTextInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceElevated,
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  timerWrapper: {
    alignItems: 'center',
    marginVertical: 16,
  },
  timerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'sans-serif',
  },
  resendLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'sans-serif',
  },
  successIconOuterCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 36,
    paddingHorizontal: 24,
  },
});
