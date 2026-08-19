import type { Timestamp } from 'firebase/firestore';

export type ListingStatus = 'active' | 'archived' | 'draft' | 'sold';
export type NegotiationPreference = 'no' | 'not_sure' | 'yes';
export type DeliveryOption = 'in_store_pickup' | 'local_delivery';

export type CreateListingInput = {
  title: string;
  category: string;
  subCategory: string;
  type?: string;
  brand?: string;
  condition?: string;
  price: number;
  discount?: number;
  location: string;
  contactPhone?: string;
  deliveryOptions: DeliveryOption[];
  negotiation: NegotiationPreference;
  description: string;
  imageUrls: string[];
};

export type MarketplaceListing = CreateListingInput & {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string | null;
  status: ListingStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};
