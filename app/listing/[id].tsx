import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Screen } from '@/components/Screen';
import { Badge } from '@/components/Badge';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { theme } from '@/constants/theme';
import { useAppData } from '@/context/AppContext';
import { openAddressInMaps } from '@/lib/location';
import { RatingTag, ReportReason } from '@/types';

const ratingTags: RatingTag[] = [
  'Good hygiene',
  'Fresh food',
  'Worth price',
  'Friendly staff',
  'Long queue',
  'Ran out early',
  'Easy pickup',
];

const reportReasons: ReportReason[] = [
  'Fake listing',
  'Wrong address',
  'Food unavailable',
  'Expired listing',
  'Unsafe hygiene',
  'Spam',
  'Abuse',
];

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { listings, ratings, addRating, addReport } = useAppData();

  const item = listings.find((entry) => entry.id === id);
  const listingRatings = useMemo(
    () => ratings.filter((entry) => entry.listingId === id),
    [ratings, id]
  );

  const [stars, setStars] = useState('5');
  const [text, setText] = useState('');
  const [tag, setTag] = useState<RatingTag>('Good hygiene');
  const [reason, setReason] = useState<ReportReason>('Fake listing');
  const [reportText, setReportText] = useState('');

  if (!item) {
    return (
      <Screen>
        <View style={styles.backWrap}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </View>
        <Text style={styles.notFound}>Listing not found.</Text>
      </Screen>
    );
  }

  const submitRating = async () => {
    await addRating({
      id: Date.now().toString(),
      listingId: item.id,
      stars: Number(stars),
      hygiene: Number(stars),
      quantity: Number(stars),
      availability: Number(stars),
      text,
      tags: [tag],
      createdAt: new Date().toISOString(),
    });

    setText('');
    Alert.alert('Thanks', 'Your rating has been added.');
  };

  const submitReport = async () => {
    await addReport({
      id: `${Date.now()}-report`,
      listingId: item.id,
      reason,
      details: reportText,
      createdAt: new Date().toISOString(),
    });

    setReportText('');
    Alert.alert('Report sent', 'Thanks for helping keep listings accurate.');
  };

  return (
    <Screen>
      <View style={styles.backWrap}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
      </View>

      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.image} />
      ) : null}

      <View style={styles.card}>
        <View style={styles.badges}>
          <Badge
            label={
              item.kind === 'event'
                ? 'Event'
                : item.price > 0
                ? 'Cheap meal'
                : 'Free meal'
            }
            tone={
              item.kind === 'event'
                ? 'info'
                : item.price > 0
                ? 'default'
                : 'success'
            }
          />
          {item.verified ? <Badge label="Verified" tone="success" /> : null}
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.foodName}</Text>
        <Text style={styles.line}>
          {item.description || 'No description added yet.'}
        </Text>
        <Text style={styles.line}>📍 {item.address}</Text>
        <Text style={styles.line}>🍽️ Quantity: {item.quantity}</Text>
        <Text style={styles.line}>
          ⏰ {item.availableFrom} - {item.availableTill}
        </Text>
        <Text style={styles.line}>📞 {item.contact}</Text>
        <Text style={styles.line}>
          ⭐ {item.ratingAverage.toFixed(1)} from {item.ratingCount} ratings
        </Text>
        <Text style={styles.line}>
          Last confirmed: {new Date(item.lastConfirmedAt).toLocaleString()}
        </Text>

        {item.kind === 'event' ? (
          <Text style={styles.line}>
            Event type: {item.eventType} • Crowd: {item.expectedCrowd}
          </Text>
        ) : null}
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <PrimaryButton
            title="Open in Google Maps"
            onPress={() => openAddressInMaps(item.address)}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Ratings & reviews</Text>

        <Text style={styles.small}>Quick tag</Text>
        <Picker selectedValue={tag} onValueChange={(value) => setTag(value)}>
          {ratingTags.map((entry) => (
            <Picker.Item key={entry} label={entry} value={entry} />
          ))}
        </Picker>

        <Text style={styles.small}>Stars</Text>
        <Picker selectedValue={stars} onValueChange={(value) => setStars(value)}>
          {['5', '4', '3', '2', '1'].map((entry) => (
            <Picker.Item
              key={entry}
              label={`${entry} star`}
              value={entry}
            />
          ))}
        </Picker>

        <FormField
          label="Review"
          value={text}
          onChangeText={setText}
          placeholder="What was good or bad?"
          multiline
        />

        <PrimaryButton title="Submit rating" onPress={submitRating} />

        {listingRatings.slice(0, 5).map((entry) => (
          <View key={entry.id} style={styles.review}>
            <Text style={styles.reviewStars}>
              ⭐ {entry.stars} • {entry.tags.join(', ')}
            </Text>
            <Text style={styles.reviewText}>
              {entry.text || 'No text review.'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Report listing</Text>

        <Picker
          selectedValue={reason}
          onValueChange={(value) => setReason(value)}
        >
          {reportReasons.map((entry) => (
            <Picker.Item key={entry} label={entry} value={entry} />
          ))}
        </Picker>

        <FormField
          label="What happened?"
          value={reportText}
          onChangeText={setReportText}
          placeholder="Wrong location, food unavailable, spam, etc."
          multiline
        />

        <PrimaryButton
          title="Submit report"
          onPress={submitReport}
          type="outline"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backWrap: {
    marginTop: 44,
    marginBottom: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  backText: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
  },
  notFound: {
    fontSize: 16,
    color: theme.colors.text,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    backgroundColor: '#f2e7d9',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.muted,
  },
  line: {
    color: theme.colors.text,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  small: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  review: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 4,
  },
  reviewStars: {
    fontWeight: '800',
    color: theme.colors.text,
  },
  reviewText: {
    color: theme.colors.muted,
  },
});