import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { theme } from '@/constants/theme';

export function SearchBar({ value, onChangeText, placeholder = 'Search food or place' }: { value: string; onChangeText: (text: string) => void; placeholder?: string; }) {
  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  input: {
    height: 48,
    fontSize: 15,
    color: theme.colors.text,
  },
});
