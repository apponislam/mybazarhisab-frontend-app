// Custom HSL-tailored Premium Color Palette & Design Tokens

export const COLORS = {
  // Brand Colors
  primary: '#6366f1',      // Indigo 500 (trust, finance, modern)
  primaryDark: '#4f46e5',  // Indigo 600
  primaryLight: '#c7d2fe', // Indigo 200
  primaryGlow: 'rgba(99, 102, 241, 0.15)',
  
  accent: '#14b8a6',       // Teal 500 (balance, currency, freshness)
  accentDark: '#0d9488',   // Teal 600
  accentLight: '#99f6e4',  // Teal 200
  accentGlow: 'rgba(20, 184, 166, 0.15)',

  // Neutral Theme Colors (Modern Sleek Slate Dark Theme)
  background: '#090d16',   // Deepest dark blue-gray
  surface: '#151c2c',      // Card surface
  surfaceElevated: '#1e293b', // Elevated card surface
  
  // Text Colors
  text: '#f8fafc',          // Very light slate
  textSecondary: '#94a3b8', // Cool gray/slate
  textMuted: '#64748b',     // Darker slate gray
  textOnPrimary: '#ffffff', // Plain white for primary button text
  
  // Status Colors
  success: '#10b981',       // Emerald 500
  successLight: '#d1fae5',
  error: '#f43f5e',         // Rose 500
  errorLight: '#ffe4e6',
  warning: '#f59e0b',       // Amber 500
  warningLight: '#fef3c7',
  
  // UI Details
  border: '#242f47',        // Subtle border color
  borderFocus: '#4f46e5',   // Focused input border
  placeholder: '#475569',   // Input placeholder text
  
  // Glassmorphism overlays
  glassBg: 'rgba(21, 28, 44, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const SIZES = {
  h1: 32,
  h2: 24,
  h3: 20,
  body: 16,
  caption: 12,
  radiusSm: 8,
  radiusMd: 16,
  radiusLg: 24,
  radiusFull: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
};
