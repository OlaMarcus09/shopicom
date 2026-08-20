import { marketplaceFeatures, type MarketplaceFeature } from './marketplace-features';

export type MarketplaceSubcategory = {
  name: string;
  itemTypes: readonly string[];
};

export type MarketplaceCategory = {
  name: string;
  subcategories: readonly MarketplaceSubcategory[];
};

export type MarketplaceSection = {
  id: MarketplaceFeature;
  label: string;
  categories: readonly MarketplaceCategory[];
};

const subcategory = (name: string, itemTypes: readonly string[] = []): MarketplaceSubcategory => ({ name, itemTypes });

export const marketplaceTaxonomy: readonly MarketplaceSection[] = [
  {
    id: 'products',
    label: 'Products',
    categories: [
      { name: 'Recommend', subcategories: [subcategory('Trending')] },
      {
        name: 'Fashion',
        subcategories: [
          subcategory("Men's Fashion", ['T-Shirts', 'Shirts', 'Jeans & Trousers', 'Shorts', 'Jalabia', 'Hoodies & Jackets', 'Traditional Wear', 'Sneakers', 'Formal Shoes', 'Sandals', 'Watches', 'Belts', 'Caps & Hats']),
          subcategory("Women's Fashion", ['Dresses', 'Tops & Blouses', 'Skirts', 'Hijabs & Abaya', 'Jeans & Trousers', 'Traditional Wear', 'Heels', 'Flats', 'Sneakers', 'Bags', 'Jewelry', 'Scarves']),
          subcategory('Bags & Luggage', ['Handbags', 'Backpacks', 'Travel Bags', 'Suitcases']),
          subcategory('Jewelry & Watches', ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Watches']),
          subcategory('Fashion Accessories', ['Sunglasses', 'Hats & Caps', 'Wallets', 'Belts']),
        ],
      },
      {
        name: 'Phones & Tablets',
        subcategories: [
          subcategory('Mobile Phones', ['Apple', 'Samsung', 'Xiaomi', 'Tecno', 'Infinix', 'itel', 'Oppo', 'Vivo', 'Realme', 'Huawei', 'Nokia', 'Motorola', 'Google Pixel', 'Honor', 'Sony', 'Asus']),
          subcategory('Tablets', ['Apple iPad', 'Samsung', 'Lenovo', 'Huawei', 'Xiaomi', 'Amazon Fire', 'Microsoft Surface', 'Nokia']),
          subcategory('Accessories', ['Chargers & Adapters', 'Power Banks', 'Earphones & Headphones', 'Bluetooth Devices', 'Phone Cases & Covers', 'Screen Protectors', 'Cables', 'Memory Cards', 'Phone Holders & Stands', 'More']),
        ],
      },
      {
        name: 'Electronics',
        subcategories: [
          subcategory('TVs & Audio', ['Televisions', 'Smart TVs', 'Sound Systems', 'Home Theaters', 'Soundbars', 'Speakers', 'Headphones & Earphones']),
          subcategory('Gaming', ['Gaming Consoles', 'Gaming Accessories', 'Video Games']),
          subcategory('Cameras & Photography', ['Digital Cameras', 'DSLR Cameras', 'CCTV Cameras', 'Camera Accessories']),
          subcategory('Power & Electrical', ['Generators', 'Inverters', 'UPS', 'Extension Cables', 'Solar Equipment']),
          subcategory('Wearable Devices', ['Smart Watches', 'Fitness Bands']),
          subcategory('Accessories', ['Remote Controls', 'TV Mounts', 'Batteries', 'Adapters']),
        ],
      },
      {
        name: 'Laptops & Computers',
        subcategories: [
          subcategory('Laptops', ['Apple MacBook', 'HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'Microsoft Surface', 'Samsung', 'MSI', 'Razer']),
          subcategory('Desktop Computers', ['HP', 'Dell', 'Lenovo', 'Apple iMac', 'Asus', 'Acer', 'Custom Builds']),
          subcategory('Monitors', ['Samsung', 'LG', 'Dell', 'HP', 'Asus', 'Acer']),
          subcategory('Computer Accessories', ['Keyboards', 'Mice', 'Webcam', 'Laptop Bags', 'Cooling Pads']),
          subcategory('Storage Devices', ['HDD', 'SSD', 'External Drives', 'USB Flash Drives']),
        ],
      },
      {
        name: 'Home, Furniture & Appliances',
        subcategories: [
          subcategory('Living Room Furniture', ['Sofas & Couches', 'TV Stands', 'Coffee Tables']),
          subcategory('Bedroom Furniture', ['Beds & Mattresses', 'Wardrobes', 'Dressers']),
          subcategory('Office Furniture', ['Office Chairs', 'Office Desks']),
          subcategory('Outdoor Furniture', ['Garden Chairs', 'Outdoor Tables']),
          subcategory('Kitchen Appliances', ['Refrigerators', 'Microwaves', 'Blenders', 'Cookers & Ovens']),
          subcategory('Cleaning Appliances', ['Washing Machines', 'Vacuum Cleaners']),
          subcategory('Cooling & Heating', ['Air Conditioners', 'Fans', 'Heaters']),
          subcategory('Home Decor', ['Curtains & Blinds', 'Carpets & Rugs', 'Wall Art & Frames', 'Lighting']),
          subcategory('Kitchen & Dining', ['Cookware', 'Plates & Utensils', 'Kitchen Storage', 'Dining Sets']),
          subcategory('Bedding & Bath', ['Bed Sheets & Duvets', 'Pillows', 'Towels', 'Bathroom Accessories']),
          subcategory('Tools & Home Improvement', ['Power Tools', 'Hand Tools', 'Electrical Fittings', 'Plumbing Materials']),
        ],
      },
      {
        name: 'Beauty & Personal Care',
        subcategories: [
          subcategory('Face Care', ['Cleansers', 'Moisturizers', 'Serums', 'Face Masks']),
          subcategory('Body Care', ['Body Lotions', 'Body Oils', 'Scrubs']),
          subcategory('Sun Care', ['Sunscreen', 'After Sun Care']),
          subcategory('Hair Care', ['Shampoos', 'Conditioners', 'Hair Oils', 'Hair Treatments', 'Hair Styling Products']),
          subcategory('Face Makeup', ['Foundation', 'Powder', 'Concealer']),
          subcategory('Eye Makeup', ['Mascara', 'Eyeliner', 'Eyeshadow']),
          subcategory('Lip Makeup', ['Lipstick', 'Lip Gloss']),
          subcategory('Fragrances', ['Perfumes', 'Body Sprays', 'Deodorants']),
          subcategory('Oral Care', ['Toothpaste', 'Toothbrush']),
          subcategory('Bath & Shower', ['Soaps', 'Shower Gels']),
          subcategory('Grooming', ['Shaving Kits', 'Trimmers']),
          subcategory('Beauty Tools & Accessories', ['Makeup Brushes', 'Hair Styling Tools', 'Mirrors', 'Nail Tools']),
        ],
      },
      {
        name: 'Health & Fitness',
        subcategories: [
          subcategory('Cardio Equipment', ['Treadmills', 'Exercise Bikes', 'Ellipticals']),
          subcategory('Strength Training', ['Dumbbells', 'Barbells', 'Weight Benches']),
          subcategory('Home Workout', ['Resistance Bands', 'Skipping Ropes', 'Yoga Mats']),
          subcategory('Medical Devices', ['Blood Pressure Monitors', 'Glucose Meters', 'Thermometers']),
          subcategory('Mobility Aids', ['Wheelchairs', 'Walking Sticks']),
          subcategory('Wellness & Nutrition', ['Vitamins & Supplements', 'Protein & Fitness Supplements', 'Herbal Products']),
          subcategory('Personal Fitness Accessories', ['Fitness Trackers', 'Gym Gloves', 'Water Bottles', 'Waist Trainers']),
        ],
      },
      {
        name: 'Babies & Kids',
        subcategories: [
          subcategory('Baby Essentials', ['Diapers & Wipes', 'Baby Food & Formula', 'Feeding Accessories', 'Baby Care']),
          subcategory('Baby Gear', ['Strollers & Prams', 'Car Seats', 'Baby Carriers', 'Walkers']),
          subcategory('Clothing & Shoes', ['Baby Clothing 0-2yrs', 'Kids Clothing 3-12yrs', 'Shoes']),
          subcategory('Toys & Learning', ['Baby Toys', 'Educational Toys', 'Outdoor Toys', 'Games']),
          subcategory('Nursery & Furniture', ['Baby Cots & Cribs', 'Mattresses', 'Wardrobes', 'Storage']),
          subcategory('School Supplies', ['School Bags', 'Lunch Boxes', 'Books & Stationery']),
        ],
      },
      {
        name: 'Food, Agric & Farming',
        subcategories: [
          subcategory('Grains & Staples', ['Rice', 'Maize', 'Millet']),
          subcategory('Fruits & Vegetables', ['Fresh Fruits', 'Fresh Vegetables']),
          subcategory('Meat & Seafood', ['Chicken', 'Beef', 'Fish']),
          subcategory('Packaged Foods', ['Canned Foods', 'Snacks', 'Noodles & Pasta']),
          subcategory('Beverages', ['Soft Drinks', 'Juices', 'Water']),
          subcategory('Farming Inputs', ['Seeds & Seedlings', 'Fertilizers', 'Pesticides & Chemicals', 'Animal Feed']),
          subcategory('Livestock & Poultry', ['Chickens', 'Goats', 'Sheep', 'Cattle', 'Fowls', 'More']),
          subcategory('Farm Machinery & Tools', ['Tractors', 'Irrigation Equipment', 'Hand Tools']),
          subcategory('Agro Products Bulk Sales', ['Cocoa', 'Groundnuts', 'Shea Nuts', 'Palm Products']),
        ],
      },
      {
        name: 'Sports & Entertainment',
        subcategories: [
          subcategory('Football Equipment', ['Footballs', 'Boots', 'Jerseys']),
          subcategory('Basketball Equipment', ['Basketballs', 'Shoes']),
          subcategory('Fitness Gear', ['Dumbbells', 'Skipping Ropes', 'Yoga Mats']),
          subcategory('Outdoor & Recreation', ['Camping Gear', 'Picnic Equipment', 'Bicycles', 'Swimming Gear']),
          subcategory('Gaming & Consoles', ['PlayStation', 'Xbox', 'Nintendo']),
          subcategory('Gaming Accessories', ['Controllers', 'Headsets']),
          subcategory('Musical Instruments', ['Guitars', 'Keyboards', 'Drums']),
          subcategory('Audio Equipment', ['Speakers', 'Microphones']),
          subcategory('Movies & Media', ['DVDs & Blu-ray', 'Streaming Devices']),
          subcategory('Event & Entertainment Services', ['DJs', 'Event Equipment Rental', 'Party Supplies']),
        ],
      },
      {
        name: 'Tools & Equipment',
        subcategories: [
          subcategory('Power Tools', ['Drills', 'Grinders', 'Saws', 'Welding Machines']),
          subcategory('Hand Tools', ['Hammers', 'Screwdrivers', 'Spanners', 'Pliers']),
          subcategory('Electrical Tools', ['Testers', 'Wire Strippers', 'Cable Cutters']),
          subcategory('Plumbing Tools', ['Pipe Wrenches', 'Plungers', 'Pipe Cutters']),
          subcategory('Industrial Equipment', ['Air Compressors', 'Generators', 'Lifting Equipment']),
          subcategory('Safety Equipment', ['Helmets', 'Gloves', 'Safety Boots', 'Reflective Jackets']),
        ],
      },
      {
        name: 'Repair & Construction',
        subcategories: [
          subcategory('Home Repairs', ['Plumbing Services', 'Electrical Repairs', 'Appliance Repairs']),
          subcategory('Construction Services', ['Building Construction', 'Masonry', 'Carpentry', 'Roofing']),
          subcategory('Installation Services', ['Electrical Installation', 'CCTV Installation', 'AC Installation']),
          subcategory('Finishing & Interior', ['Painting', 'Tiling', 'POP Ceiling', 'Interior Design']),
          subcategory('Maintenance Services', ['Cleaning Services', 'Pest Control', 'Facility Maintenance']),
        ],
      },
      {
        name: 'Vehicles',
        subcategories: [
          subcategory('Cars', ['Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan', 'Mercedes-Benz', 'BMW', 'Volkswagen', 'Ford', 'Acura', 'Other']),
          subcategory('Motorcycles & Scooters', ['Apsonic', 'Luojia', 'Haujue', 'Sanya', 'Sonlink', 'Honda', 'Yamaha', 'Suzuki', 'Bajaj', 'Other']),
          subcategory('Trucks & Commercial Vehicles', ['Light Trucks', 'Heavy Trucks', 'Vans & Buses']),
          subcategory('Vehicle Parts & Accessories', ['Engine Parts', 'Tyres & Rims', 'Batteries', 'Car Electronics', 'Interior Accessories']),
          subcategory('Boats & Watercraft', ['Boats', 'Jet Skis', 'Marine Equipment']),
        ],
      },
      {
        name: 'Smoking Accessories',
        subcategories: [
          subcategory('Lighters & Matches'),
          subcategory('Ashtrays'),
          subcategory('Rolling Accessories', ['Rolling Papers', 'Rolling Machines', 'Storage & Cases']),
          subcategory('Hookah Accessories', ['Bowls', 'Hoses', 'Charcoal Accessories']),
        ],
      },
      {
        name: 'Animals & Pets',
        subcategories: [
          subcategory('Animals', ['Chickens', 'Goats', 'Sheep', 'Cattle']),
          subcategory('Pets/Live Animals', ['Dogs', 'Cats', 'Birds', 'Fish', 'Rabbits', 'Other']),
          subcategory('Pet Food', ['Dog Food', 'Cat Food', 'Bird Feed', 'Fish Feed']),
          subcategory('Pet Accessories', ['Collars & Leashes', 'Pet Beds', 'Feeding Bowls', 'Pet Clothing', 'Toys']),
          subcategory('Pet Health & Care', ['Grooming Products', 'Shampoos', 'Flea & Tick Control', 'Vitamins & Supplements']),
          subcategory('Farm Animal Supplies', ['Animal Feed', 'Housing & Cages', 'Farming Equipment']),
        ],
      },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    categories: [
      { name: 'Automotive Services', subcategories: ['Mechanics', 'Car Wash & Detailing', 'Towing', 'Auto Electricians'].map((name) => subcategory(name)) },
      { name: 'Beauty & Personal Care Services', subcategories: ['Hairdressers/Barbers', 'Makeup Artists', 'Spa & Massage'].map((name) => subcategory(name)) },
      { name: 'Health Services', subcategories: ['Nursing/Home Care', 'Physiotherapy', 'Fitness Trainers'].map((name) => subcategory(name)) },
      { name: 'Education & Training', subcategories: ['Tutoring', 'Driving Instructors', 'Skills Training'].map((name) => subcategory(name)) },
      { name: 'Event Services', subcategories: ['Catering', 'Photography & Videography', 'DJs & MCs', 'Event Planning & Decor'].map((name) => subcategory(name)) },
      { name: 'Cleaning Services', subcategories: ['Home Cleaning', 'Laundry & Dry Cleaning', 'Fumigation'].map((name) => subcategory(name)) },
      { name: 'IT & Digital Services', subcategories: ['Web/App Development', 'Phone/Computer Repair', 'Graphic Design'].map((name) => subcategory(name)) },
      { name: 'Logistics & Delivery', subcategories: ['Movers', 'Dispatch Riders', 'Courier Services'].map((name) => subcategory(name)) },
      { name: 'Professional Services', subcategories: ['Legal', 'Accounting', 'Consulting', 'Photography for documents'].map((name) => subcategory(name)) },
    ],
  },
  { id: 'hotels', label: 'Hotels', categories: [] },
  { id: 'jobs', label: 'Jobs', categories: [] },
  { id: 'food', label: 'Food', categories: [] },
  { id: 'property', label: 'Property', categories: [] },
] as const;

export const enabledMarketplaceSections = marketplaceTaxonomy.filter((section) => marketplaceFeatures[section.id]);

export function getMarketplaceSection(sectionLabelOrId: string) {
  const normalized = sectionLabelOrId.trim().toLowerCase();
  return enabledMarketplaceSections.find((section) => section.id === normalized || section.label.toLowerCase() === normalized);
}

export function getCategory(categoryName: string) {
  for (const section of enabledMarketplaceSections) {
    const category = section.categories.find((item) => item.name === categoryName);
    if (category) return { category, section };
  }
  return undefined;
}

export function getSubcategory(subcategoryName: string) {
  for (const section of enabledMarketplaceSections) {
    for (const category of section.categories) {
      const found = category.subcategories.find((item) => item.name === subcategoryName);
      if (found) return { subcategory: found, category, section };
    }
  }
  return undefined;
}

export function isMarketplaceItemType(itemType: string) {
  return enabledMarketplaceSections.some((section) => section.categories.some((category) => category.subcategories.some((item) => item.itemTypes.includes(itemType))));
}

export function listingBelongsToSection(categoryName: string, sectionId: MarketplaceFeature) {
  return marketplaceTaxonomy.find((section) => section.id === sectionId)?.categories.some((category) => category.name === categoryName) ?? false;
}
