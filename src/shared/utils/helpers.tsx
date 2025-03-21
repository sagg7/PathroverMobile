import {Platform} from 'react-native';
import {mapBoxToken} from './constant';

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
  const MAPBOX_TOKEN = mapBoxToken;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

// export const getTimeAndDistance = async (start, end, profile = 'driving') => {
//   if (
//     !Array.isArray(start) ||
//     !Array.isArray(end) ||
//     start.length !== 2 ||
//     end.length !== 2
//   ) {
//     throw new Error(
//       'Invalid coordinates. Provide [longitude, latitude] for both start and end.',
//     );
//   }

//   const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${start[0]},${start[1]};${end[0]},${end[1]}?annotations=distance,duration&overview=false&access_token=${mapBoxToken}`;

//   /**
//    * Formats duration into hours and minutes.
//    * @param {number} minutes - Duration in minutes.
//    * @returns {string} - Formatted duration.
//    */
//   const formatDuration = minutes => {
//     if (minutes >= 60) {
//       const hours = Math.floor(minutes / 60);
//       const remainingMinutes = Math.round(minutes % 60);
//       return `${hours} hr${hours > 1 ? 's' : ''} ${
//         remainingMinutes > 0
//           ? `${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`
//           : ''
//       }`;
//     }
//     return `${Math.round(minutes)} min${minutes > 1 ? 's' : ''}`;
//   };

//   /**
//    * Formats distance into kilometers or meters.
//    * @param {number} meters - Distance in meters.
//    * @returns {string} - Formatted distance.
//    */
//   const formatDistance = meters => {
//     if (meters < 1000) {
//       return `${Math.round(meters)} meters`;
//     }
//     return `${(meters / 1000).toFixed(2)} km`;
//   };

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.routes && data.routes.length > 0) {
//       const route = data.routes[0];
//       const durationMinutes = route.duration / 60; // Convert seconds to minutes
//       const distanceMeters = route.distance; // Keep distance in meters

//       return {
//         duration: formatDuration(durationMinutes),
//         distance: formatDistance(distanceMeters),
//       };
//     } else {
//       throw new Error('No routes found');
//     }
//   } catch (error) {
//     console.error('Error fetching time and distance:', error);
//     throw error;
//   }
// };
export const formatDate = (dateString: string) => {
  if (dateString) {
    const [day, month, year] = dateString?.split('-')?.map(Number);

    const date = new Date(year, month - 1, day); // Month is 0-based in JavaScript

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const formattedDay = String(date.getDate()).padStart(2, '0');
    const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
    const formattedYear = date.getFullYear();

    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  }
};

export const getTimeAndDistance = async (start, end, profile = 'driving') => {
  if (
    !Array.isArray(start) ||
    !Array.isArray(end) ||
    start.length !== 2 ||
    end.length !== 2
  ) {
    throw new Error(
      'Invalid coordinates. Provide [longitude, latitude] for both start and end.',
    );
  }

  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${start[0]},${start[1]};${end[0]},${end[1]}?annotations=distance,duration&overview=false&access_token=${mapBoxToken}`;

  /**
   * Formats duration into hours and minutes.
   * @param {number} minutes - Duration in minutes.
   * @returns {string} - Formatted duration.
   */
  const formatDuration = minutes => {
    if (minutes < 1) {
      return 'A few seconds away';
    }

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return `${hours} hr${hours > 1 ? 's' : ''} ${
        remainingMinutes > 0
          ? `${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`
          : ''
      }`;
    }

    return `${Math.round(minutes)} min${minutes > 1 ? 's' : ''}`;
  };

  /**
   * Converts meters to miles.
   * @param {number} meters - Distance in meters.
   * @returns {number} - Distance in miles (rounded to 2 decimal places).
   */
  const convertToMiles = meters => {
    const METERS_TO_MILES = 0.000621371; // 1 meter = 0.000621371 miles
    return (meters * METERS_TO_MILES).toFixed(2);
  };

  /**
   * Formats distance into miles.
   * @param {number} meters - Distance in meters.
   * @returns {string} - Formatted distance in miles.
   */
  const formatDistance = meters => {
    return `${convertToMiles(meters)} miles`;
  };

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const durationMinutes = route.duration / 60; // Convert seconds to minutes
      const distanceMeters = route.distance; // Keep distance in meters

      return {
        duration: formatDuration(durationMinutes),
        distance: formatDistance(distanceMeters), // Returns distance in miles
      };
    } else {
      throw new Error('No routes found');
    }
  } catch (error) {
    console.error('Error fetching time and distance:', error);
    throw error;
  }
};

export const getTimeAndDistanceForWaypoint = async (
  coordinates,
  profile = 'driving',
) => {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    throw new Error(
      'Provide at least two coordinates as [longitude, latitude] pairs.',
    );
  }

  const coordsString = coordinates
    ?.map(coord => `${coord[0]},${coord[1]}`)
    .join(';');

  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordsString}?annotations=distance,duration&overview=simplified&access_token=${mapBoxToken}`;
  const formatDuration = minutes => {
    if (minutes < 1) return 'A few seconds away';
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return `${hours} hr${hours > 1 ? 's' : ''} ${
        remainingMinutes > 0
          ? `${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`
          : ''
      }`;
    }
    return `${Math.round(minutes)} min${minutes > 1 ? 's' : ''}`;
  };

  const convertToMiles = meters => (meters * 0.000621371).toFixed(2);

  const formatDistance = meters => `${convertToMiles(meters)} miles`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];

      return {
        duration: formatDuration(route.duration / 60), // Convert seconds to minutes
        distance: formatDistance(route.distance), // Convert meters to miles
      };
    } else {
      throw new Error('No routes found');
    }
  } catch (error) {
    console.error('Error fetching route:', error);
    throw error;
  }
};

export const extractType = (content: any): string | undefined => {
  try {
    const messageContent = content?.last_message?.content;
    if (!messageContent) return '';

    const parsedContent = JSON.parse(messageContent);
    return parsedContent?.messageContainsLocation?.type;
  } catch (error) {
    console.error('JSON parsing error:', error);
    return '';
  }
};
