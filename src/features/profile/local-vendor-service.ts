import AsyncStorage from '@react-native-async-storage/async-storage';

export type LocalVendorApplication = {
  personal: {
    fullLegalName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    location: {
      region: string;
      cityTown: string;
      residentialAddress: string;
      digitalAddress: string;
    };
    gender: string;
  };
  business: {
    name: string;
    category: string;
    subcategory: string;
    locationMode: 'gps' | 'same_as_personal';
    gpsLocation?: string;
    physicalStore: boolean;
    registeredBusiness: boolean;
    registrationNumber?: string;
    preferredContactMethod: string;
    socialMediaLinks?: string;
  };
  status: 'pending';
};

type LegacyVendorApplication = {
  businessName?: string;
  category?: string;
  location?: string;
  phone?: string;
};

const key = (userId: string) => `@shopicom/vendor-application/${userId}`;
export async function getVendorApplication(userId: string): Promise<LocalVendorApplication | null> {
  const stored = await AsyncStorage.getItem(key(userId));
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as LocalVendorApplication | LegacyVendorApplication;
    if ('personal' in parsed && 'business' in parsed) return parsed;
    const migrated: LocalVendorApplication = {
      personal: {
        fullLegalName: '', email: '', phone: parsed.phone || '', dateOfBirth: '',
        location: { region: '', cityTown: parsed.location || '', residentialAddress: '', digitalAddress: '' },
        gender: '',
      },
      business: {
        name: parsed.businessName || '', category: parsed.category || '', subcategory: '',
        locationMode: 'same_as_personal', physicalStore: false, registeredBusiness: false,
        preferredContactMethod: 'Phone',
      },
      status: 'pending',
    };
    return migrated;
  } catch {
    return null;
  }
}
export async function saveVendorApplication(userId: string, application: LocalVendorApplication) { await AsyncStorage.setItem(key(userId), JSON.stringify(application)); }
