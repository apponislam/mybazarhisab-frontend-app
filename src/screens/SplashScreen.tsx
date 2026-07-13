import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Logo & text fade in and scale up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 15,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Loading bar progress animation (2.2 seconds)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false, // width animation requires false for native driver
    }).start();

    // 3. Trigger transition after splash completes
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, progressAnim, onFinish]);

  // Interpolate progress animation to width percentage
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Background Decorative Mesh Gradients */}
      <View style={[styles.gradientCircle, styles.circleTopLeft]} />
      <View style={[styles.gradientCircle, styles.circleBottomRight]} />

      {/* Main Branding Section */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Custom Premium Logo */}
        <View style={[styles.logoContainer, SHADOWS.lg]}>
          <View style={styles.logoBase}>
            {/* Shopping ledger checklist lines (vector shapes) */}
            <View style={[styles.logoLine, styles.logoLine1]} />
            <View style={[styles.logoLine, styles.logoLine2]} />
            <View style={[styles.logoLine, styles.logoLine3]} />
            
            {/* Calculation scale icon inside logo */}
            <View style={styles.logoAccentBadge}>
              <Text style={styles.logoBadgeText}>৳</Text>
            </View>
          </View>
        </View>

        {/* App Title */}
        <Text style={styles.title}>My Bazar Hisab</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>Simple Bazar & Expense Tracker</Text>
      </Animated.View>

      {/* Loading Indicator Section */}
      <Animated.View style={[styles.loaderContainer, { opacity: fadeAnim }]}>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.loaderText}>Loading your ledger...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xxl,
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.25,
    filter: 'blur(60px)', // Web/Modern styling fallbacks
  },
  circleTopLeft: {
    width: width * 1.2,
    height: width * 1.2,
    backgroundColor: COLORS.primary,
    top: -width * 0.4,
    left: -width * 0.4,
  },
  circleBottomRight: {
    width: width * 1.2,
    height: width * 1.2,
    backgroundColor: COLORS.accent,
    bottom: -width * 0.4,
    right: -width * 0.4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xxl,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: SIZES.radiusLg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logoBase: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  logoLine: {
    height: 6,
    borderRadius: SIZES.radiusSm,
  },
  logoLine1: {
    width: '65%',
    backgroundColor: COLORS.primary,
  },
  logoLine2: {
    width: '80%',
    backgroundColor: COLORS.accent,
  },
  logoLine3: {
    width: '50%',
    backgroundColor: COLORS.primaryLight,
  },
  logoAccentBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: COLORS.accent,
    width: 32,
    height: 32,
    borderRadius: SIZES.radiusFull,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  logoBadgeText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  loaderContainer: {
    width: '75%',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  progressBarBg: {
    height: 4,
    width: '100%',
    backgroundColor: COLORS.border,
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.radiusFull,
  },
  loaderText: {
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
});
