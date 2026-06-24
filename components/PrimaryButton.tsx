import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '@/constants/theme';

export function PrimaryButton({ title, onPress, type = 'solid' }: { title: string; onPress: () => void; type?: 'solid' | 'outline'; }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, type === 'outline' ? styles.outline : styles.solid, pressed && { opacity: 0.9 }]}
    >
      <Text style={[styles.text, type === 'outline' && styles.outlineText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  solid: {
    backgroundColor: theme.colors.primary,
  },
  outline: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: '#fff',
  },
  text: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  outlineText: {
    color: theme.colors.primaryDark,
  },
});
