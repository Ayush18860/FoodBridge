import { storage, appwriteIds, ID } from '@/lib/appwrite';

export async function uploadImage(imageUri: string) {
  try {
    const file = await storage.createFile(
      appwriteIds.bucketId!,
      ID.unique(),
      {
        uri: imageUri,
        name: `foodbridge-${Date.now()}.jpg`,
        type: 'image/jpeg',
        size: 500000, // ✅ REQUIRED
      }
    );

    // ✅ Public image URL
    const imageUrl =
      `https://sgp.cloud.appwrite.io/v1/storage/buckets/` +
      `${appwriteIds.bucketId}/files/${file.$id}/view?project=` +
      `${process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID}`;

    return imageUrl;
  } catch (err) {
    console.log('UPLOAD ERROR:', err);
    throw err;
  }
}