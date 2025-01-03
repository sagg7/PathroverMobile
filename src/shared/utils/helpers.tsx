import {Platform} from 'react-native';

export const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const limited = cleaned.slice(0, 10);
  const match = limited.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  if (limited.length > 6) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(
      6,
    )}`;
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
  const MAPBOX_TOKEN =
    'sk.eyJ1IjoibWF0YW9zbWFuIiwiYSI6ImNtMHhsejduczBkOGEycXBnbmh2NG5oaDcifQ.pPM1yQbjLKE-C0Mjg8mi0Q';
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

// const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

// // Haversine formula to calculate distance between two coordinates
// export const calculateDistance = (coord1: [number, number], coord2: [number, number]) => {
//   const R = 6371000; // Earth's radius in meters
//   const [lon1, lat1] = coord1;
//   const [lon2, lat2] = coord2;

//   const deltaLat = toRadians(lat2 - lat1);
//   const deltaLon = toRadians(lon2 - lon1);

//   const a =
//     Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
//     Math.cos(toRadians(lat1)) *
//       Math.cos(toRadians(lat2)) *
//       Math.sin(deltaLon / 2) *
//       Math.sin(deltaLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c; // Distance in meters
//   return distance;
// };
