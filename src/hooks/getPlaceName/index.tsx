import {useState, useCallback} from 'react';
import {mapBoxToken} from '../../shared/exporter';

const usePlaceName = () => {
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPlaceName = useCallback(
    async (latitude: number, longitude: number) => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapBoxToken}`;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const place = data.features[0].place_name;
          console.log('PLACE NAME===>', place);
          setPlaceName(place?.replace(/^Undefined, /, ''));
        } else {
          setPlaceName(null);
          setError('Place not found');
        }
      } catch (err) {
        setError('Error fetching place name');
        console.error('Error fetching place name:', err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {placeName, fetchPlaceName, error, loading, setPlaceName};
};

export default usePlaceName;
