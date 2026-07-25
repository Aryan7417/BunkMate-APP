// theme/colors.ts
// Source of truth: DESIGN.md ("Monolithic Dark")
// Do NOT add new colors here — every value below is taken 1:1 from DESIGN.md.

export const colors = {
  surface: '#141313',
  surfaceDim: '#141313',
  surfaceBright: '#3a3939',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainer: '#201f1f',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353434',

  onSurface: '#e5e2e1',
  onSurfaceVariant: '#c4c7c8',
  inverseSurface: '#e5e2e1',
  inverseOnSurface: '#313030',

  outline: '#8e9192',
  outlineVariant: '#444748',
  surfaceTint: '#c6c6c7',

  primary: '#ffffff',
  onPrimary: '#2f3131',
  primaryContainer: '#e2e2e2',
  onPrimaryContainer: '#636565',
  inversePrimary: '#5d5f5f',

  secondary: '#c6c6cf',
  onSecondary: '#2f3037',
  secondaryContainer: '#45464e',
  onSecondaryContainer: '#b4b4bd',

  tertiary: '#ffffff',
  onTertiary: '#32302d',
  tertiaryContainer: '#e7e1dd',
  onTertiaryContainer: '#676460',

  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',

  background: '#141313',
  onBackground: '#e5e2e1',
  surfaceVariant: '#353434',

  // Convenience aliases used across BunkMate screens (from code.html)
  card: '#1c1b1b',
  cardBorder: '#27272A',
  divider: '#27272A',
  secondaryText: '#A1A1AA',
  toggleTrackOff: '#27272A',
  toggleThumbOff: '#111111',
  danger: '#EF4444',
} as const;

export type ColorToken = keyof typeof colors;