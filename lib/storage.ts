import AsyncStorage from '@react-native-async-storage/async-storage';
import { databases, appwriteIds, appwriteReady, ID } from '@/lib/appwrite';
import { initialData } from '@/lib/mockData';
import { AppData, Listing, Rating, Report } from '@/types';

const STORAGE_KEY = 'foodbridge-data-v1';

const normalizeListing = (doc: any): Listing => ({
  id: doc.$id ?? doc.id,
  kind: doc.kind,
  ownerId: doc.ownerId,
  title: doc.title,
  foodName: doc.foodName,
  description: doc.description,
  address: doc.address,
  quantity: doc.quantity,
  price: Number(doc.price ?? 0),
  isVeg: Boolean(doc.isVeg),
  imageUri: doc.imageUri,
  availableFrom: doc.availableFrom,
  availableTill: doc.availableTill,
  contact: doc.contact,
  pickupInstructions: doc.pickupInstructions,
  eventType: doc.eventType,
  organizerName: doc.organizerName,
  expectedCrowd: doc.expectedCrowd,
  isRecurring: Boolean(doc.isRecurring),
  createdAt: doc.createdAt ?? doc.$createdAt,
  ratingAverage: Number(doc.ratingAverage ?? 0),
  ratingCount: Number(doc.ratingCount ?? 0),
  reportCount: Number(doc.reportCount ?? 0),
  verified: Boolean(doc.verified),
  lastConfirmedAt: doc.lastConfirmedAt ?? doc.$updatedAt,
});

const normalizeRating = (doc: any): Rating => ({
  id: doc.$id ?? doc.id,
  listingId: doc.listingId,
  stars: Number(doc.stars),
  hygiene: doc.hygiene ? Number(doc.hygiene) : undefined,
  quantity: doc.quantity ? Number(doc.quantity) : undefined,
  availability: doc.availability ? Number(doc.availability) : undefined,
  text: doc.text,
  tags: Array.isArray(doc.tags) ? doc.tags : [],
  createdAt: doc.createdAt ?? doc.$createdAt,
});

const normalizeReport = (doc: any): Report => ({
  id: doc.$id ?? doc.id,
  listingId: doc.listingId,
  reason: doc.reason,
  details: doc.details,
  createdAt: doc.createdAt ?? doc.$createdAt,
});

async function getLocalData(): Promise<AppData> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(raw) as AppData;
}

async function setLocalData(data: AppData) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function loadAppData(): Promise<AppData> {
  if (!appwriteReady) return getLocalData();

  const [listingDocs, ratingDocs, reportDocs] = await Promise.all([
    databases.listDocuments(appwriteIds.databaseId!, appwriteIds.listingsCollectionId!),
    databases.listDocuments(appwriteIds.databaseId!, appwriteIds.ratingsCollectionId!),
    databases.listDocuments(appwriteIds.databaseId!, appwriteIds.reportsCollectionId!),
  ]);

  return {
    listings: listingDocs.documents.map(normalizeListing),
    ratings: ratingDocs.documents.map(normalizeRating),
    reports: reportDocs.documents.map(normalizeReport),
  };
}

export async function createListing(listing: Listing) {
  if (!appwriteReady) {
    const data = await getLocalData();
    const updated = { ...data, listings: [listing, ...data.listings] };
    await setLocalData(updated);
    return listing;
  }

  const { id, ...listingData } = listing;

  await databases.createDocument(
    appwriteIds.databaseId!,
    appwriteIds.listingsCollectionId!,
    id || ID.unique(),
    listingData
  );

  return listing;
}



  export async function addRating(rating: Rating) {
  if (!appwriteReady) {
    const data = await getLocalData();
    const ratings = [rating, ...data.ratings];
    const listings = data.listings.map((item) => {
      if (item.id !== rating.listingId) return item;
      const listingRatings = ratings.filter((r) => r.listingId === item.id);
      const total = listingRatings.reduce((sum, entry) => sum + entry.stars, 0);
      return {
        ...item,
        ratingCount: listingRatings.length,
        ratingAverage: total / listingRatings.length,
        lastConfirmedAt: new Date().toISOString(),
      };
    });
    await setLocalData({ ...data, listings, ratings });
    return;
  }

  const { id, ...ratingData } = rating;

  await databases.createDocument(
    appwriteIds.databaseId!,
    appwriteIds.ratingsCollectionId!,
    id || ID.unique(),
    ratingData
  );
}

export async function addReport(report: Report) {
  if (!appwriteReady) {
    const data = await getLocalData();
    const reports = [report, ...data.reports];
    const listings = data.listings.map((item) =>
      item.id === report.listingId ? { ...item, reportCount: item.reportCount + 1 } : item
    );
    await setLocalData({ ...data, listings, reports });
    return;
  }

  const { id, ...reportData } = report;

  await databases.createDocument(
    appwriteIds.databaseId!,
    appwriteIds.reportsCollectionId!,
    id || ID.unique(),
    reportData
  );
}
export async function deleteListing(id: string) {
  if (!appwriteReady) {
    const data = await getLocalData();
    const updated = {
      ...data,
      listings: data.listings.filter((item) => item.id !== id),
      ratings: data.ratings.filter((item) => item.listingId !== id),
      reports: data.reports.filter((item) => item.listingId !== id),
    };
    await setLocalData(updated);
    return;
  }

  await databases.deleteDocument(
    appwriteIds.databaseId!,
    appwriteIds.listingsCollectionId!,
    id
  );
}

export async function updateListing(id: string, listing: Listing) {
  if (!appwriteReady) {
    const data = await getLocalData();
    const updated = {
      ...data,
      listings: data.listings.map((item) => (item.id === id ? listing : item)),
    };
    await setLocalData(updated);
    return;
  }

  const { id: _id, ...listingData } = listing;

  await databases.updateDocument(
    appwriteIds.databaseId!,
    appwriteIds.listingsCollectionId!,
    id,
    listingData
  );
}
