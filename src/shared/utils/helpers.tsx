import { Platform } from 'react-native';

export const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const limited = cleaned.slice(0, 10);
  const match = limited.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  if (limited.length > 6) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
  } else if (limited.length > 3) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  } else if (limited.length > 0) {
    return `(${limited}`;
  }

  return phoneNumber;
};

export function isIOS() {
  return Platform.OS === 'ios';
}
export function removeNonNumbers(number: string) {
  return number.replace(/\D/g, '');
}
export const fetchSuggestions = async (text: string) => {
  const MAPBOX_TOKEN = 'sk.eyJ1IjoibWF0YW9zbWFuIiwiYSI6ImNtMHhsejduczBkOGEycXBnbmh2NG5oaDcifQ.pPM1yQbjLKE-C0Mjg8mi0Q';
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("DATA", data);

    return data
  } catch (error) {
    return error
  }
};