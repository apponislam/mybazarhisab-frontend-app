// Custom HSL-tailored Premium Color Palette & Design Tokens

export const COLORS = {
  // Brand Colors
  primary: '#e8a020',         // Gold/Orange (from web design)
  primaryDark: '#c06010',     // Dark Gold/Orange
  primaryLight: '#f5ede2',    // Off-white/light foreground
  primaryGlow: 'rgba(232, 160, 32, 0.15)',
  
  accent: '#c06010',          // Dark Accent Orange
  accentDark: '#8c4005',
  accentLight: '#f5ede2',
  accentGlow: 'rgba(192, 96, 16, 0.15)',

  // Neutral Theme Colors (Brown Dark Theme)
  background: '#1a0e07',      // Warm Dark Brown
  surface: '#251508',         // Lighter Dark Brown (Card bg)
  surfaceElevated: '#2e1a0a', // Input / Field bg
  
  // Text Colors
  text: '#f5ede2',            // Warm off-white
  textSecondary: '#a08060',   // Muted gold-brown
  textMuted: '#6d533b',       // Darker muted brown
  textOnPrimary: '#1a0e07',   // Dark text on gold button
  
  // Status Colors
  success: '#22c55e',         // Bright green
  successLight: 'rgba(34, 197, 94, 0.15)',
  error: '#d4183d',           // Bright red
  errorLight: 'rgba(212, 24, 61, 0.15)',
  warning: '#f59e0b',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  
  // UI Details
  border: 'rgba(232, 160, 32, 0.18)',        // Gold translucent border
  borderFocus: 'rgba(232, 160, 32, 0.7)',    // Focused input border
  placeholder: '#6d533b',                    // Input placeholder text
  
  // Glassmorphism overlays
  glassBg: 'rgba(37, 21, 8, 0.75)',
  glassBorder: 'rgba(232, 160, 32, 0.08)',
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
