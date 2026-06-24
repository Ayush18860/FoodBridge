import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { theme } from '@/constants/theme';

export function FilterChips({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void; }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable key={option} style={[styles.chip, active && styles.active]} onPress={() => onChange(option)}>
            <Text style={[styles.text, active && styles.activeText]}>{option}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 999,
  },
  active: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  activeText: {
    color: '#fff',
  },
});
