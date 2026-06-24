import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';

import { Screen } from '@/components/Screen';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/SectionHeader';
import { ListingCard } from '@/components/ListingCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAppData } from '@/context/AppContext';
import { theme } from '@/constants/theme';

export default function HomeScreen() {
  const { listings, loading, refresh } = useAppData();

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState<any>(null);
  const [radius, setRadius] = useState<number | null>(3);

  // 🔄 Refresh when screen opens
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // 📍 Get user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  // 🔍 Filter + SORT listings
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    let result = listings
      .map((item: any) => {
        let distance = null;

        if (location && item.latitude && item.longitude) {
          const R = 6371;
          const dLat = (item.latitude - location.latitude) * (Math.PI / 180);
          const dLon = (item.longitude - location.longitude) * (Math.PI / 180);

          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(location.latitude * (Math.PI / 180)) *
              Math.cos(item.latitude * (Math.PI / 180)) *
              Math.sin(dLon / 2) ** 2;

          distance =
            2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        }

        return { ...item, distance };
      })
      .filter((item: any) => {
        const matchesSearch =
          !q ||
          [item.title, item.foodName, item.address]
            .join(' ')
            .toLowerCase()
            .includes(q);

        if (!location || item.distance == null) return matchesSearch;
        if (radius === null) return matchesSearch;

        return matchesSearch && item.distance <= radius;
      });

    // 🔥 SORT NEAREST FIRST
    result.sort((a: any, b: any) => {
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });

    return result;
  }, [listings, search, location, radius]);

  const happeningNow = filtered
    .filter((item: any) => item.kind !== 'cheap-meal')
    .slice(0, 3);

  const cheapMeals = filtered
    .filter((item: any) => item.kind === 'cheap-meal')
    .slice(0, 3);

  const topRated = [...filtered]
    .sort((a: any, b: any) => b.ratingAverage - a.ratingAverage)
    .slice(0, 3);

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.headerTitle}>FoodBridge</Text>
      </View>

      <SearchBar value={search} onChangeText={setSearch} />

      {/* 🔥 Radius Selector */}
      <View style={styles.radiusContainer}>
        {[1, 3, 5, null].map((r) => (
          <Pressable
            key={String(r)}
            style={[
              styles.radiusButton,
              radius === r && styles.radiusActive,
            ]}
            onPress={() => setRadius(r)}
          >
            <Text style={styles.radiusText}>
              {r ? `${r} km` : 'All'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.quickGrid}>
        {[
          ['Under ₹50', '/(tabs)/meals'],
          ['Free Food Now', '/(tabs)/free-food'],
          ['Veg Only', '/(tabs)/meals'],
          ['Give Food', '/post'],
        ].map(([label, path]) => (
          <Pressable
            key={label}
            style={styles.quickCard}
            onPress={() => router.push(path as any)}
          >
            <Text style={styles.quickText}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Happening Now 🔥" subtitle="Nearby events" />
      {happeningNow.map((item: any) => (
        <ListingCard key={item.id} item={item} />
      ))}

      <SectionHeader title="Cheap Meals 💰" subtitle="Budget options" />
      {cheapMeals.map((item: any) => (
        <ListingCard key={item.id} item={item} />
      ))}

      <SectionHeader title="Top Rated ⭐" />
      {topRated.map((item: any) => (
        <ListingCard key={item.id} item={item} />
      ))}

      {loading && (
        <Text style={styles.loading}>Refreshing listings…</Text>
      )}

      <PrimaryButton
        title="Post a meal or event"
        onPress={() => router.push('/post')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 36,
    marginBottom: 16,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: theme.colors.text,
  },

  radiusContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  radiusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  radiusActive: {
    backgroundColor: '#C96A16',
    borderColor: '#C96A16',
  },

  radiusText: {
    fontWeight: '700',
    color: '#333',
  },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 18,
  },

  quickCard: {
    width: '47%',
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
  },

  quickText: {
    fontWeight: '800',
    color: theme.colors.text,
  },

  loading: {
    textAlign: 'center',
    color: theme.colors.muted,
  },
});