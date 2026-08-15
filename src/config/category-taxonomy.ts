import { marketplaceFeatures, type MarketplaceFeature } from './marketplace-features';

export type MarketplaceCategory = {
  name: string;
  subcategories: readonly string[];
};

export type MarketplaceSection = {
  id: MarketplaceFeature;
  label: string;
  categories: readonly MarketplaceCategory[];
};

export const marketplaceTaxonomy: readonly MarketplaceSection[] = [
  {
    id: 'products',
    label: 'Products',
    categories: [
      { name: 'Mobile Phones & Tablets', subcategories: ['Smartphones', 'Tablets', 'Phone Accessories', 'Tablet Accessories'] },
      { name: 'Electronics', subcategories: ['TVs & Home Theatre', 'Audio & Speakers', 'Cameras & Camcorders', 'Computers & Laptops', 'Computer Accessories', 'Video Games & Consoles'] },
      { name: 'Vehicles', subcategories: ['Cars', 'Motorcycles & Scooters', 'Buses & Microbuses', 'Trucks & Trailers', 'Vehicle Parts & Accessories'] },
      { name: 'Fashion', subcategories: ["Men's Clothing", "Women's Clothing", "Kids' Clothing", 'Shoes', 'Bags & Wallets', 'Jewelry & Watches'] },
      { name: 'Health & Beauty', subcategories: ['Skincare', 'Makeup', 'Haircare & Wigs', 'Fragrances', 'Personal Care Equipment'] },
      { name: 'Home, Furniture & Appliances', subcategories: ['Furniture', 'Kitchen Appliances', 'Home Decor', 'Bedding & Linen', 'Home Appliances (fridges, AC, etc.)'] },
      { name: 'Babies & Kids', subcategories: ['Baby Gear', 'Baby Clothing', 'Toys', "Kids' Furniture"] },
      { name: 'Agriculture & Food', subcategories: ['Livestock & Poultry', 'Farm Equipment', 'Farm Produce', 'Seeds & Fertilizer'] },
      { name: 'Sports, Arts & Outdoors', subcategories: ['Sporting Goods', 'Musical Instruments', 'Books & Games', 'Camping & Outdoor Gear'] },
      { name: 'Pets', subcategories: ['Dogs', 'Cats', 'Birds', 'Pet Accessories & Food'] },
      { name: 'Tools & Equipment', subcategories: ['Construction Tools', 'Industrial Equipment', 'Power Tools'] },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    categories: [
      { name: 'Repair & Construction', subcategories: ['Electricians', 'Plumbers', 'Carpenters', 'Painters', 'Masons/Builders'] },
      { name: 'Automotive Services', subcategories: ['Mechanics', 'Car Wash & Detailing', 'Towing', 'Auto Electricians'] },
      { name: 'Beauty & Personal Care', subcategories: ['Hairdressers/Barbers', 'Makeup Artists', 'Spa & Massage'] },
      { name: 'Health Services', subcategories: ['Nursing/Home Care', 'Physiotherapy', 'Fitness Trainers'] },
      { name: 'Education & Training', subcategories: ['Tutoring', 'Driving Instructors', 'Skills Training'] },
      { name: 'Event Services', subcategories: ['Catering', 'Photography & Videography', 'DJs & MCs', 'Event Planning & Decor'] },
      { name: 'Cleaning Services', subcategories: ['Home Cleaning', 'Laundry & Dry Cleaning', 'Fumigation'] },
      { name: 'IT & Digital Services', subcategories: ['Web/App Development', 'Phone/Computer Repair', 'Graphic Design'] },
      { name: 'Logistics & Delivery', subcategories: ['Movers', 'Dispatch Riders', 'Courier Services'] },
      { name: 'Professional Services', subcategories: ['Legal', 'Accounting', 'Consulting', 'Photography for documents'] },
    ],
  },
  { id: 'hotels', label: 'Hotels', categories: [] },
  { id: 'jobs', label: 'Jobs', categories: [] },
  { id: 'food', label: 'Food', categories: [] },
  { id: 'property', label: 'Property', categories: [] },
] as const;

export const enabledMarketplaceSections = marketplaceTaxonomy.filter(
  (section) => marketplaceFeatures[section.id],
);

export function getMarketplaceSection(sectionLabelOrId: string) {
  const normalized = sectionLabelOrId.trim().toLowerCase();
  return enabledMarketplaceSections.find(
    (section) => section.id === normalized || section.label.toLowerCase() === normalized,
  );
}

export function getCategory(categoryName: string) {
  for (const section of enabledMarketplaceSections) {
    const category = section.categories.find((item) => item.name === categoryName);
    if (category) return { category, section };
  }
  return undefined;
}

export function listingBelongsToSection(categoryName: string, sectionId: MarketplaceFeature) {
  return marketplaceTaxonomy
    .find((section) => section.id === sectionId)
    ?.categories.some((category) => category.name === categoryName) ?? false;
}
