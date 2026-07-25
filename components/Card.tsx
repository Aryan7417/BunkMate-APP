
import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle, StyleProp } from 'react-native';
import { colors, spacing, radius, cardShadow } from '../themes';

interface CardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  noPadding?: boolean;
}

export function Card({ children, style, noPadding, ...rest }: CardProps) {
  return (
    <View
      style={[styles.card, noPadding && { padding: 0 }, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...cardShadow,
  },
});