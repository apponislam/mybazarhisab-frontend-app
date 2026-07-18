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

export function Users({ color = '#e8a020', size = 20, style }: IconProps) {
  // First user in background (offset to the right/top)
  const bgSize = size * 0.82;
  const bgHead = bgSize * 0.36;
  const bgBodyW = bgSize * 0.75;
  const bgBodyH = bgSize * 0.32;

  // Second user in foreground (offset to the left/bottom)
  const fgSize = size * 0.82;
  const fgHead = fgSize * 0.36;
  const fgBodyW = fgSize * 0.75;
  const fgBodyH = fgSize * 0.32;

  return (
    <View style={[{ width: size, height: size, position: 'relative' }, style]}>
      {/* Background User */}
      <View style={{
        position: 'absolute',
        top: size * 0.04,
        right: size * 0.04,
        alignItems: 'center',
        opacity: 0.6,
      }}>
        <View style={{
          width: bgHead,
          height: bgHead,
          borderRadius: bgHead / 2,
          borderWidth: 1.2,
          borderColor: color,
          marginBottom: 1
        }} />
        <View style={{
          width: bgBodyW,
          height: bgBodyH,
          borderTopLeftRadius: bgSize * 0.35,
          borderTopRightRadius: bgSize * 0.35,
          borderWidth: 1.2,
          borderBottomWidth: 0,
          borderColor: color,
        }} />
      </View>

      {/* Foreground User */}
      <View style={{
        position: 'absolute',
        bottom: size * 0.04,
        left: size * 0.04,
        alignItems: 'center',
        backgroundColor: '#2e1a0a', // mask the background user body (matches app background)
        paddingRight: 1,
        borderRadius: size * 0.3,
      }}>
        <View style={{
          width: fgHead,
          height: fgHead,
          borderRadius: fgHead / 2,
          borderWidth: 1.5,
          borderColor: color,
          marginBottom: 2
        }} />
        <View style={{
          width: fgBodyW,
          height: fgBodyH,
          borderTopLeftRadius: fgSize * 0.35,
          borderTopRightRadius: fgSize * 0.35,
          borderWidth: 1.5,
          borderBottomWidth: 0,
          borderColor: color,
        }} />
      </View>
    </View>
  );
}

export function Home({ color = '#e8a020', size = 20, style }: IconProps) {
  const roofHeight = size * 0.42;
  const baseWidth = size * 0.72;
  const baseHeight = size * 0.45;
  const doorWidth = size * 0.22;
  const doorHeight = size * 0.28;

  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      {/* Roof - Triangle using borders */}
      <View style={{
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: size * 0.45,
        borderRightWidth: size * 0.45,
        borderBottomWidth: roofHeight,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
        position: 'absolute',
        top: size * 0.06,
      }} />
      {/* Base Wall */}
      <View style={{
        width: baseWidth,
        height: baseHeight,
        borderWidth: 1.5,
        borderColor: color,
        borderTopWidth: 0,
        position: 'absolute',
        bottom: size * 0.08,
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        {/* Door */}
        <View style={{
          width: doorWidth,
          height: doorHeight,
          borderWidth: 1.5,
          borderColor: color,
          borderBottomWidth: 0,
          borderTopLeftRadius: 1.5,
          borderTopRightRadius: 1.5,
        }} />
      </View>
    </View>
  );
}

export function Receipt({ color = '#e8a020', size = 20, style }: IconProps) {
  const w = size * 0.7;
  const h = size * 0.8;
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      {/* Paper container */}
      <View style={{
        width: w,
        height: h,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 1.5,
        padding: 3,
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
        {/* Horizontal printed receipt lines */}
        <View style={{ width: '80%', height: 1.2, backgroundColor: color }} />
        <View style={{ width: '60%', height: 1.2, backgroundColor: color }} />
        <View style={{ width: '70%', height: 1.2, backgroundColor: color }} />
        <View style={{ width: '45%', height: 1.2, backgroundColor: color }} />
      </View>
    </View>
  );
}

export function Car({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{ width: size * 0.7, height: size * 0.35, borderWidth: 1.5, borderColor: color, borderTopLeftRadius: size * 0.15, borderTopRightRadius: size * 0.15, position: 'absolute', top: size * 0.18 }} />
      <View style={{ width: size * 0.82, height: size * 0.3, borderWidth: 1.5, borderColor: color, borderRadius: 2.5, position: 'absolute', bottom: size * 0.18 }} />
      <View style={{ width: size * 0.16, height: size * 0.16, borderRadius: size * 0.08, backgroundColor: color, position: 'absolute', bottom: size * 0.1, left: size * 0.18 }} />
      <View style={{ width: size * 0.16, height: size * 0.16, borderRadius: size * 0.08, backgroundColor: color, position: 'absolute', bottom: size * 0.1, right: size * 0.18 }} />
    </View>
  );
}

export function Wifi({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      {/* Outer arc */}
      <View style={{ width: size * 0.8, height: size * 0.8, borderWidth: 1.5, borderColor: color, borderTopLeftRadius: size * 0.4, borderTopRightRadius: size * 0.4, borderBottomWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, transform: [{ rotate: '45deg' }], position: 'absolute', top: size * 0.1 }} />
      {/* Middle arc */}
      <View style={{ width: size * 0.5, height: size * 0.5, borderWidth: 1.5, borderColor: color, borderTopLeftRadius: size * 0.25, borderTopRightRadius: size * 0.25, borderBottomWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, transform: [{ rotate: '45deg' }], position: 'absolute', top: size * 0.25 }} />
      {/* Inner dot */}
      <View style={{ width: size * 0.14, height: size * 0.14, borderRadius: size * 0.07, backgroundColor: color, position: 'absolute', bottom: size * 0.15 }} />
    </View>
  );
}

export function Zap({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      {/* Zig-Zag lightning bolt */}
      <View style={{ width: size * 0.35, height: size * 0.35, borderRightWidth: 2, borderBottomWidth: 2, borderColor: color, transform: [{ skewX: '-25deg' }, { rotate: '-10deg' }], position: 'absolute', top: size * 0.15 }} />
      <View style={{ width: size * 0.35, height: size * 0.35, borderLeftWidth: 2, borderTopWidth: 2, borderColor: color, transform: [{ skewX: '-25deg' }, { rotate: '-10deg' }], position: 'absolute', bottom: size * 0.15 }} />
    </View>
  );
}

export function Flame({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{
        width: size * 0.55,
        height: size * 0.75,
        borderWidth: 1.5,
        borderColor: color,
        borderTopLeftRadius: size * 0.3,
        borderBottomLeftRadius: size * 0.25,
        borderBottomRightRadius: size * 0.25,
        borderTopRightRadius: size * 0.05,
        transform: [{ rotate: '-45deg' }],
      }} />
    </View>
  );
}

export function Droplet({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{
        width: size * 0.55,
        height: size * 0.55,
        borderWidth: 1.5,
        borderColor: color,
        borderTopLeftRadius: size * 0.27,
        borderBottomLeftRadius: size * 0.27,
        borderBottomRightRadius: size * 0.27,
        transform: [{ rotate: '-45deg' }],
        marginTop: size * 0.15,
      }} />
    </View>
  );
}

export function Sparkles({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      {/* Star 1 */}
      <View style={{ position: 'absolute', top: size * 0.1, left: size * 0.1 }}>
        <View style={{ width: size * 0.35, height: 1.2, backgroundColor: color, position: 'absolute', top: size * 0.17 }} />
        <View style={{ width: 1.2, height: size * 0.35, backgroundColor: color, position: 'absolute', left: size * 0.17 }} />
      </View>
      {/* Star 2 */}
      <View style={{ position: 'absolute', bottom: size * 0.15, right: size * 0.15 }}>
        <View style={{ width: size * 0.25, height: 1, backgroundColor: color, position: 'absolute', top: size * 0.12 }} />
        <View style={{ width: 1, height: size * 0.25, backgroundColor: color, position: 'absolute', left: size * 0.12 }} />
      </View>
    </View>
  );
}

export function Wrench({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      {/* Shaft */}
      <View style={{ width: size * 0.65, height: size * 0.15, backgroundColor: color, borderRadius: 2, transform: [{ rotate: '-45deg' }] }} />
      {/* Left head */}
      <View style={{ width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15, borderWidth: 1.5, borderColor: color, position: 'absolute', top: size * 0.15, left: size * 0.15, backgroundColor: '#1a0e07' }} />
      {/* Right head */}
      <View style={{ width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15, borderWidth: 1.5, borderColor: color, position: 'absolute', bottom: size * 0.15, right: size * 0.15, backgroundColor: '#1a0e07' }} />
    </View>
  );
}

export function CreditCard({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{ width: size * 0.8, height: size * 0.56, borderWidth: 1.5, borderColor: color, borderRadius: 3, paddingVertical: size * 0.08 }}>
        <View style={{ width: '100%', height: 2.2, backgroundColor: color, marginTop: size * 0.04 }} />
        <View style={{ width: size * 0.16, height: size * 0.08, backgroundColor: color, marginLeft: size * 0.08, marginTop: size * 0.08, borderRadius: 0.5 }} />
      </View>
    </View>
  );
}

export function Heart({ color = '#e8a020', size = 20, style }: IconProps) {
  const arcSize = size * 0.38;
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{ flexDirection: 'row', position: 'absolute', top: size * 0.15 }}>
        <View style={{ width: arcSize, height: arcSize, borderTopLeftRadius: arcSize / 2, borderTopRightRadius: arcSize / 2, borderWidth: 1.5, borderColor: color, borderBottomWidth: 0 }} />
        <View style={{ width: arcSize, height: arcSize, borderTopLeftRadius: arcSize / 2, borderTopRightRadius: arcSize / 2, borderWidth: 1.5, borderColor: color, borderBottomWidth: 0, marginLeft: -1.5 }} />
      </View>
      <View style={{ width: size * 0.52, height: size * 0.52, borderWidth: 1.5, borderColor: color, borderTopWidth: 0, borderRightWidth: 0, transform: [{ rotate: '-45deg' }], position: 'absolute', bottom: size * 0.16 }} />
    </View>
  );
}

export function GraduationCap({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      {/* Cap diamond */}
      <View style={{ width: size * 0.72, height: size * 0.32, borderWidth: 1.5, borderColor: color, transform: [{ rotate: '25deg' }, { skewX: '-35deg' }], position: 'absolute', top: size * 0.18 }} />
      {/* Base neck */}
      <View style={{ width: size * 0.42, height: size * 0.18, borderWidth: 1.5, borderColor: color, borderTopWidth: 0, borderBottomLeftRadius: size * 0.08, borderBottomRightRadius: size * 0.08, position: 'absolute', bottom: size * 0.2 }} />
      {/* Tassel line */}
      <View style={{ width: 1, height: size * 0.22, backgroundColor: color, position: 'absolute', right: size * 0.18, bottom: size * 0.25 }} />
    </View>
  );
}

export function Tv({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      {/* Screen */}
      <View style={{ width: size * 0.8, height: size * 0.55, borderWidth: 1.5, borderColor: color, borderRadius: 2.5, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: size * 0.08, height: size * 0.08, borderRadius: size * 0.04, backgroundColor: color, position: 'absolute', right: size * 0.06 }} />
      </View>
      {/* Stand base */}
      <View style={{ width: size * 0.32, height: 1.5, backgroundColor: color, position: 'absolute', bottom: size * 0.15 }} />
      <View style={{ width: 1.5, height: size * 0.1, backgroundColor: color, position: 'absolute', bottom: size * 0.15 }} />
    </View>
  );
}

export function Shirt({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      {/* Body & sleeves */}
      <View style={{ width: size * 0.72, height: size * 0.65, borderWidth: 1.5, borderColor: color, borderTopLeftRadius: size * 0.1, borderTopRightRadius: size * 0.1, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, position: 'absolute', bottom: size * 0.15 }} />
      {/* Collar cut-out */}
      <View style={{ width: size * 0.26, height: size * 0.15, borderWidth: 1.5, borderColor: color, borderTopWidth: 0, borderBottomLeftRadius: size * 0.1, borderBottomRightRadius: size * 0.1, position: 'absolute', top: size * 0.18 }} />
    </View>
  );
}

export function Scissors({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      {/* Blades */}
      <View style={{ width: 1.5, height: size * 0.5, backgroundColor: color, position: 'absolute', top: size * 0.12, left: size * 0.42, transform: [{ rotate: '20deg' }] }} />
      <View style={{ width: 1.5, height: size * 0.5, backgroundColor: color, position: 'absolute', top: size * 0.12, right: size * 0.42, transform: [{ rotate: '-20deg' }] }} />
      {/* Loops */}
      <View style={{ width: size * 0.24, height: size * 0.24, borderRadius: size * 0.12, borderWidth: 1.5, borderColor: color, position: 'absolute', bottom: size * 0.15, left: size * 0.22 }} />
      <View style={{ width: size * 0.24, height: size * 0.24, borderRadius: size * 0.12, borderWidth: 1.5, borderColor: color, position: 'absolute', bottom: size * 0.15, right: size * 0.22 }} />
    </View>
  );
}

export function Gift({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      {/* Box */}
      <View style={{ width: size * 0.68, height: size * 0.56, borderWidth: 1.5, borderColor: color, borderRadius: 2, paddingVertical: 1 }}>
        {/* Ribbon cross */}
        <View style={{ width: '100%', height: 1.5, backgroundColor: color, position: 'absolute', top: size * 0.26 }} />
        <View style={{ height: '100%', width: 1.5, backgroundColor: color, position: 'absolute', left: size * 0.31 }} />
      </View>
      {/* Ribbon bow loop left */}
      <View style={{ width: size * 0.2, height: size * 0.16, borderWidth: 1.2, borderColor: color, borderRadius: size * 0.08, position: 'absolute', top: size * 0.1, left: size * 0.3, transform: [{ rotate: '-35deg' }] }} />
      {/* Ribbon bow loop right */}
      <View style={{ width: size * 0.2, height: size * 0.16, borderWidth: 1.2, borderColor: color, borderRadius: size * 0.08, position: 'absolute', top: size * 0.1, right: size * 0.3, transform: [{ rotate: '35deg' }] }} />
    </View>
  );
}

export function Settings({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{ width: size * 0.72, height: size * 0.72, borderRadius: size * 0.36, borderWidth: 1.5, borderColor: color, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: size * 0.22, height: size * 0.22, borderRadius: size * 0.11, borderWidth: 1.5, borderColor: color }} />
      </View>
      {/* Cog spokes */}
      {[0, 45, 90, 135].map((angle, idx) => (
        <View key={idx} style={{ width: size * 0.85, height: 1.5, backgroundColor: color, position: 'absolute', transform: [{ rotate: `${angle}deg` }] }} />
      ))}
    </View>
  );
}

export function MessageSquare({ color = '#e8a020', size = 20, style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View style={{ width: size * 0.76, height: size * 0.58, borderWidth: 1.5, borderColor: color, borderRadius: 2 }}>
        {/* Balloon pointer tail */}
        <View style={{ width: size * 0.15, height: size * 0.15, borderBottomWidth: 1.5, borderLeftWidth: 1.5, borderColor: color, transform: [{ rotate: '45deg' }], position: 'absolute', bottom: -size * 0.08, left: size * 0.15, backgroundColor: '#1a0e07' }} />
      </View>
    </View>
  );
}
