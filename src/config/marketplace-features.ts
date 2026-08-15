export const marketplaceFeatures = {
  products: true,
  services: true,
  hotels: false,
  jobs: false,
  food: false,
  property: false,
} as const;

export type MarketplaceFeature = keyof typeof marketplaceFeatures;
