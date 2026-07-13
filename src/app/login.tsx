import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: wire up backend auth
    router.replace('/(tabs)/index');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Branding */}
          <View style={styles.brandSection}>
            <ThemedText style={[styles.brandEmoji]}>🛒</ThemedText>
            <ThemedText style={[styles.brandTitle, { color: theme.primary }]}>
              বাজার হিসাব
            </ThemedText>
            <ThemedText
              style={styles.brandSubtitle}
              themeColor="textSecondary"
            >
              Track your daily market expenses
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundElement,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Enter your email"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundElement,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                { backgroundColor: theme.primary },
                pressed && { backgroundColor: theme.primaryDark, opacity: 0.9 },
              ]}
              onPress={handleLogin}
            >
              <ThemedText style={styles.loginButtonText}>Login</ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.registerButton,
                { borderColor: theme.primary },
                pressed && { opacity: 0.7 },
              ]}
            >
              <ThemedText style={[styles.registerButtonText, { color: theme.primary }]}>
                Create an Account
              </ThemedText>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: Spacing.six,
  },
  brandEmoji: {
    fontSize: 64,
    marginBottom: Spacing.three,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  brandSubtitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  formSection: {
    gap: Spacing.three,
  },
  inputGroup: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: Spacing.one,
  },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  loginButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
