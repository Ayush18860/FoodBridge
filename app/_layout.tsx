import React from 'react';
import { Stack } from 'expo-router';
import { AppProvider } from '@/context/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="post" />
        <Stack.Screen name="listing/[id]" />
        <Stack.Screen name="edit/[id]" />
      </Stack>
    </AppProvider>
  );
}