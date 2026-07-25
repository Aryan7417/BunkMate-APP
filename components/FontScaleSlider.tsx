
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, typography, spacing, radius } from '../themes';

const SCALE_LABELS: Record<number, string> = {
  1: 'Small',
  2: 'Default',
  3: 'Large',
};

interface FontScaleSliderProps {
  value: number; // 1 | 2 | 3
  onValueChange: (next: number) => void;
}

export function FontScaleSlider({ value, onValueChange }: FontScaleSliderProps) {
  return (
    <View style={{ width: '100%' }}>
      <View style={styles.headerRow}>
        <Text style={[typography.bodyLg, { color: colors.primary }]}>Font Scale</Text>
        <View style={styles.chip}>
          <Text style={[typography.labelSm, { color: colors.primary }]}>
            {SCALE_LABELS[value] ?? 'Default'}
          </Text>
        </View>
      </View>
      <Slider
        style={{ width: '100%', height: 32 }}
        minimumValue={1}
        maximumValue={3}
        step={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.toggleTrackOff}
        thumbTintColor={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  chip: {
    backgroundColor: colors.toggleTrackOff,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
});