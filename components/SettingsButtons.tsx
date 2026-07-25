
import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons'; 
import { colors, typography, spacing, radius } from '../themes';

interface SettingsButtonProps {
  label: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  onPress: () => void;
  variant?: 'secondary' | 'danger';
}

export function SettingsButton({ label, icon, onPress, variant = 'secondary' }: SettingsButtonProps) {
  const isDanger = variant === 'danger';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        !isDanger && styles.secondaryBorder,
        pressed && { backgroundColor: colors.surfaceContainerHigh },
      ]}
    >
      <View style={styles.content}>
        <MaterialIcons
          name={icon}
          size={18}
          color={isDanger ? colors.danger : colors.primary}
        />
        <Text
          style={[
            typography.button,
            { color: isDanger ? colors.danger : colors.primary, marginLeft: spacing.sm },
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBorder: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});