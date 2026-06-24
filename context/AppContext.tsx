import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  loadAppData,
  createListing as storeListing,
  addRating as storeRating,
  addReport as storeReport,
  deleteListing as removeListing,
  updateListing as editListing,
} from '@/lib/storage';

import {
  getCurrentUser,
  signIn as appwriteSignIn,
  signOut as appwriteSignOut,
  signUp as appwriteSignUp,
} from '@/lib/auth';

import { AppData, Listing, Rating, Report } from '@/types';
import { client, appwriteIds, appwriteReady } from '@/lib/appwrite';

type AuthUser = {
  $id: string;
  name?: string;
  email?: string;
};

interface AppContextValue extends AppData {
  loading: boolean;
  authLoading: boolean;
  currentUser: AuthUser | null;
  refresh: () => Promise<void>;
  createListing: (listing: Listing) => Promise<void>;
  addRating: (rating: Rating) => Promise<void>;
  addReport: (report: Report) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  updateListing: (id: string, listing: Listing) => Promise<void>;
  signInUser: (email: string, password: string) => Promise<void>;
  signUpUser: (name: string, email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>({
    listings: [],
    ratings: [],
    reports: [],
  });

  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // ✅ refresh function FIRST
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await loadAppData();
      setData(next);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ realtime AFTER refresh is defined
useEffect(() => {
  if (!client) return;

  let unsubscribe: any;

  try {
    unsubscribe = client.subscribe(
      `databases.${appwriteIds.databaseId}.collections.${appwriteIds.listingsCollectionId}.documents`,
      (response) => {
        console.log('Realtime update:', response);
        refresh();
      }
    );
  } catch (err) {
    console.log('Realtime error:', err);
  }

  return () => {
    if (unsubscribe) unsubscribe();
  };
}, []);
  const loadCurrentUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(
        user ? { $id: user.$id, name: user.name, email: user.email } : null
      );
    } catch {
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    loadCurrentUser();
  }, [refresh, loadCurrentUser]);

  const createListing = useCallback(async (listing: Listing) => {
    await storeListing(listing);
    await refresh();
  }, [refresh]);

  const addRating = useCallback(async (rating: Rating) => {
    await storeRating(rating);
    await refresh();
  }, [refresh]);

  const addReport = useCallback(async (report: Report) => {
    await storeReport(report);
    await refresh();
  }, [refresh]);

  const deleteListing = useCallback(async (id: string) => {
    await removeListing(id);
    await refresh();
  }, [refresh]);

  const updateListing = useCallback(async (id: string, listing: Listing) => {
    await editListing(id, listing);
    await refresh();
  }, [refresh]);

  const signInUser = useCallback(async (email: string, password: string) => {
    const user = await appwriteSignIn(email, password);
    setCurrentUser(
      user ? { $id: user.$id, name: user.name, email: user.email } : null
    );
  }, []);

  const signUpUser = useCallback(async (name: string, email: string, password: string) => {
    const user = await appwriteSignUp(name, email, password);
    setCurrentUser(
      user ? { $id: user.$id, name: user.name, email: user.email } : null
    );
  }, []);

  const signOutUser = useCallback(async () => {
    await appwriteSignOut();
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({
      ...data,
      loading,
      authLoading,
      currentUser,
      refresh,
      createListing,
      addRating,
      addReport,
      deleteListing,
      updateListing,
      signInUser,
      signUpUser,
      signOutUser,
    }),
    [
      data,
      loading,
      authLoading,
      currentUser,
      refresh,
      createListing,
      addRating,
      addReport,
      deleteListing,
      updateListing,
      signInUser,
      signUpUser,
      signOutUser,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppData must be used within AppProvider');
  }
  return context;
}