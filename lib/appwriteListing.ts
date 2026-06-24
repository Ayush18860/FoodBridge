import { ID } from 'react-native-appwrite';
import { databases } from './appwrite';

const db = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const col = process.env.EXPO_PUBLIC_APPWRITE_LISTINGS_COLLECTION_ID!;

export const getListings = async () => {
  const res = await databases.listDocuments(db, col);
  return res.documents;
};

export const createListing = async (data: any) => {
  return databases.createDocument(db, col, ID.unique(), data);
};

export const deleteListing = async (id: string) => {
  return databases.deleteDocument(db, col, id);
};