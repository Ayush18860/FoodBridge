import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

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

  // Dropdown state
  const [tagOpen, setTagOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  const [reasonOpen, setReasonOpen] = useState(false);

  const tagItems = ratingTags.map((t) => ({
    label: t,
    value: t,
  }));

  const starItems = [
    { label: '⭐⭐⭐⭐⭐ 5 Stars', value: '5' },
    { label: '⭐⭐⭐⭐ 4 Stars', value: '4' },
    { label: '⭐⭐⭐ 3 Stars', value: '3' },
    { label: '⭐⭐ 2 Stars', value: '2' },
    { label: '⭐ 1 Star', value: '1' },
  ];

  const reasonItems = reportReasons.map((r) => ({
    label: r,
    value: r,
  }));

  if (!item) {
    return (
      <Screen>
        <View style={styles.backWrap}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </View>

        <Text style={styles.notFound}>
          Listing not found.
        </Text>
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

    Alert.alert(
      'Thanks',
      'Your rating has been added.'
    );
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

    Alert.alert(
      'Report sent',
      'Thanks for helping keep listings accurate.'
    );
  };

  return (
    <Screen>
      <View style={styles.backWrap}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
      </View>

      {item.imageUri ? (
        <Image
          source={{ uri: item.imageUri }}
          style={styles.image}
        />
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

          {item.verified && (
            <Badge
              label="Verified"
              tone="success"
            />
          )}
        </View>

        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.subtitle}>
          {item.foodName}
        </Text>

        <Text style={styles.line}>
          {item.description || 'No description added yet.'}
        </Text>

        <Text style={styles.line}>
          📍 {item.address}
        </Text>

        <Text style={styles.line}>
          🍽 Quantity: {item.quantity}
        </Text>

        <Text style={styles.line}>
          ⏰ {item.availableFrom} - {item.availableTill}
        </Text>

        <Text style={styles.line}>
          📞 {item.contact}
        </Text>

        <Text style={styles.line}>
          ⭐ {item.ratingAverage.toFixed(1)} from {item.ratingCount} ratings
        </Text>

        <Text style={styles.line}>
          Last confirmed:{' '}
          {new Date(item.lastConfirmedAt).toLocaleString()}
        </Text>

        {item.kind === 'event' && (
          <Text style={styles.line}>
            Event Type: {item.eventType} • Crowd: {item.expectedCrowd}
          </Text>
        )}
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <PrimaryButton
            title="Open in Google Maps"
            onPress={() => openAddressInMaps(item.address)}
          />
        </View>
      </View>

      <View style={[styles.card, { zIndex: 3000 }]}>
        <Text style={styles.heading}>Ratings & Reviews</Text>

        <Text style={styles.small}>Quick Tag</Text>

        <View style={{ zIndex: 3000, marginBottom: 15 }}>
          <DropDownPicker
            open={tagOpen}
            value={tag}
            items={tagItems}
            setOpen={setTagOpen}
            setValue={setTag}
            setItems={() => {}}
            placeholder="Select Tag"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
            listMode="SCROLLVIEW"
          />
        </View>

        <Text style={styles.small}>Stars</Text>

        <View style={{ zIndex: 2000, marginBottom: 15 }}>
          <DropDownPicker
            open={starOpen}
            value={stars}
            items={starItems}
            setOpen={setStarOpen}
            setValue={setStars}
            setItems={() => {}}
            placeholder="Select Rating"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
            listMode="SCROLLVIEW"
          />
        </View>

        <FormField
          label="Review"
          value={text}
          onChangeText={setText}
          placeholder="What was good or bad?"
          multiline
        />

        <PrimaryButton
          title="Submit Rating"
          onPress={submitRating}
        />

        {listingRatings.length === 0 ? (
          <Text style={styles.reviewText}>
            No reviews yet.
          </Text>
        ) : (
          listingRatings.slice(0, 5).map((entry) => (
            <View
              key={entry.id}
              style={styles.review}
            >
              <Text style={styles.reviewStars}>
                ⭐ {entry.stars} • {entry.tags.join(', ')}
              </Text>

              <Text style={styles.reviewText}>
                {entry.text || 'No review text.'}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={[styles.card, { zIndex: 2000 }]}>
        <Text style={styles.heading}>Report Listing</Text>

        <View style={{ zIndex: 1000, marginBottom: 15 }}>
          <DropDownPicker
            open={reasonOpen}
            value={reason}
            items={reasonItems}
            setOpen={setReasonOpen}
            setValue={setReason}
            setItems={() => {}}
            placeholder="Reason"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
            listMode="SCROLLVIEW"
          />
        </View>

        <FormField
          label="What happened?"
          value={reportText}
          onChangeText={setReportText}
          placeholder="Wrong location, food unavailable, spam..."
          multiline
        />

        <PrimaryButton
          title="Submit Report"
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
    overflow: 'visible',
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
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },

  dropdown: {
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 50,
  },

  dropdownContainer: {
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFF',
  },

  dropdownText: {
    color: '#000000',
    fontSize: 15,
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
