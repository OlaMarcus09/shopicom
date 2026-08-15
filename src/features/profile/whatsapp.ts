import { Linking } from 'react-native';

export function getWhatsAppNumber(value?: string | null) {
  const digits = value?.replace(/\D/g, '') || '';
  if (!digits) return '';
  return digits.startsWith('0') ? `233${digits.slice(1)}` : digits;
}

export async function openWhatsApp(value: string | undefined, listingTitle: string) {
  const number = getWhatsAppNumber(value);
  if (!number) return false;
  const message = encodeURIComponent(`Hi, I am interested in ${listingTitle} on Shopicom.`);
  await Linking.openURL(`https://wa.me/${number}?text=${message}`);
  return true;
}
