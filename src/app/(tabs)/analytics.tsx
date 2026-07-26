import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../themes';

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={[typography.headlineLgMobile, { color: colors.primary, padding: spacing.md }]}>Weekly Attendance</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background } });