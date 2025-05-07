import {useCallback, useState} from 'react';
import {mapBoxToken, stateCodeMap} from '../../shared/utils/constant';

export const useStateShortCode = () => {
  const [loading, setLoading] = useState(false);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getShortCodeFromCoords = useCallback(
    async (latitude: number, longitude: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapBoxToken}`,
        );
        const data = await response.json();

        if (data?.features?.length > 0) {
          const context = data.features[0].context || [];
          const regionInfo = context.find((c: any) => c.id.includes('region'));
          const stateName = regionInfo?.text;
          const code = stateCodeMap[stateName] || null;

          setShortCode(code);
          return code;
        } else {
          setShortCode('Unknown');
          return 'Unknown';
        }
      } catch (err) {
        setError('Reverse geocoding failed');
        setShortCode(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {shortCode, loading, error, getShortCodeFromCoords};
};
