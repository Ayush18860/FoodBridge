import 'react-native-url-polyfill/auto';
import { Client, Account, Databases, Storage, ID } from 'react-native-appwrite';

const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const listingsCollectionId = process.env.EXPO_PUBLIC_APPWRITE_LISTINGS_COLLECTION_ID;
const ratingsCollectionId = process.env.EXPO_PUBLIC_APPWRITE_RATINGS_COLLECTION_ID;
const reportsCollectionId = process.env.EXPO_PUBLIC_APPWRITE_REPORTS_COLLECTION_ID;
const bucketId = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID;

const client = new Client();

if (endpoint) client.setEndpoint(endpoint);
if (projectId) client.setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const appwriteIds = {
  databaseId,
  listingsCollectionId,
  ratingsCollectionId,
  reportsCollectionId,
  bucketId,
};

export const appwriteReady = Boolean(
  endpoint &&
  projectId &&
  databaseId &&
  listingsCollectionId &&
  ratingsCollectionId &&
  reportsCollectionId
);
export { client };
export { ID };