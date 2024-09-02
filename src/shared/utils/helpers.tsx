import { Platform } from 'react-native';

export const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

export function isIOS() {
  return Platform.OS === 'ios';
}
export function removeNonNumbers(number: string) {
  return number.replace(/\D/g, '');
}