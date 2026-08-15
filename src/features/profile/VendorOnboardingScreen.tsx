import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { enabledMarketplaceSections, getCategory } from '../../config/category-taxonomy';
import { saveCloudVendorApplication } from './cloud-profile-service';
import { getVendorApplication, saveVendorApplication, type LocalVendorApplication } from './local-vendor-service';

const businessCategories = enabledMarketplaceSections.flatMap((section) => section.categories.map((category) => category.name));

function SelectField({ label, onChange, options, value }: { label: string; onChange: (value: string) => void; options: string[]; value: string }) {
  const [open, setOpen] = useState(false);
  return <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <Pressable onPress={() => setOpen((current) => !current)} style={styles.select}><Text style={[styles.selectText, !value && styles.placeholder]}>{value || `Select ${label.toLowerCase()}`}</Text><Text style={styles.chevron}>⌄</Text></Pressable>
    {open ? <View style={styles.options}>{options.map((option) => <Pressable key={option} onPress={() => { onChange(option); setOpen(false); }} style={styles.option}><Text style={styles.optionText}>{option}</Text></Pressable>)}</View> : null}
  </View>;
}

function BooleanChoice({ label, onChange, value }: { label: string; onChange: (value: boolean) => void; value: boolean }) {
  return <View style={styles.fieldGroup}><Text style={styles.label}>{label}</Text><View style={styles.segmented}><Pressable onPress={() => onChange(true)} style={[styles.segment, value && styles.segmentActive]}><Text style={[styles.segmentText, value && styles.segmentTextActive]}>Yes</Text></Pressable><Pressable onPress={() => onChange(false)} style={[styles.segment, !value && styles.segmentActive]}><Text style={[styles.segmentText, !value && styles.segmentTextActive]}>No</Text></Pressable></View></View>;
}

function Input({ label, onChangeText, placeholder, value, keyboardType = 'default', multiline = false }: { label: string; onChangeText: (value: string) => void; placeholder?: string; value: string; keyboardType?: 'default' | 'email-address' | 'phone-pad'; multiline?: boolean }) {
  return <View style={styles.fieldGroup}><Text style={styles.label}>{label}</Text><TextInput autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'} keyboardType={keyboardType} multiline={multiline} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#999" style={[styles.input, multiline && styles.multiline]} textAlignVertical={multiline ? 'top' : 'center'} value={value} /></View>;
}

export function VendorOnboardingScreen({ onBack, user }: { onBack: () => void; user: User }) {
  const [fullLegalName, setFullLegalName] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [region, setRegion] = useState('');
  const [cityTown, setCityTown] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [digitalAddress, setDigitalAddress] = useState('');
  const [gender, setGender] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [locationMode, setLocationMode] = useState<'gps' | 'same_as_personal'>('same_as_personal');
  const [gpsLocation, setGpsLocation] = useState('');
  const [physicalStore, setPhysicalStore] = useState(false);
  const [registeredBusiness, setRegisteredBusiness] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState('Phone');
  const [socialMediaLinks, setSocialMediaLinks] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const subcategories = getCategory(category)?.category.subcategories || [];

  useEffect(() => {
    getVendorApplication(user.uid).then((application) => {
      if (!application) return;
      setFullLegalName(application.personal.fullLegalName || user.displayName || '');
      setEmail(application.personal.email || user.email || '');
      setPhone(application.personal.phone);
      setDateOfBirth(application.personal.dateOfBirth);
      setRegion(application.personal.location.region);
      setCityTown(application.personal.location.cityTown);
      setResidentialAddress(application.personal.location.residentialAddress);
      setDigitalAddress(application.personal.location.digitalAddress);
      setGender(application.personal.gender);
      setBusinessName(application.business.name);
      setCategory(application.business.category);
      setSubcategory(application.business.subcategory);
      setLocationMode(application.business.locationMode);
      setGpsLocation(application.business.gpsLocation || '');
      setPhysicalStore(application.business.physicalStore);
      setRegisteredBusiness(application.business.registeredBusiness);
      setRegistrationNumber(application.business.registrationNumber || '');
      setPreferredContactMethod(application.business.preferredContactMethod);
      setSocialMediaLinks(application.business.socialMediaLinks || '');
      setStatus('Application saved on this device.');
    }).catch(() => undefined);
  }, [user.displayName, user.email, user.uid]);

  async function submit() {
    const required = [fullLegalName, email, phone, dateOfBirth, region, cityTown, residentialAddress, digitalAddress, gender, businessName, category, subcategory, preferredContactMethod];
    if (required.some((value) => !value.trim())) { setStatus('Complete all required fields first.'); return; }
    if (locationMode === 'gps' && !gpsLocation.trim()) { setStatus('Enter the business GPS location.'); return; }
    if (registeredBusiness && !registrationNumber.trim()) { setStatus('Enter the business registration number.'); return; }

    const application: LocalVendorApplication = {
      personal: {
        fullLegalName: fullLegalName.trim(), email: email.trim(), phone: phone.trim(), dateOfBirth: dateOfBirth.trim(),
        location: { region: region.trim(), cityTown: cityTown.trim(), residentialAddress: residentialAddress.trim(), digitalAddress: digitalAddress.trim() },
        gender,
      },
      business: {
        name: businessName.trim(), category, subcategory, locationMode,
        gpsLocation: locationMode === 'gps' ? gpsLocation.trim() : undefined,
        physicalStore, registeredBusiness,
        registrationNumber: registeredBusiness ? registrationNumber.trim() : undefined,
        preferredContactMethod,
        socialMediaLinks: socialMediaLinks.trim() || undefined,
      },
      status: 'pending',
    };

    try {
      setSubmitting(true);
      await saveVendorApplication(user.uid, application);
      try { await saveCloudVendorApplication(user.uid, application); setStatus('Vendor application submitted for review.'); }
      catch { setStatus('Application saved locally. Cloud sync will retry later.'); }
    } finally { setSubmitting(false); }
  }

  return <View style={styles.screen}>
    <View style={styles.header}><Pressable hitSlop={10} onPress={onBack}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.title}>Become a Vendor</Text><View style={styles.space} /></View>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Text style={styles.intro}>Submit your personal and business details for review.</Text>
      <Text style={styles.section}>Personal Details</Text>
      <Input label="Full legal name*" onChangeText={setFullLegalName} value={fullLegalName} />
      <Input keyboardType="email-address" label="Email*" onChangeText={setEmail} value={email} />
      <Input keyboardType="phone-pad" label="Phone*" onChangeText={setPhone} placeholder="+233 24 000 0000" value={phone} />
      <Input label="Date of birth*" onChangeText={setDateOfBirth} placeholder="YYYY-MM-DD" value={dateOfBirth} />
      <Input label="Region*" onChangeText={setRegion} placeholder="Greater Accra" value={region} />
      <Input label="City / town*" onChangeText={setCityTown} value={cityTown} />
      <Input label="Residential address*" onChangeText={setResidentialAddress} value={residentialAddress} />
      <Input label="Digital address*" onChangeText={setDigitalAddress} placeholder="GA-000-0000" value={digitalAddress} />
      <SelectField label="Gender*" onChange={setGender} options={['Female', 'Male', 'Non-binary', 'Prefer not to say']} value={gender} />

      <Text style={styles.section}>Business Details</Text>
      <Input label="Business name*" onChangeText={setBusinessName} value={businessName} />
      <SelectField label="Category*" onChange={(value) => { setCategory(value); setSubcategory(''); }} options={businessCategories} value={category} />
      <SelectField label="Subcategory*" onChange={setSubcategory} options={[...subcategories]} value={subcategory} />
      <SelectField label="Business location*" onChange={(value) => setLocationMode(value === 'Use personal address' ? 'same_as_personal' : 'gps')} options={['Use personal address', 'Enter GPS location']} value={locationMode === 'same_as_personal' ? 'Use personal address' : 'Enter GPS location'} />
      {locationMode === 'gps' ? <Input label="GPS coordinates or map link*" onChangeText={setGpsLocation} value={gpsLocation} /> : null}
      <BooleanChoice label="Do you have a physical store?*" onChange={setPhysicalStore} value={physicalStore} />
      <BooleanChoice label="Is the business registered?*" onChange={setRegisteredBusiness} value={registeredBusiness} />
      {registeredBusiness ? <Input label="Registration number*" onChangeText={setRegistrationNumber} value={registrationNumber} /> : null}
      <SelectField label="Preferred contact method*" onChange={setPreferredContactMethod} options={['Phone', 'Email', 'WhatsApp']} value={preferredContactMethod} />
      <Input label="Social media links (optional)" multiline onChangeText={setSocialMediaLinks} placeholder="Instagram, Facebook, TikTok, website" value={socialMediaLinks} />
      {status ? <Text style={styles.status}>{status}</Text> : null}
      <Pressable disabled={submitting} onPress={submit} style={[styles.submit, submitting && styles.disabled]}>{submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Submit Application</Text>}</Pressable>
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' }, header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' }, back: { color: '#333', fontSize: 34, lineHeight: 36 }, title: { color: '#222', fontSize: 19, fontWeight: '700' }, space: { width: 25 }, content: { padding: 18, paddingBottom: 60 }, intro: { color: '#666', fontSize: 13, lineHeight: 19, marginBottom: 22 }, section: { color: '#F45100', fontSize: 15, fontWeight: '800', marginTop: 8, marginBottom: 18 }, fieldGroup: { marginBottom: 18 }, label: { color: '#333', fontSize: 13, fontWeight: '700', marginBottom: 8 }, input: { height: 48, borderWidth: 1, borderColor: '#DDD', borderRadius: 10, color: '#222', fontSize: 14, paddingHorizontal: 13 }, multiline: { height: 90, paddingTop: 12 }, select: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#DDD', borderRadius: 10, paddingHorizontal: 13 }, selectText: { flex: 1, color: '#222', fontSize: 14, marginRight: 8 }, placeholder: { color: '#999' }, chevron: { color: '#777', fontSize: 20 }, options: { borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 8, marginTop: 4, overflow: 'hidden' }, option: { paddingHorizontal: 13, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' }, optionText: { color: '#333', fontSize: 13 }, segmented: { height: 44, flexDirection: 'row', borderWidth: 1, borderColor: '#DDD', borderRadius: 10, overflow: 'hidden' }, segment: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }, segmentActive: { backgroundColor: '#FFF1EA' }, segmentText: { color: '#666', fontSize: 13, fontWeight: '700' }, segmentTextActive: { color: '#F45100' }, status: { color: '#555', fontSize: 12, textAlign: 'center', marginVertical: 12 }, submit: { height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#F45100', marginTop: 5 }, submitText: { color: '#FFF', fontSize: 15, fontWeight: '800' }, disabled: { opacity: 0.6 },
});
