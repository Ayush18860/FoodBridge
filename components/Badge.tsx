import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

export function Badge({ label, tone = 'default' }: { label: string; tone?: 'default' | 'success' | 'info' | 'danger'; }) {
  const bg = tone === 'success' ? '#E6F6EC' : tone === 'info' ? '#EAF1FF' : tone === 'danger' ? '#FDEDEC' : '#FFF2E2';
  const fg = tone === 'success' ? theme.colors.success : tone === 'info' ? theme.colors.info : tone === 'danger' ? theme.colors.danger : theme.colors.primaryDark;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}> 
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
