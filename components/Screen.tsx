import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

export function Screen({ children, scroll = true, contentContainerStyle }: { children: React.ReactNode; scroll?: boolean; contentContainerStyle?: ViewStyle; }) {
  const content = scroll ? (
    <ScrollView contentContainerStyle={[styles.content, contentContainerStyle]} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    children
  );

  return <SafeAreaView style={styles.safe}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 16,
  },
});
