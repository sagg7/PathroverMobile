import React, {useState, useEffect, useRef} from 'react';
import {View, Button, Alert, Dimensions} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {mapBoxToken} from '../../../../shared/exporter';

MapboxGL.setAccessToken(mapBoxToken);

const {width, height} = Dimensions.get('window');

const MIN_AREA_KM = 1; // Minimum size
const MAX_AREA_KM = 10; // Maximum size

const DownloadOflineMap = () => {
  const mapRef = useRef(null);
  const [bounds, setBounds] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    MapboxGL.offlineManager.setTileCountLimit(100000);
  }, []);

  // Converts km to degrees
  // Convert km to latitude degrees (1 km ≈ 1 / 111 degrees)
  const kmToLatDegrees = km => km / 111;

  // Convert km to longitude degrees (varies by latitude)
  const kmToLngDegrees = (km, lat) =>
    km / (111 * Math.cos(lat * (Math.PI / 180)));

  // Ensure map is loaded before fetching bounds
  const handleMapLoaded = () => {
    setIsMapLoaded(true);
    console.log('Map is loaded');
  };

  const getFixedSquareBounds = async () => {
    if (!isMapLoaded || !mapRef.current) {
      Alert.alert('Error', 'Map is not loaded yet.');
      return;
    }

    try {
      let visibleBounds = await mapRef.current.getVisibleBounds();
      console.log('Visible Bounds:', visibleBounds);

      if (
        !visibleBounds ||
        visibleBounds.length !== 2 ||
        visibleBounds.flat().includes(NaN)
      ) {
        Alert.alert('Error', 'Invalid visible bounds. Try again.');
        return;
      }

      const centerLng = (visibleBounds[0][0] + visibleBounds[1][0]) / 2;
      const centerLat = (visibleBounds[0][1] + visibleBounds[1][1]) / 2;
      console.log('Map Center:', [centerLng, centerLat]);

      // Define area size based on zoom level
      let areaSizeKm = 20 / Math.pow(2, zoomLevel - 10);
      areaSizeKm = Math.max(MIN_AREA_KM, Math.min(areaSizeKm, MAX_AREA_KM));

      // Convert km to degrees properly
      const latDiff = kmToLatDegrees(areaSizeKm / 2);
      const lngDiff = kmToLngDegrees(areaSizeKm / 2, centerLat); // Now considers latitude!

      const newBounds = {
        northEast: [centerLng + lngDiff, centerLat + latDiff],
        southWest: [centerLng - lngDiff, centerLat - latDiff],
      };
      console.log('1', [centerLng + lngDiff, centerLat + latDiff]);
      console.log('2', [centerLng - lngDiff, centerLat - latDiff]);

      setBounds(newBounds);
      console.log('Selected Bounds:', newBounds);

      Alert.alert(
        'Area Selected',
        `Selected Area: ${Math.round(areaSizeKm)} km × ${Math.round(
          areaSizeKm,
        )} km`,
      );
    } catch (error) {
      console.error('Error getting bounds:', error);
      Alert.alert('Error', 'Failed to get map bounds.');
    }
  };
  // Download the offline map
  const downloadOfflineMap = async () => {
    if (!bounds) {
      Alert.alert('Error', 'Select an area before downloading.');
      return;
    }

    console.log('Downloading with bounds:', bounds);

    try {
      const options = {
        name: 'offline-region',
        styleURL: MapboxGL.StyleURL.Street,
        bounds: [bounds.southWest, bounds.northEast],
        minZoom: 10,
        maxZoom: 16,
      };

      await MapboxGL.offlineManager.createPack(options, status => {
        console.log('Download Progress:', status.percentage);
      });

      Alert.alert('Download Started', 'Map is being downloaded.');
    } catch (error) {
      console.error('Download Error:', error);
      Alert.alert('Error', 'Failed to download map.');
    }
  };

  return (
    <View style={{flex: 1}}>
      <MapboxGL.MapView
        ref={mapRef}
        style={{flex: 1}}
        onDidFinishLoadingMap={handleMapLoaded} // Ensure map is loaded
        onRegionDidChange={e => setZoomLevel(e.properties.zoom)}>
        <MapboxGL.Camera zoomLevel={12} centerCoordinate={[-92.25, 37.75]} />
      </MapboxGL.MapView>

      {/* Fixed Square Overlay */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: (height - 200) / 2,
          left: (width - 200) / 2,
          width: 200,
          height: 200,
          borderWidth: 3,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
        }}
      />

      {/* Action Buttons */}
      <View style={{position: 'absolute', bottom: 20, left: 10, right: 10}}>
        <Button title="Select Area" onPress={getFixedSquareBounds} />
        <Button title="Download Offline Map" onPress={downloadOfflineMap} />
      </View>
    </View>
  );
};

export default DownloadOflineMap;
