import { uploadImage } from '@/lib/uploadImage';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Screen } from '@/components/Screen';
import { FormField } from '@/components/FormField';
import { FilterChips } from '@/components/FilterChips';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionHeader } from '@/components/SectionHeader';
import { theme } from '@/constants/theme';
import { useAppData } from '@/context/AppContext';
import { EventType, Listing, ListingKind } from '@/types';
import { storage, appwriteIds, ID } from '@/lib/appwrite';
const typeOptions: ListingKind[] = ['cheap-meal', 'free-meal', 'event'];

export default function PostScreen() {
  const { createListing, currentUser } = useAppData();
  const [kind, setKind] = useState<ListingKind>('cheap-meal');
  const [title, setTitle] = useState('');
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTill, setAvailableTill] = useState('');
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [eventType, setEventType] = useState<EventType>('ngo');
  const [organizerName, setOrganizerName] = useState('');
  const [expectedCrowd, setExpectedCrowd] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [isRecurring, setIsRecurring] = useState(false);
  const [imageUri, setImageUri] = useState('');

  const heading = useMemo(() => kind === 'event' ? 'Post an event' : 'Give food', [kind]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

const submit = async () => {
  if (!currentUser) {
    Alert.alert('Sign in required', 'Please sign in before posting.');
    return;
  }

  if (!title || !foodName || !address || !quantity || !contact || !availableFrom || !availableTill) {
    Alert.alert('Missing details', 'Please fill the required fields first.');
    return;
  }

  try {
    let uploadedImageUrl = imageUri;

    // 🔥 Upload image to Appwrite
    if (imageUri) {
      uploadedImageUrl = await uploadImage(imageUri);
    }

    const listing: Listing = {
      id: Date.now().toString(),
      ownerId: currentUser.$id,

      kind,
      title,
      foodName,
      description,
      address,
      quantity,
      price: kind === 'cheap-meal' ? Number(price || 0) : 0,
      isVeg,

      // ✅ MUST BE THIS
      imageUri: uploadedImageUrl,

      availableFrom,
      availableTill,
      contact,
      pickupInstructions,
      eventType: kind === 'event' ? eventType : undefined,
      organizerName: kind === 'event' ? organizerName : undefined,
      expectedCrowd: kind === 'event' ? expectedCrowd : undefined,
      isRecurring: kind === 'event' ? isRecurring : undefined,

      createdAt: new Date().toISOString(),
      ratingAverage: 0,
      ratingCount: 0,
      reportCount: 0,
      verified: false,
      lastConfirmedAt: new Date().toISOString(),
    };

    await createListing(listing);

    Alert.alert('Posted', 'Your listing is live.');
    router.back();
  } catch (err: any) {
    Alert.alert('Error', err?.message || 'Upload failed');
  }
};
  return (
    <Screen>
      <PrimaryButton title="Close" onPress={() => router.back()} type="outline" />
      <SectionHeader title={heading} subtitle="Add address, food, quantity, price, or event details" />
      <FilterChips options={typeOptions} value={kind} onChange={(value) => setKind(value as ListingKind)} />

      <FormField label={kind === 'event' ? 'Event title' : 'Listing title'} value={title} onChangeText={setTitle} placeholder="Student meal, langar, iftar" />
      <FormField label="Food name" value={foodName} onChangeText={setFoodName} placeholder="Biryani, idli, community lunch" />
      <FormField label="Address" value={address} onChangeText={setAddress} placeholder="Full pickup address" />
      <FormField label="Quantity" value={quantity} onChangeText={setQuantity} placeholder="10 plates, 200 servings" />
      {kind === 'cheap-meal' ? <FormField label="Price" value={price} onChangeText={setPrice} placeholder="35" keyboardType="numeric" /> : null}
      <FormField label="Available from" value={availableFrom} onChangeText={setAvailableFrom} placeholder="07:00 PM" />
      <FormField label="Available till" value={availableTill} onChangeText={setAvailableTill} placeholder="09:00 PM" />
      <FormField label="Contact" value={contact} onChangeText={setContact} placeholder="Phone number" keyboardType="phone-pad" />
      <FormField label="Pickup instructions" value={pickupInstructions} onChangeText={setPickupInstructions} placeholder="Counter on left side, bring container" multiline />
      <FormField label="Description" value={description} onChangeText={setDescription} placeholder="Extra notes to help people" multiline />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Veg only</Text>
        <Switch value={isVeg} onValueChange={setIsVeg} />
      </View>

      {kind === 'event' ? (
        <View style={styles.card}>
          <Text style={styles.label}>Event type</Text>
          <Picker selectedValue={eventType} onValueChange={(value) => setEventType(value as EventType)}>
            <Picker.Item label="Gurudwara" value="gurudwara" />
            <Picker.Item label="Temple" value="temple" />
            <Picker.Item label="Iftar" value="iftar" />
            <Picker.Item label="NGO" value="ngo" />
            <Picker.Item label="Community" value="community" />
          </Picker>
          <FormField label="Organizer name" value={organizerName} onChangeText={setOrganizerName} placeholder="Trust, seva group, organizer" />
          <Text style={styles.label}>Expected crowd</Text>
          <Picker selectedValue={expectedCrowd} onValueChange={(value) => setExpectedCrowd(value)}>
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="High" value="High" />
          </Picker>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Recurring event</Text>
            <Switch value={isRecurring} onValueChange={setIsRecurring} />
          </View>
        </View>
      ) : null}

      <Pressable style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>{imageUri ? 'Change image' : 'Pick image'}</Text>
        <Text style={styles.imageHint}>{imageUri || 'Upload a meal/event image from your phone'}</Text>
      </Pressable>

      <PrimaryButton title="Publish listing" onPress={submit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    minHeight: 54,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
    gap: 8,
  },
  imageButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  imageButtonText: { fontWeight: '800', color: theme.colors.primaryDark },
  imageHint: { color: theme.colors.muted, fontSize: 12 },
});
