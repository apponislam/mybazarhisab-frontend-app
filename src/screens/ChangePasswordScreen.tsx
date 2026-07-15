import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { useChangePasswordMutation } from '../redux/features/auth/authApi';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from '../components/CustomIcon';

interface ChangePasswordScreenProps {
  onBack: () => void;
}

export default function ChangePasswordScreen({ onBack }: ChangePasswordScreenProps) {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [repeat, setRepeat] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  const [fCurrent, setFCurrent] = useState(false);
  const [fNew, setFNew] = useState(false);
  const [fRepeat, setFRepeat] = useState(false);

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const mismatch = repeat.length > 0 && newPass !== repeat;
  
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

  const [changePasswordApi] = useChangePasswordMutation();

  const handleSubmit = async () => {
    if (mismatch || newPass.length < 8 || !current) return;
    setLoading(true);
    try {
      const res = await changePasswordApi({
        currentPassword: current,
        newPassword: newPass,
      }).unwrap();

      if (res.success) {
        setDone(true);
        setTimeout(() => {
          setDone(false);
          onBack();
        }, 1500);
      } else {
        Alert.alert('Error', res.message || 'Failed to change password');
      }
    } catch (error: any) {
      console.error('Failed to change password:', error);
      Alert.alert(
        'Error',
        error?.data?.message || 'An error occurred while changing password'
      );
    } finally {
      setLoading(false);
    }
  };

  const sl = getPasswordStrength(newPass);

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
        <ArrowLeft color={COLORS.textSecondary} size={16} />
        <Text style={styles.backButtonText}>Profile</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.screenHeader}>
          <View style={styles.iconCircleHeader}>
            <Lock color={COLORS.primary} size={22} />
          </View>
          <Text style={styles.screenTitle}>Change Password</Text>
          <Text style={styles.screenSubtitle}>
            Choose a strong new password for your account.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Current Password */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Current Password</Text>
            <View style={[styles.inputWrapper, fCurrent && styles.inputWrapperFocused]}>
              <Lock color={COLORS.textSecondary} size={18} style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor={COLORS.placeholder}
                value={current}
                onChangeText={setCurrent}
                secureTextEntry={!showCurrent}
                onFocus={() => setFCurrent(true)}
                onBlur={() => setFCurrent(false)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowCurrent(!showCurrent)}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                {showCurrent ? <EyeOff color={COLORS.textSecondary} size={18} /> : <Eye color={COLORS.textSecondary} size={18} />}
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>New Password</Text>
            <View style={[styles.inputWrapper, fNew && styles.inputWrapperFocused]}>
              <Lock color={COLORS.textSecondary} size={18} style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor={COLORS.placeholder}
                value={newPass}
                onChangeText={setNewPass}
                secureTextEntry={!showNew}
                onFocus={() => setFNew(true)}
                onBlur={() => setFNew(false)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowNew(!showNew)}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                {showNew ? <EyeOff color={COLORS.textSecondary} size={18} /> : <Eye color={COLORS.textSecondary} size={18} />}
              </TouchableOpacity>
            </View>

            {/* Strength indicator */}
            {newPass.length > 0 && (
              <View style={styles.strengthMeterRow}>
                <View style={styles.strengthBars}>
                  {[1, 2, 3].map((l) => (
                    <View
                      key={l}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor: sl >= l ? getStrengthColor(sl) : 'rgba(232,160,32,0.15)',
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthText, { color: getStrengthColor(sl) }]}>
                  {getStrengthLabel(sl)}
                </Text>
              </View>
            )}
          </View>

          {/* Repeat Password */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Confirm New Password</Text>
            <View
              style={[
                styles.inputWrapper,
                fRepeat && styles.inputWrapperFocused,
                mismatch && styles.inputWrapperError,
              ]}
            >
              <Lock color={COLORS.textSecondary} size={18} style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor={COLORS.placeholder}
                value={repeat}
                onChangeText={setRepeat}
                secureTextEntry={!showRepeat}
                onFocus={() => setFRepeat(true)}
                onBlur={() => setFRepeat(false)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowRepeat(!showRepeat)}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                {showRepeat ? <EyeOff color={COLORS.textSecondary} size={18} /> : <Eye color={COLORS.textSecondary} size={18} />}
              </TouchableOpacity>
            </View>
            {mismatch && <Text style={styles.errorText}>Passwords do not match</Text>}
          </View>

          {/* Submit */}
          <View style={{ marginTop: 12 }}>
            {done ? (
              <View style={styles.successMessageCard}>
                <CheckCircle color="#22c55e" size={18} />
                <Text style={styles.successMessageText}>Password updated!</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSubmit}
                disabled={loading || mismatch || newPass.length < 8 || !current}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.textOnPrimary} size="small" />
                ) : (
                  <Text style={styles.primaryButtonText}>Update Password</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'sans-serif',
    marginLeft: 6,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  screenHeader: {
    marginBottom: 28,
    marginTop: 10,
  },
  iconCircleHeader: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
  },
  screenSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 4,
    lineHeight: 18,
  },
  formContainer: {
    width: '100%',
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
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    ...SHADOWS.md,
  },
  primaryButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  successMessageCard: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  successMessageText: {
    color: '#22c55e',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
});
