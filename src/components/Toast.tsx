import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, View } from 'react-native';
import { COLORS, SHADOWS } from '../constants/theme';
import { CheckCircle, X } from './CustomIcon';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export default function Toast({ message, type, visible, onHide, duration = 3000 }: ToastProps) {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide in and fade in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  const getTheme = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'rgba(34, 197, 94, 0.95)',
          border: '#22c55e',
          icon: <CheckCircle color="#fff" size={18} />,
        };
      case 'error':
        return {
          bg: 'rgba(212, 24, 61, 0.95)',
          border: '#d4183d',
          icon: <X color="#fff" size={18} />,
        };
      default:
        return {
          bg: 'rgba(37, 21, 8, 0.95)',
          border: COLORS.border,
          icon: null,
        };
    }
  };

  const theme = getTheme();

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          backgroundColor: theme.bg,
          borderColor: theme.border,
        },
        SHADOWS.md,
      ]}
    >
      <View style={styles.toastContent}>
        {theme.icon}
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    borderRadius: 12,
    borderWidth: 1.2,
    paddingVertical: 14,
    paddingHorizontal: 16,
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'sans-serif',
    flex: 1,
  },
});
