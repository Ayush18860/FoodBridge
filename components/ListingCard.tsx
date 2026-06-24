import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Listing } from '@/types';
import { theme } from '@/constants/theme';
import { Badge } from '@/components/Badge';

export function ListingCard({ item }: { item: Listing & { distance?: number | null } }) {
  const priceLabel = item.kind === 'cheap-meal' ? `₹${item.price}` : 'Free';
  const typeLabel =
    item.kind === 'event'
      ? 'Event'
      : item.kind === 'free-meal'
      ? 'Free meal'
      : 'Cheap meal';

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/listing/${item.id}`)}>
      {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.image} /> : null}

      <View style={styles.content}>
        <View style={styles.rowWrap}>
          <Badge
            label={typeLabel}
            tone={
              item.kind === 'event'
                ? 'info'
                : item.kind === 'cheap-meal'
                ? 'default'
                : 'success'
            }
          />
          {item.verified ? <Badge label="Verified" tone="success" /> : null}
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.foodName}</Text>

        {/* 📍 ADDRESS */}
        <Text style={styles.meta}>{item.address}</Text>

        {/* 🔥 DISTANCE */}
        {item.distance != null && (
          <Text style={styles.distance}>
            📍 {item.distance.toFixed(1)} km away
          </Text>
        )}

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{priceLabel}</Text>
          <Text style={styles.rating}>
            ⭐ {item.ratingAverage.toFixed(1)} ({item.ratingCount})
          </Text>
        </View>

        <Text style={styles.time}>
          Available {item.availableFrom} - {item.availableTill}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f3e5d7',
  },
  content: {
    padding: 14,
    gap: 8,
  },
  rowWrap: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  meta: {
    fontSize: 13,
    color: theme.colors.muted,
  },

  // 🔥 NEW STYLE
  distance: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C96A16',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.primaryDark,
  },
  rating: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  time: {
    fontSize: 12,
    color: theme.colors.muted,
  },
});