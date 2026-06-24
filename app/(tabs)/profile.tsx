import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Badge } from '@/components/Badge';
import { SectionHeader } from '@/components/SectionHeader';
import { useAppData } from '@/context/AppContext';
import { theme } from '@/constants/theme';

export default function ProfileScreen() {
  const {
    listings,
    ratings,
    reports,
    currentUser,
    authLoading,
    signOutUser,
    deleteListing,
  } = useAppData();

  const myPosts = currentUser
    ? listings.filter((item) => item.ownerId === currentUser.$id)
    : [];

  const handleLogout = async () => {
    await signOutUser();
    router.replace('/auth');
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Delete listing',
      `Delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteListing(id);
              Alert.alert('Deleted', 'Your listing was removed.');
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Could not delete listing.');
            }
          },
        },
      ]
    );
  };

const handleEdit = (id: string) => {
  router.push({
    pathname: '/edit/[id]',
    params: { id },
  });
};

  return (
    <Screen>
      <SectionHeader title="Profile" subtitle="Your FoodBridge account" />

      {authLoading ? (
        <View style={styles.card}>
          <Text style={styles.sub}>Loading account...</Text>
        </View>
      ) : !currentUser ? (
        <View style={styles.card}>
          <Text style={styles.heading}>Not signed in</Text>
          <Text style={styles.sub}>
            Please log in to post food, rate listings, and manage your posts.
          </Text>

          <Pressable style={styles.button} onPress={() => router.push('/auth')}>
            <Text style={styles.buttonText}>Go to Login / Signup</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.name}>{currentUser.name || 'FoodBridge User'}</Text>
          <Text style={styles.sub}>{currentUser.email}</Text>

          <View style={styles.row}>
            <Badge label="Signed In" tone="success" />
            <Badge label="Active User" tone="info" />
          </View>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.heading}>My activity</Text>
        <Text style={styles.item}>Listings posted: {myPosts.length}</Text>
        <Text style={styles.item}>Ratings submitted: {ratings.length}</Text>
        <Text style={styles.item}>Reports submitted: {reports.length}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>My Posts</Text>

        {myPosts.length === 0 ? (
          <Text style={styles.emptyText}>You haven’t posted anything yet.</Text>
        ) : (
          myPosts.map((item) => (
            <View key={item.id} style={styles.postCard}>
              <View style={styles.postTopRow}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Badge
                  label={
                    item.kind === 'free-meal'
                      ? 'Free'
                      : item.kind === 'event'
                      ? 'Event'
                      : 'Meal'
                  }
                  tone={
                    item.kind === 'free-meal'
                      ? 'success'
                      : item.kind === 'event'
                      ? 'info'
                      : 'default'
                  }
                />
              </View>

              {!!item.foodName && <Text style={styles.postMeta}>{item.foodName}</Text>}
              {!!item.address && <Text style={styles.postMeta}>{item.address}</Text>}

              <View style={styles.actionRow}>
                <Pressable
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEdit(item.id)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>

                <Pressable
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item.id, item.title)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.text,
  },
  sub: {
    color: theme.colors.muted,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  item: {
    color: theme.colors.muted,
    lineHeight: 22,
  },
  emptyText: {
    color: theme.colors.muted,
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: 8,
    backgroundColor: '#FDECEC',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#C0392B',
    fontWeight: '700',
  },
  postCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    backgroundColor: '#FFFDFC',
    gap: 8,
  },
  postTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  postTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
  },
  postMeta: {
    color: theme.colors.muted,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FFF3E8',
  },
  deleteButton: {
    backgroundColor: '#FDECEC',
  },
  editButtonText: {
    color: '#C96A16',
    fontWeight: '700',
  },
  deleteButtonText: {
    color: '#C0392B',
    fontWeight: '700',
  },
});