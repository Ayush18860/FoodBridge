export type ListingKind = 'cheap-meal' | 'free-meal' | 'event';
export type EventType = 'gurudwara' | 'temple' | 'iftar' | 'ngo' | 'community';

export type RatingTag =
  | 'Good hygiene'
  | 'Fresh food'
  | 'Worth price'
  | 'Friendly staff'
  | 'Long queue'
  | 'Ran out early'
  | 'Easy pickup';

export type ReportReason =
  | 'Fake listing'
  | 'Wrong address'
  | 'Food unavailable'
  | 'Expired listing'
  | 'Unsafe hygiene'
  | 'Spam'
  | 'Abuse';

export interface Rating {
  id: string;
  listingId: string;
  stars: number;
  hygiene?: number;
  quantity?: number;
  availability?: number;
  text?: string;
  tags: RatingTag[];
  createdAt: string;
}

export interface Report {
  id: string;
  listingId: string;
  reason: ReportReason;
  details?: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  kind: ListingKind;
  title: string;
  foodName: string;
  description: string;
  address: string;
  quantity: string;
  price: number;
  isVeg: boolean;
  imageUri?: string;
  availableFrom: string;
  availableTill: string;
  contact: string;
  pickupInstructions?: string;
  eventType?: EventType;
  organizerName?: string;
  expectedCrowd?: 'Low' | 'Medium' | 'High';
  isRecurring?: boolean;
  createdAt: string;
  ratingAverage: number;
  ratingCount: number;
  reportCount: number;
  verified: boolean;
  lastConfirmedAt: string;
}

export interface AppData {
  listings: Listing[];
  ratings: Rating[];
  reports: Report[];
}
