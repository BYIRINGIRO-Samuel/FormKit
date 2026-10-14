import '@/global.css';

import { Platform } from 'react-native';

export const BorderRadius = 3; // Strict 3px border radius specification

export const NavyPalette = {
  // Base colors
  baseWhite: '#FFFFFF',
  white: '#FFFFFF',
  surfaceLight: '#F8FAFC',
  surfaceSubtle: '#F1F5F9',
  
  // Navy Palette
  navyDeep: '#0A192F',
  deepNavy: '#0A192F',
  navyPrimary: '#0F2444',
  richNavy: '#0F2444',
  navyCard: '#FFFFFF',
  navyAccent: '#1D4ED8',
  navyAccentBright: '#2563EB',
  navyBorder: '#E2E8F0',
  navyBorderActive: '#0A192F',
  navyBorderSubtle: '#EDF2F7',
  iceBlue: '#E2EEFC',
  glowBlue: '#38BDF8',

  // Typography Colors
  textNavy: '#0A192F',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textMutedLight: '#94A3B8',
  textWhite: '#FFFFFF',

  // Status colors with 3px compatibility
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
} as const;

export const Colors = {
  light: {
    text: '#0A192F',
    textSecondary: '#475569',
    background: '#FFFFFF',
    card: '#FFFFFF',
    backgroundElement: '#F8FAFC',
    backgroundSelected: '#E2E8F0',
    border: '#E2E8F0',
    primary: '#0A192F',
    accent: '#1D4ED8',
    tint: '#0A192F',
    white: '#FFFFFF',
  },
  dark: {
    text: '#0A192F',
    textSecondary: '#475569',
    background: '#FFFFFF',
    card: '#FFFFFF',
    backgroundElement: '#F8FAFC',
    backgroundSelected: '#E2E8F0',
    border: '#E2E8F0',
    primary: '#0A192F',
    accent: '#1D4ED8',
    tint: '#0A192F',
    white: '#FFFFFF',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = {
  light: 'Outfit_300Light',
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semiBold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
  extraBold: 'Outfit_800ExtraBold',
  black: 'Outfit_900Black',
  display: Platform.select({
    web: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
    default: 'Outfit_600SemiBold',
  }),
  body: Platform.select({
    web: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
    default: 'Outfit_400Regular',
  }),
  mono: Platform.select({
    ios: 'ui-monospace',
    android: 'monospace',
    web: 'var(--font-mono, monospace)',
    default: 'monospace',
  }),
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 760;
