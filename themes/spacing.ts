// theme/spacing.ts
// Source of truth: DESIGN.md spacing + rounded blocks.

export const spacing = {
  unit: 4,
  xs: 4,
  sm: 20,
  md: 6,
  lg: 70,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  gutter: 16,
  marginMobile: 16,
  marginDesktop: 32,
} as const;

export const radius = {
  sm: 4,   // 0.25rem
  DEFAULT: 8, // 0.5rem
  md: 12,  // 0.75rem
  lg: 16,  // 1rem — cards/containers per DESIGN.md
  xl: 24,  // 1.5rem
  full: 9999,
} as const;

// Shadow used on all Level-2 (card) elements — DESIGN.md "Elevation & Depth"
export const cardShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.5,
  shadowRadius: 30,
  elevation: 8, // Android fallback
} as const;