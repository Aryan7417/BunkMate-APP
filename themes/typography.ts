// theme/typography.ts
// Source of truth: DESIGN.md typography block.
// NOTE: Load 'Geist' and 'JetBrains Mono' via expo-font / useFonts in your
// root layout (app/_layout.tsx) before using these. If your project already
// loads these fonts under different keys, just change the fontFamily string
// below to match — don't rename the exported token names, screens depend on them.

import { TextStyle } from 'react-native';

const GEIST = 'Geist';
const JETBRAINS_MONO = 'JetBrainsMono';

export const typography: Record<string, TextStyle> = {
  headlineLg: {
    fontFamily: GEIST,
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    letterSpacing: -0.02 * 32, // -0.02em
  },
  headlineLgMobile: {
    fontFamily: GEIST,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.01 * 24,
  },
  headlineMd: {
    fontFamily: GEIST,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.01 * 20,
  },
  bodyLg: {
    fontFamily: GEIST,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMd: {
    fontFamily: GEIST,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
  },
  labelSm: {
    fontFamily: JETBRAINS_MONO,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.02 * 12,
  },
  button: {
    fontFamily: GEIST,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0,
  },
};