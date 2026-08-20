import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { firebaseAuth } from '../../services/firebase';
import { enabledMarketplaceSections, getMarketplaceSection } from '../../config/category-taxonomy';
import { linkLocalListingToCloud, saveLocalListing } from './local-listing-service';
import { createListing } from './listing-service';

function SelectField({ label, value, options, onChange }: { label?: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.fieldGroup}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable onPress={() => setOpen((current) => !current)} style={styles.selectField}>
        <Text style={styles.selectText}>{value}</Text>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>
      {open ? <View style={styles.optionsMenu}>
        {options.map((option) => <Pressable key={option} onPress={() => { onChange(option); setOpen(false); }} style={styles.option}>
          <Text style={styles.optionText}>{option}</Text>
        </Pressable>)}
      </View> : null}
    </View>
  );
}

function Choice({ active, label, square = false, onPress }: { active: boolean; label: string; square?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.choice}>
      <View style={[square ? styles.checkbox : styles.radio, active && styles.choiceActive]}>
        {active ? <Text style={styles.check}>✓</Text> : null}
      </View>
      <Text style={styles.choiceLabel}>{label}</Text>
    </Pressable>
  );
}

export function CreateListingScreen({ onClose }: { onClose: () => void }) {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [location, setLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [listingSection, setListingSection] = useState(enabledMarketplaceSections[0]?.label || 'Products');
  const [category, setCategory] = useState('Select Category');
  const [subCategory, setSubCategory] = useState('Select Sub-Category');
  const [itemType, setItemType] = useState('');
  const [deliveryOptions, setDeliveryOptions] = useState<Array<'in_store_pickup' | 'local_delivery'>>(['in_store_pickup']);
  const [negotiation, setNegotiation] = useState<'yes' | 'no' | 'not_sure'>('not_sure');
  const selectedSection = getMarketplaceSection(listingSection);
  const selectedCategory = selectedSection?.categories.find((item) => item.name === category);
  const selectedSubcategory = selectedCategory?.subcategories.find((item) => item.name === subCategory);

  async function selectImages() {
    setStatusMessage(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setStatusMessage('Allow photo access to choose listing images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUris(result.assets.map((asset) => asset.uri).slice(0, 10));
    }
  }

  function removeImage(uri: string) {
    setImageUris((current) => current.filter((item) => item !== uri));
  }

  async function submitListing() {
    setStatusMessage(null);

    if (imageUris.length === 0 || title.trim().length < 3 || category === 'Select Category' || subCategory === 'Select Sub-Category' || !price || !location.trim() || !description.trim()) {
      setStatusMessage('Add a photo, title, category, sub-category, price, location, and description.');
      return;
    }

    const currentUser = firebaseAuth.currentUser;
    if (!currentUser) {
      setStatusMessage('Log in again before saving a listing.');
      return;
    }

    try {
      setIsPosting(true);
      const listingInput = {
        title: title.trim(),
        category,
        subCategory,
        type: itemType.trim() || undefined,
        price: Number(price),
        discount: discount ? Number(discount) : undefined,
        location: location.trim(),
        contactPhone: contactPhone.trim() || undefined,
        deliveryOptions,
        negotiation,
        description: description.trim(),
        imageUrls: imageUris,
      };
      const localListing = await saveLocalListing(listingInput, currentUser);
      try {
        setStatusMessage(`Uploading 0 of ${imageUris.length} photos...`);
        const cloudListing = await createListing(listingInput, ({ completed, total }) => {
          setStatusMessage(`Uploading ${completed} of ${total} photos...`);
        });
        await linkLocalListingToCloud(
          localListing.id,
          cloudListing.id,
          cloudListing.imageUrls,
        );
        setStatusMessage('Listing and photos saved to your account.');
      } catch (error) {
        const reason = error instanceof Error ? ` ${error.message}` : '';
        setStatusMessage(`Listing saved on this device, but cloud upload failed.${reason}`);
      }
      setTitle('');
      setPrice('');
      setDiscount('');
      setLocation('');
      setDescription('');
      setImageUris([]);
      setItemType('');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to post listing.');
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <View style={styles.backdrop}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Pressable hitSlop={10} onPress={onClose}><Text style={styles.back}>‹</Text></Pressable>
          <Text style={styles.headerTitle}>Post New Ads</Text>
          <Pressable hitSlop={10} onPress={onClose}><Text style={styles.close}>×</Text></Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Media upload</Text>
          <Pressable onPress={selectImages} style={styles.uploadBox}>
            <View style={styles.uploadIcon}><Text style={styles.uploadArrow}>↥</Text></View>
            <Text style={styles.uploadTitle}>Upload Media</Text>
            <Text style={styles.uploadHint}>Add a picture or video of what you want to sell.</Text>
            <Text style={styles.uploadHint}>Maximum file size: 20 MB</Text>
          </Pressable>

          {imageUris.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewRow}>
              {imageUris.map((uri) => <View key={uri} style={styles.previewWrap}><Image source={{ uri }} style={styles.preview} /><Pressable accessibilityLabel="Remove selected image" accessibilityRole="button" hitSlop={5} onPress={() => removeImage(uri)} style={styles.removePreview}><Text style={styles.removePreviewText}>×</Text></Pressable></View>)}
            </ScrollView>
          ) : null}

          <TextInput onChangeText={setTitle} placeholder="Ads Title*" placeholderTextColor="#999" style={styles.input} value={title} />
          <SelectField label="Listing Type*" value={listingSection} options={enabledMarketplaceSections.map((section) => section.label)} onChange={(value) => { setListingSection(value); setCategory('Select Category'); setSubCategory('Select Sub-Category'); }} />
          <SelectField label="Category*" value={category} options={selectedSection?.categories.map((item) => item.name) || []} onChange={(value) => { setCategory(value); setSubCategory('Select Sub-Category'); }} />
          <SelectField label="Sub-Category*" value={subCategory} options={selectedCategory?.subcategories.map((item) => item.name) || []} onChange={(value) => { setSubCategory(value); setItemType(''); }} />
          {selectedSubcategory?.itemTypes.length ? <SelectField label="Item type" value={itemType || 'Select item type'} options={[...selectedSubcategory.itemTypes]} onChange={setItemType} /> : null}

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.half}><Text style={styles.label}>Price*</Text><TextInput keyboardType="numeric" onChangeText={setPrice} placeholder="GHC" placeholderTextColor="#999" style={styles.smallInput} value={price} /></View>
            <View style={styles.half}><Text style={styles.label}>Discount</Text><TextInput keyboardType="numeric" onChangeText={setDiscount} placeholder="GHC" placeholderTextColor="#999" style={styles.smallInput} value={discount} /></View>
          </View>

          <Text style={styles.label}>Location*</Text>
          <View style={styles.locationField}><Text style={styles.pin}>⌖</Text><TextInput onChangeText={setLocation} placeholder="Business Location" placeholderTextColor="#999" style={styles.locationInput} value={location} /></View>

          <Text style={styles.label}>Contact Phone</Text>
          <TextInput keyboardType="phone-pad" onChangeText={setContactPhone} placeholder="e.g. +233 24 000 0000" placeholderTextColor="#999" style={styles.input} value={contactPhone} />

          <Text style={styles.sectionTitle}>Delivery Options</Text>
          <View style={styles.choiceRow}><Choice active={deliveryOptions.includes('in_store_pickup')} label="In-store Pickup" square onPress={() => setDeliveryOptions((current) => current.includes('in_store_pickup') ? current.filter((item) => item !== 'in_store_pickup') : [...current, 'in_store_pickup'])} /><Choice active={deliveryOptions.includes('local_delivery')} label="Local Delivery" square onPress={() => setDeliveryOptions((current) => current.includes('local_delivery') ? current.filter((item) => item !== 'local_delivery') : [...current, 'local_delivery'])} /></View>

          <Text style={styles.sectionTitle}>Are you open to negotiation?</Text>
          <View style={styles.choiceRow}><Choice active={negotiation === 'yes'} label="Yes" onPress={() => setNegotiation('yes')} /><Choice active={negotiation === 'no'} label="No" onPress={() => setNegotiation('no')} /><Choice active={negotiation === 'not_sure'} label="Not sure" onPress={() => setNegotiation('not_sure')} /></View>

          <Text style={[styles.label, styles.descriptionLabel]}>Description*</Text>
          <TextInput
            multiline
            maxLength={1050}
            onChangeText={setDescription}
            style={styles.description}
            textAlignVertical="top"
            value={description}
          />
          <View style={styles.descriptionMeta}><Text style={styles.metaText}>Give more detailed description or more info</Text><Text style={styles.metaText}>{description.length}/1050</Text></View>

          {statusMessage ? <Text style={styles.status}>{statusMessage}</Text> : null}
          <Pressable disabled={isPosting} onPress={submitListing} style={[styles.submit, isPosting && styles.disabled]}>{isPosting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Post Listing</Text>}</Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#AEB0AF', paddingHorizontal: 8, paddingTop: 8 },
  sheet: { flex: 1, overflow: 'hidden', borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: '#FFF' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E8E8E8', paddingHorizontal: 18 },
  back: { color: '#777', fontSize: 34, lineHeight: 36 },
  close: { color: '#777', fontSize: 28, lineHeight: 32, fontWeight: '300' },
  headerTitle: { color: '#111', fontSize: 20, fontWeight: '800' },
  content: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 112 },
  label: { color: '#242424', fontSize: 14, fontWeight: '700', marginBottom: 9 },
  uploadBox: { height: 148, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D7D0D0', borderRadius: 12, backgroundColor: '#FFFCFC', marginBottom: 26 },
  uploadIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: '#E9ECFF', marginBottom: 7 },
  uploadArrow: { color: '#2039A0', fontSize: 25, fontWeight: '800' },
  uploadTitle: { color: '#2039A0', fontSize: 15, fontWeight: '800', marginBottom: 2 },
  uploadHint: { color: '#656565', fontSize: 10, lineHeight: 13, textAlign: 'center' },
  previewRow: { marginTop: -15, marginBottom: 20 },
  preview: { width: 62, height: 62, borderRadius: 9, marginRight: 8 },
  previewWrap: { position: 'relative', width: 70, height: 70, marginRight: 2 },
  removePreview: { position: 'absolute', top: -4, right: 2, width: 22, height: 22, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: '#222', borderWidth: 2, borderColor: '#FFF' },
  removePreviewText: { color: '#FFF', fontSize: 16, lineHeight: 18, fontWeight: '700' },
  input: { height: 48, borderWidth: 1, borderColor: '#EEE', borderRadius: 10, color: '#111', fontSize: 14, paddingHorizontal: 15, marginBottom: 22 },
  fieldGroup: { marginBottom: 20 },
  selectField: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#EEE', borderRadius: 10, paddingHorizontal: 15 },
  optionsMenu: { borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 8, backgroundColor: '#FFF', marginTop: 4, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  option: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F1F1' },
  optionText: { color: '#333', fontSize: 14 },
  selectText: { color: '#202020', fontSize: 14, fontWeight: '600' },
  chevron: { color: '#777', fontSize: 21, fontWeight: '700' },
  sectionTitle: { color: '#222', fontSize: 14, fontWeight: '800', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 14, marginBottom: 22 },
  half: { flex: 1 },
  smallLabel: { color: '#858080', fontSize: 11, fontWeight: '800', marginBottom: 6 },
  smallInput: { height: 40, borderRadius: 8, backgroundColor: '#FCFCFC', color: '#111', fontSize: 13, paddingHorizontal: 12 },
  divider: { height: 8, backgroundColor: '#F5F1F1', marginHorizontal: -18, marginBottom: 24 },
  locationField: { height: 49, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 10, paddingHorizontal: 12, marginBottom: 24 },
  pin: { color: '#AAA', fontSize: 22, marginRight: 7 },
  locationInput: { flex: 1, color: '#111', fontSize: 13 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 23 },
  choice: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#777' },
  radio: { width: 17, height: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#555', borderRadius: 9 },
  choiceActive: { borderColor: '#4054C7', backgroundColor: '#4054C7' },
  check: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  choiceLabel: { color: '#484848', fontSize: 13, marginLeft: 6 },
  descriptionLabel: { color: '#536F16' },
  description: { height: 92, borderWidth: 1, borderColor: '#E3E3E3', borderRadius: 10, color: '#111', fontSize: 13, padding: 10 },
  descriptionMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 18 },
  metaText: { color: '#777', fontSize: 9 },
  status: { color: '#555', fontSize: 12, lineHeight: 17, textAlign: 'center', marginBottom: 10 },
  submit: { height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#FF5A30' },
  submitText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  disabled: { opacity: 0.6 },
});
