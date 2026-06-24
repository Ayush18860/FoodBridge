import React from 'react';
import { Redirect } from 'expo-router';
import { useAppData } from '@/context/AppContext';

export default function IndexScreen() {
  const { currentUser, authLoading } = useAppData();

  if (authLoading) {
    return null;
  }

  return currentUser ? <Redirect href="/(tabs)" /> : <Redirect href="/auth" />;
}