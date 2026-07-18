import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { SHADOWS } from '../constants/theme';

export interface MetaInfoProps {
  /** Display label */
  label: string;
  /** Icon component, typically a function returning a ReactNode */
  icon: React.ReactNode;
  /** Base color (hex) used for background and border tints */
  color: string;
  /** Optional press handler – makes the whole chip touchable */
  onPress?: (event: GestureResponderEvent) => void;
  /** Elevate the chip if true (adds a subtle shadow) */
  elevated?: boolean;
}

/**
 * A premium‑looking reusable chip that displays a coloured icon and a label.
 * It centralises the visual pattern used across Bills, BillsDetail, AddBill, etc.
 *
 * Usage example:
 * ```tsx
 * <MetaInfo
 *   label={meta.label}
 *   icon={meta.icon({ color: meta.color, size: 20 })}
 *   color={meta.color}
 *   onPress={handlePress}
 * />
 * ```
 */
export default function MetaInfo({ label, icon, color, onPress, elevated = false }: MetaInfoProps) {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container
      style={[
        styles.chip,
        {
          backgroundColor: `${color}20`,
          borderColor: `${color}40`,
        },
        elevated && SHADOWS.sm,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1.2,
    borderRadius: 12,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'sans-serif',
  },
});
