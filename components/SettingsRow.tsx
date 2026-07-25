

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../themes';

interface SettingsRowProps {
  title: string;
  subtitle?: string;
  control: React.ReactNode;
  showDivider?: boolean;
}

export function SettingsRow({ title, subtitle, control, showDivider }: SettingsRowProps) {
  return (
    <View style={[styles.row, showDivider && styles.divider]}>
      <View style={styles.textCol}>
        <Text style={[typography.bodyLg, { color: colors.primary }]}>{title}</Text>
        {subtitle ? (
          <Text style={[typography.bodyMd, { color: colors.secondaryText, marginTop: 2 }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View>{control}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  textCol: {
    flex: 1,
    paddingRight: spacing.md,
  },
});