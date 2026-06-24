import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, View, Image, Pressable, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Screen } from '@/components/Screen';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAppData } from '@/context/AppContext';

export default function EditListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { listings, updateListing } = useAppData();

  const listing = listings.find((item) => item.id === id);

  const [title, setTitle] = useState('');
  const [foodName, setFoodName] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');

  useEffect(() => {
    if (listing) {
      setTitle(listing.title);
      setFoodName(listing.foodName);
      setAddress(listing.address);
      setImageUri(listing.imageUri || '');
      setQuantity(String(listing.quantity));
      setPrice(String(listing.price));
    }
  }, [listing]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  if (!listing) {
    return (
      <Screen>
        <PrimaryButton title="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const handleUpdate = async () => {
    if (!title || !foodName || !address || !quantity) {
      Alert.alert('Missing details', 'Please fill all required fields.');
      return;
    }

    try {
      await updateListing(id!, {
        ...listing,
        title,
        foodName,
        address,
        imageUri,
        quantity: String(quantity),
        price: Number(price || 0),
        lastConfirmedAt: new Date().toISOString(),
      });

      Alert.alert('Updated', 'Your listing has been updated.');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not update listing.');
    }
  };

  return (
    <Screen>
      <PrimaryButton title="Back" onPress={() => router.back()} />

      {/* IMAGE PREVIEW */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      ) : null}

      {/* IMAGE PICKER */}
      <Pressable style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {imageUri ? 'Change Image' : 'Pick Image'}
        </Text>
      </Pressable>

      <FormField label="Title" value={title} onChangeText={setTitle} />
      <FormField label="Food Name" value={foodName} onChangeText={setFoodName} />
      <FormField label="Address" value={address} onChangeText={setAddress} />
      <FormField label="Quantity" value={quantity} onChangeText={setQuantity} />
      <FormField
        label="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <PrimaryButton title="Update Listing" onPress={handleUpdate} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E5E0DA',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  imageButtonText: {
    fontWeight: '800',
    color: '#C96A16',
  },
});