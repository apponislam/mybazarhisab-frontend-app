import React from 'react';
import { View, ViewStyle } from 'react-native';

interface IconProps {
  color?: string;
  size?: number;
  style?: ViewStyle;
}

export function Mail({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{
        width: size * 0.85,
        height: size * 0.6,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 2,
        justifyContent: 'flex-start',
        overflow: 'hidden'
      }}>
        <View style={{
          width: size * 0.6,
          height: size * 0.6,
          borderWidth: 1.5,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          position: 'absolute',
          top: -size * 0.42,
          left: size * 0.1,
        }} />
      </View>
    </View>
  );
}

export function Lock({ color = '#e8a020', size = 20, style }: IconProps) {
  const bodyWidth = size * 0.75;
  const bodyHeight = size * 0.55;
  const shackleRadius = size * 0.25;
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{
        width: shackleRadius * 2,
        height: shackleRadius * 2,
        borderWidth: 1.5,
        borderColor: color,
        borderTopLeftRadius: shackleRadius,
        borderTopRightRadius: shackleRadius,
        borderBottomWidth: 0,
        position: 'absolute',
        top: size * 0.08,
      }} />
      <View style={{
        width: bodyWidth,
        height: bodyHeight,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 2.5,
        position: 'absolute',
        bottom: size * 0.1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{ width: 2.5, height: 4, backgroundColor: color, borderRadius: 0.5 }} />
      </View>
    </View>
  );
}

export function Eye({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{
        width: size * 0.8,
        height: size * 0.8,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: size * 0.4,
        transform: [{ scaleY: 0.65 }, { rotate: '45deg' }],
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{
          width: size * 0.32,
          height: size * 0.32,
          borderRadius: (size * 0.32) / 2,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }, { scaleY: 1.54 }]
        }} />
      </View>
    </View>
  );
}

export function EyeOff({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <Eye color={color} size={size} />
      <View style={{
        width: 1.5,
        height: size * 0.95,
        backgroundColor: color,
        position: 'absolute',
        transform: [{ rotate: '45deg' }],
      }} />
    </View>
  );
}

export function BookOpen({ color = '#e8a020', size = 20, style }: IconProps) {
  const w = size * 0.38;
  const h = size * 0.65;
  return (
    <View style={[{ width: size, height: size, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{
        width: w,
        height: h,
        borderWidth: 1.5,
        borderColor: color,
        borderTopLeftRadius: 2.5,
        borderBottomLeftRadius: 2.5,
        borderRightWidth: 0,
        marginRight: 0.5
      }} />
      <View style={{
        width: w,
        height: h,
        borderWidth: 1.5,
        borderColor: color,
        borderTopRightRadius: 2.5,
        borderBottomRightRadius: 2.5,
        borderLeftWidth: 0,
        marginLeft: 0.5
      }} />
    </View>
  );
}

export function ShoppingBag({ color = '#e8a020', size = 20, style }: IconProps) {
  const w = size * 0.72;
  const h = size * 0.7;
  const hw = size * 0.36;
  const hh = size * 0.3;
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{
        width: hw,
        height: hh * 2,
        borderWidth: 1.5,
        borderColor: color,
        borderTopLeftRadius: hw / 2,
        borderTopRightRadius: hw / 2,
        position: 'absolute',
        top: size * 0.08,
      }} />
      <View style={{
        width: w,
        height: h,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 2.5,
        position: 'absolute',
        bottom: size * 0.1,
      }} />
    </View>
  );
}

export function TrendingUp({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{ width: size * 0.75, height: size * 0.75, position: 'relative' }}>
        <View style={{
          width: size * 0.35,
          height: 1.5,
          backgroundColor: color,
          position: 'absolute',
          bottom: size * 0.18,
          left: size * 0.05,
          transform: [{ rotate: '-30deg' }]
        }} />
        <View style={{
          width: size * 0.45,
          height: 1.5,
          backgroundColor: color,
          position: 'absolute',
          bottom: size * 0.42,
          left: size * 0.28,
          transform: [{ rotate: '-60deg' }]
        }} />
        <View style={{
          width: size * 0.18,
          height: 1.5,
          backgroundColor: color,
          position: 'absolute',
          top: size * 0.1,
          right: size * 0.05,
        }} />
        <View style={{
          width: 1.5,
          height: size * 0.18,
          backgroundColor: color,
          position: 'absolute',
          top: size * 0.1,
          right: size * 0.05,
        }} />
      </View>
    </View>
  );
}

export function User({ color = '#e8a020', size = 20, style }: IconProps) {
  const headSize = size * 0.36;
  const bodyWidth = size * 0.75;
  const bodyHeight = size * 0.32;
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <View style={{
        width: headSize,
        height: headSize,
        borderRadius: headSize / 2,
        borderWidth: 1.5,
        borderColor: color,
        marginBottom: 2
      }} />
      <View style={{
        width: bodyWidth,
        height: bodyHeight,
        borderTopLeftRadius: size * 0.35,
        borderTopRightRadius: size * 0.35,
        borderWidth: 1.5,
        borderBottomWidth: 0,
        borderColor: color,
      }} />
    </View>
  );
}

export function Phone({ color = '#e8a020', size = 20, style }: IconProps) {
  const w = size * 0.52;
  const h = size * 0.8;
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{
        width: w,
        height: h,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 2.5,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 1.5
      }}>
        <View style={{ width: 5, height: 1, backgroundColor: color, borderRadius: 0.5 }} />
        <View style={{ width: 3.5, height: 3.5, borderRadius: 1.75, borderWidth: 0.8, borderColor: color }} />
      </View>
    </View>
  );
}

export function ArrowLeft({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{ width: size * 0.72, height: 1.5, backgroundColor: color, position: 'absolute' }} />
      <View style={{
        width: size * 0.32,
        height: size * 0.32,
        borderLeftWidth: 1.5,
        borderTopWidth: 1.5,
        borderColor: color,
        transform: [{ rotate: '-45deg' }],
        position: 'absolute',
        left: size * 0.12,
      }} />
    </View>
  );
}

export function CheckCircle({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{
        width: size * 0.85,
        height: size * 0.85,
        borderRadius: (size * 0.85) / 2,
        borderWidth: 1.5,
        borderColor: color,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{
          width: size * 0.2,
          height: size * 0.38,
          borderRightWidth: 1.8,
          borderBottomWidth: 1.8,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          marginTop: -size * 0.06,
        }} />
      </View>
    </View>
  );
}

export function X({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{ width: size * 0.72, height: 1.5, backgroundColor: color, position: 'absolute', transform: [{ rotate: '45deg' }] }} />
      <View style={{ width: size * 0.72, height: 1.5, backgroundColor: color, position: 'absolute', transform: [{ rotate: '-45deg' }] }} />
    </View>
  );
}

export function Camera({ color = '#e8a020', size = 20, style }: IconProps) {
  const w = size * 0.75;
  const h = size * 0.52;
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{
        width: size * 0.22,
        height: size * 0.1,
        backgroundColor: color,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        position: 'absolute',
        top: size * 0.2,
      }} />
      <View style={{
        width: w,
        height: h,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 2,
        position: 'absolute',
        bottom: size * 0.18,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{ width: size * 0.24, height: size * 0.24, borderRadius: (size * 0.24) / 2, borderWidth: 1.2, borderColor: color }} />
      </View>
    </View>
  );
}

export function Plus({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{ width: size * 0.7, height: 1.5, backgroundColor: color, position: 'absolute' }} />
      <View style={{ width: 1.5, height: size * 0.7, backgroundColor: color, position: 'absolute' }} />
    </View>
  );
}

export function ChevronUp({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{
        width: size * 0.35,
        height: size * 0.35,
        borderLeftWidth: 1.5,
        borderTopWidth: 1.5,
        borderColor: color,
        transform: [{ rotate: '45deg' }],
        marginTop: size * 0.08,
      }} />
    </View>
  );
}

export function ChevronDown({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{
        width: size * 0.35,
        height: size * 0.35,
        borderLeftWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: color,
        transform: [{ rotate: '-45deg' }],
        marginBottom: size * 0.08,
      }} />
    </View>
  );
}

export function ChevronRight({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{
        width: size * 0.32,
        height: size * 0.32,
        borderTopWidth: 1.5,
        borderRightWidth: 1.5,
        borderColor: color,
        transform: [{ rotate: '45deg' }],
        marginRight: size * 0.08,
      }} />
    </View>
  );
}

export function Calendar({ color = '#e8a020', size = 20, style }: IconProps) {
  const w = size * 0.75;
  const h = size * 0.72;
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      {/* Outer border */}
      <View style={{
        width: w,
        height: h,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 2.5,
        paddingTop: size * 0.2,
      }}>
        {/* Horizontal Line under rings */}
        <View style={{ height: 1.2, backgroundColor: color, width: '100%' }} />
        {/* Small calendar dates representation */}
        <View style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 2,
          padding: 3,
          justifyContent: 'center',
          alignContent: 'center'
        }}>
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <View key={k} style={{ width: 2, height: 2, borderRadius: 0.5, backgroundColor: color }} />
          ))}
        </View>
      </View>
      {/* Binder rings */}
      <View style={{ width: 1.5, height: 4, backgroundColor: color, position: 'absolute', top: size * 0.08, left: size * 0.28, borderRadius: 0.5 }} />
      <View style={{ width: 1.5, height: 4, backgroundColor: color, position: 'absolute', top: size * 0.08, right: size * 0.28, borderRadius: 0.5 }} />
    </View>
  );
}

export function Package({ color = '#e8a020', size = 20, style }: IconProps) {
  const w = size * 0.75;
  const h = size * 0.65;
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      {/* Box base */}
      <View style={{
        width: w,
        height: h,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 2.5,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Horizontal dividing line */}
        <View style={{ width: '100%', height: 1.2, backgroundColor: color, position: 'absolute', top: h * 0.35 }} />
        {/* Vertical dividing tape line */}
        <View style={{ height: '100%', width: 1.2, backgroundColor: color }} />
      </View>
    </View>
  );
}
