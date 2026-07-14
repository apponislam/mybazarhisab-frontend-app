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
import { BookOpen, ShoppingBag, TrendingUp } from '../components/CustomIcon';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const badgeLeftAnim = useRef(new Animated.Value(-15)).current;
  const badgeRightAnim = useRef(new Animated.Value(-15)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(15)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Logo entry animation
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 20,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Delay entry for floating badges
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(badgeOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(badgeLeftAnim, {
          toValue: -20, // Slide out left
          tension: 15,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(badgeRightAnim, {
          toValue: -20, // Slide out right
          tension: 15,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3. Text fade & slide up
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 4. Progress bar starts filling up after delay
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2400,
        useNativeDriver: false, // width animation requires useNativeDriver: false
      }),
    ]).start();

    // 5. Total delay before finishing splash: 3.2 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Mesh Glow Background */}
      <View style={styles.glowOverlay} />
      <View style={styles.topAccentBar} />

      {/* Main Brand logo & Title */}
      <View style={styles.brandWrapper}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.outerLogoBox}>
            <View style={styles.innerLogoBox}>
              <BookOpen color={COLORS.background} size={32} />
            </View>
          </View>

          {/* Floating Left Badge: Shopping Bag */}
          <Animated.View
            style={[
              styles.floatingBadge,
              styles.floatingBadgeLeft,
              {
                opacity: badgeOpacity,
                transform: [{ translateX: badgeLeftAnim }],
              },
            ]}
          >
            <ShoppingBag color={COLORS.primaryLight} size={20} />
          </Animated.View>

          {/* Floating Right Badge: Trending Up */}
          <Animated.View
            style={[
              styles.floatingBadge,
              styles.floatingBadgeRight,
              {
                opacity: badgeOpacity,
                transform: [{ translateX: Animated.multiply(badgeRightAnim, -1) }],
              },
            ]}
          >
            <TrendingUp color={COLORS.primaryLight} size={20} />
          </Animated.View>
        </Animated.View>

        {/* Title & Subtitles */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
            alignItems: 'center',
          }}
        >
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>My Bazar </Text>
            <Text style={styles.titleAccentText}>Hisab</Text>
          </View>
          <Text style={styles.appHeading}>YOUR MARKET ACCOUNT BOOK</Text>
        </Animated.View>
      </View>

      {/* Bottom explanation text */}
      <Animated.Text style={[styles.bottomText, { opacity: textOpacity }]}>
        Track your market expenses,{"\n"}manage your bazar accounts with ease.
      </Animated.Text>

      {/* Progress loading track */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressBarWidth }]} />
        </View>
      </View>
      
      <View style={styles.bottomAccentBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.background,
    // Soft radial glow approximation using an overlay with alpha primary
    opacity: 0.12,
  },
  topAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: COLORS.primary,
    opacity: 0.6,
  },
  bottomAccentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: COLORS.primary,
    opacity: 0.6,
  },
  brandWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 60,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 36,
  },
  outerLogoBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: 'rgba(232, 160, 32, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerLogoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  floatingBadge: {
    position: 'absolute',
    bottom: -6,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(192, 96, 16, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  floatingBadgeLeft: {
    left: 0,
  },
  floatingBadgeRight: {
    right: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
  },
  titleAccentText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'serif',
  },
  appHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2.2,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  bottomText: {
    position: 'absolute',
    bottom: 120,
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 36,
    fontFamily: 'sans-serif',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  progressTrack: {
    width: 128,
    height: 2.5,
    backgroundColor: 'rgba(232, 160, 32, 0.15)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 1.5,
  },
});
