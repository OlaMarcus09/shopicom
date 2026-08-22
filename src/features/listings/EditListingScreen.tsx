import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { enabledMarketplaceSections, getCategory, getMarketplaceSection } from '../../config/category-taxonomy';
import { updateLocalListing, type LocalListing } from './local-listing-service';
import { deleteListingImages, updateCloudListing, updateCloudListingImages } from './listing-service';

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><Pressable onPress={() => setOpen(!open)} style={styles.select}><Text style={styles.selectText}>{value}</Text><Text>⌄</Text></Pressable>{open ? <View style={styles.options}>{options.map((option) => <Pressable key={option} onPress={() => { onChange(option); setOpen(false); }} style={styles.option}><Text>{option}</Text></Pressable>)}</View> : null}</View>;
}

export function EditListingScreen({ listing, onBack, onSaved }: { listing: LocalListing; onBack: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(listing.title);
  const [price, setPrice] = useState(String(listing.price));
  const [location, setLocation] = useState(listing.location);
  const [contactPhone, setContactPhone] = useState(listing.contactPhone || '');
  const [description, setDescription] = useState(listing.description);
  const [section, setSection] = useState(getCategory(listing.category)?.section.label || 'Products');
  const [category, setCategory] = useState(listing.category);
  const [subCategory, setSubCategory] = useState(listing.subCategory);
  const [type, setType] = useState(listing.type || '');
  const [status, setStatus] = useState<string | null>(null);
  const existingCloudImages = listing.cloudImageUrls || (listing.cloudId ? listing.imageUrls : []);
  const [retainedImages, setRetainedImages] = useState(existingCloudImages);
  const [newImages, setNewImages] = useState<string[]>([]);
  const localOnlyImages = listing.cloudId ? [] : listing.imageUrls;
  const [retainedLocalImages, setRetainedLocalImages] = useState(localOnlyImages);
  const selectedSection = getMarketplaceSection(section);
  const selectedCategory = selectedSection?.categories.find((item) => item.name === category);
  const selectedSubcategory = selectedCategory?.subcategories.find((item) => item.name === subCategory);
  const imageCount = retainedImages.length + retainedLocalImages.length + newImages.length;
  async function addImages() {
    const remaining = 10 - imageCount;
    if (remaining <= 0) { setStatus('You can add up to 10 photos.'); return; }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { setStatus('Allow photo access to update listing images.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, selectionLimit: remaining, quality: 0.8 });
    if (!result.canceled) setNewImages((current) => [...current, ...result.assets.map((asset) => asset.uri)].slice(0, remaining + current.length));
  }
  async function save() {
    if (title.trim().length < 3 || !price || !location.trim() || !description.trim() || category === 'Select Category' || subCategory === 'Select Sub-Category' || imageCount === 0) { setStatus('Complete all required fields and keep at least one photo.'); return; }
    try {
      setStatus('Saving changes...');
      let imageUrls = [...retainedLocalImages, ...newImages];
      if (listing.cloudId) {
        imageUrls = await updateCloudListingImages(listing.cloudId, retainedImages, newImages);
        const removedCloudImages = existingCloudImages.filter((uri) => !retainedImages.includes(uri));
        await deleteListingImages(removedCloudImages);
      }
      const updates = { title: title.trim(), price: Number(price), location: location.trim(), contactPhone: contactPhone.trim() || undefined, description: description.trim(), category, subCategory, type: type.trim() || undefined, imageUrls };
      await updateLocalListing(listing.id, updates);
      if (listing.cloudId) await updateCloudListing(listing.cloudId, updates);
      onSaved();
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to save changes.'); }
  }
  return <View style={styles.screen}><View style={styles.header}><Pressable onPress={onBack}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.headerTitle}>Edit Listing</Text></View><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.photoHeader}><Text style={styles.label}>Photos ({imageCount}/10)</Text><Pressable onPress={addImages}><Text style={styles.addPhoto}>+ Add photos</Text></Pressable></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photos}>{retainedImages.map((uri) => <View key={uri} style={styles.photoWrap}><Image source={{ uri }} style={styles.photo} /><Pressable onPress={() => setRetainedImages((current) => current.filter((item) => item !== uri))} style={styles.remove}><Text style={styles.removeText}>×</Text></Pressable></View>)}{retainedLocalImages.map((uri) => <View key={uri} style={styles.photoWrap}><Image source={{ uri }} style={styles.photo} /><Pressable onPress={() => setRetainedLocalImages((current) => current.filter((item) => item !== uri))} style={styles.remove}><Text style={styles.removeText}>×</Text></Pressable></View>)}{newImages.map((uri) => <View key={uri} style={styles.photoWrap}><Image source={{ uri }} style={styles.photo} /><Pressable onPress={() => setNewImages((current) => current.filter((item) => item !== uri))} style={styles.remove}><Text style={styles.removeText}>×</Text></Pressable></View>)}</ScrollView>
    <TextInput value={title} onChangeText={setTitle} placeholder="Ads title" placeholderTextColor="#999" style={styles.input} />
    <SelectField label="Listing type" value={section} options={enabledMarketplaceSections.map((item) => item.label)} onChange={(value) => { setSection(value); setCategory('Select Category'); setSubCategory('Select Sub-Category'); setType(''); }} />
    <SelectField label="Category" value={category} options={selectedSection?.categories.map((item) => item.name) || []} onChange={(value) => { setCategory(value); setSubCategory('Select Sub-Category'); setType(''); }} />
    <SelectField label="Sub-category" value={subCategory} options={selectedCategory?.subcategories.map((item) => item.name) || []} onChange={(value) => { setSubCategory(value); setType(''); }} />
    {selectedSubcategory?.itemTypes.length ? <SelectField label="Item type" value={type || 'Select item type'} options={[...selectedSubcategory.itemTypes]} onChange={setType} /> : null}
    <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="Price" placeholderTextColor="#999" style={styles.input} />
    <TextInput value={location} onChangeText={setLocation} placeholder="Location" placeholderTextColor="#999" style={styles.input} />
    <TextInput value={contactPhone} onChangeText={setContactPhone} keyboardType="phone-pad" placeholder="Contact phone" placeholderTextColor="#999" style={styles.input} />
    <TextInput value={description} onChangeText={setDescription} multiline textAlignVertical="top" placeholder="Description" placeholderTextColor="#999" style={[styles.input, styles.description]} />
    {status ? <Text style={styles.status}>{status}</Text> : null}<Pressable onPress={save} style={styles.save}>{status === 'Saving changes...' ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>Save changes</Text>}</Pressable>
  </ScrollView></View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#FFF' }, header: { height: 60, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingHorizontal: 15 }, back: { color: '#333', fontSize: 34, marginRight: 12 }, headerTitle: { color: '#222', fontSize: 19, fontWeight: '800' }, content: { padding: 16, paddingBottom: 40 }, photoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, addPhoto: { color: '#F45100', fontSize: 12, fontWeight: '800' }, photos: { marginBottom: 16 }, photoWrap: { width: 84, height: 84, marginRight: 10 }, photo: { width: 84, height: 84, borderRadius: 9, backgroundColor: '#F5F5F5' }, remove: { position: 'absolute', right: -4, top: -4, width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#222' }, removeText: { color: '#FFF', fontSize: 18, lineHeight: 20 }, input: { height: 50, borderWidth: 1, borderColor: '#DDD', borderRadius: 10, paddingHorizontal: 13, color: '#222', marginBottom: 14 }, description: { height: 120, paddingTop: 13 }, field: { marginBottom: 14 }, label: { color: '#555', fontSize: 12, fontWeight: '700', marginBottom: 6 }, select: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#DDD', borderRadius: 10, paddingHorizontal: 13 }, selectText: { color: '#222' }, options: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, backgroundColor: '#FFF', marginTop: 4, overflow: 'hidden' }, option: { padding: 13, borderBottomWidth: 1, borderBottomColor: '#EEE' }, status: { color: '#D33', fontSize: 12, textAlign: 'center', marginBottom: 12 }, save: { height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F45100', borderRadius: 12 }, saveText: { color: '#FFF', fontSize: 16, fontWeight: '800' } });
