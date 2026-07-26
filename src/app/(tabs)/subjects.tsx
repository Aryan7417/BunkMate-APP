import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../themes';

export default function SubjectsScreen() {
  return (
    <View style={styles.container}>
      <Text style={[typography.headlineLgMobile, { color: colors.primary, padding: spacing.md }]}>Your Subjects</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background } });