import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Button,
  Alert,
  Dimensions,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {
  HP,
  isIOS,
  mapBoxToken,
  PFColors,
  showAlert,
  WP,
} from '../../../../shared/exporter';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  AppButton,
  AppHeader,
  MainWrapper,
  SaveRouteSheet,
} from '../../../../components';
import styles from './styles';
import useLocation from '../../../../hooks/getLocation';

MapboxGL.setAccessToken(mapBoxToken);

const {width, height} = Dimensions.get('window');

const PADDING = 50; // Space from screen edges
const SQUARE_SIZE = Math.min(width, height) - PADDING * 2; // Adjusted square size

const DEFAULT_ZOOM = 12; // Default zoom level

const DownloadOfflineMap = ({navigation}: any) => {
  const mapRef = useRef<any>(null);
  const [bounds, setBounds] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [progress, setProgress] = useState(0); // Download progress %
  const [downloadSize, setDownloadSize] = useState(0); // Downloaded size in MB
  const [routeName, setRouteName] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<any>([]);
  const {location} = useLocation();
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [showNameSheet, setShowNameSheet] = useState<boolean>(false);
  const [widthYards, setWidthYards] = useState(null);
  const [heightYards, setHeightYards] = useState(null);
  const KM_TO_YARD = 1093.61;

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  useEffect(() => {
    MapboxGL.offlineManager.setTileCountLimit(1000);
  }, []);

  useEffect(() => {
    if (location && 'latitude' in location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location]);

  const handleMapLoaded = () => {
    setIsMapLoaded(true);
  };

  const handleRegionChange = e => {
    if (e.properties.zoom) {
      setZoomLevel(e.properties.zoom);
    }
  };

  const MIN_AREA_KM = 10; // Minimum 10km x 10km
  const MAX_AREA_KM = 500; // Maximum 500km x 500km

  const kmToLatDegrees = km => km / 111;
  const kmToLngDegrees = (km, latitude) =>
    km / (111 * Math.cos(latitude * (Math.PI / 180)));

  const getFixedSquareBounds = async () => {
    if (!isMapLoaded || !mapRef.current) {
      Alert.alert('Error', 'Map is not loaded yet.');
      return;
    }

    try {
      let visibleBounds = await mapRef.current.getVisibleBounds();

      if (
        !visibleBounds ||
        visibleBounds.length !== 2 ||
        visibleBounds.flat().includes(NaN)
      ) {
        Alert.alert('Error', 'Invalid visible bounds. Try again.');
        return;
      }

      const [swLng, swLat] = visibleBounds[0];
      const [neLng, neLat] = visibleBounds[1];

      const centerLng = (swLng + neLng) / 2;
      const centerLat = (swLat + neLat) / 2;

      const latRangeKm: any = Math.abs(neLat - swLat) * 111;
      const lngRangeKm =
        Math.abs(neLng - swLng) * (111 * Math.cos(centerLat * (Math.PI / 180)));

      console.log(
        `Selected Area Size: ${latRangeKm.toFixed(2)}km x ${lngRangeKm.toFixed(
          2,
        )}km`,
      );

      const widthInYards: any = parseFloat(lngRangeKm) * KM_TO_YARD;
      const heightInYards: any = parseFloat(latRangeKm) * KM_TO_YARD;
      setWidthYards(widthInYards.toFixed(2));
      setHeightYards(heightInYards.toFixed(2));

      // Convert km back to degrees
      const latDiff = kmToLatDegrees(latRangeKm / 2);
      const lngDiff = kmToLngDegrees(lngRangeKm / 2, centerLat);

      const newBounds: any = {
        northEast: [centerLng + lngDiff, centerLat + latDiff],
        southWest: [centerLng - lngDiff, centerLat - latDiff],
      };

      setBounds(newBounds);
      setIsSelected(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to get map bounds.');
    }
  };

  const downloadOfflineMap = async routeName => {
    try {
      setIsDownloading(true);
      setProgress(0);
      setDownloadSize(0);

      const {northEast, southWest} = bounds;
      const boundsArray = [southWest, northEast];

      await MapboxGL.offlineManager.createPack(
        {
          name: routeName,
          styleURL: 'mapbox://styles/mapbox/streets-v11',
          minZoom: 14,
          maxZoom: 20,
          bounds: boundsArray,
        },
        (pack, status) => {
          if (pack.name) {
            const percentage = Math.round(
              (status.completedResourceCount / status.requiredResourceCount) *
                100,
            );
            const sizeInMB = (
              status.completedResourceSize /
              (1024 * 1024)
            ).toFixed(2); // Convert bytes to MB
            setProgress(percentage);
            setDownloadSize(sizeInMB);
          }

          if (status.percentage === 100) {
            setIsDownloading(false);
            showAlert('Alert', 'Your map has been saved.');
            navigation.goBack();
            console.log('Download Complete!');
          }
        },
        (pack, error) => {
          console.log('Download Failed:', error);
          setIsDownloading(false);
        },
      );

      console.log('Download Started');
    } catch (err: any) {
      setIsDownloading(false);
      if (
        err?.message
          ?.toLowerCase()
          .includes('offline pack with name fsd already exists')
      ) {
        showAlert(
          'Error',
          'This name already exists. Please try a different one.',
        );
      }
    }
  };

  const handleSaveRouteBtn = () => {
    setShowNameSheet(false);
    downloadOfflineMap(routeName);
  };

  return (
    <MainWrapper>
      <AppHeader title="Download Map" />
      <MapboxGL.MapView
        ref={mapRef}
        style={{flex: 1}}
        compassEnabled={false}
        onDidFinishLoadingMap={handleMapLoaded}
        onRegionDidChange={handleRegionChange}>
        {currentLocation?.length > 1 && (
          <MapboxGL.Camera zoomLevel={12} centerCoordinate={currentLocation} />
        )}
      </MapboxGL.MapView>

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: isIOS()
            ? (height - SQUARE_SIZE) / 5
            : (height - SQUARE_SIZE) / 6,
          left: (width - SQUARE_SIZE) / 2,
          width: SQUARE_SIZE,
          height: SQUARE_SIZE + 300,
          borderWidth: 3,
          borderColor: PFColors.Red.ErrorColor,
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
        }}
      />
      <View style={{position: 'absolute', bottom: 20, left: 10, right: 10}}>
        {!isDownloading && (
          <>
            {!isSelected ? (
              <AppButton
                title="Select Area"
                handleClick={getFixedSquareBounds}
              />
            ) : (
              <AppButton
                title="Download Offline Map"
                handleClick={() => setShowNameSheet(true)}
              />
            )}
          </>
        )}
        {isDownloading && (
          <View style={styles.downloadView}>
            <Text style={styles.titleStyles}>Downloading... {progress}%</Text>
            <Text style={styles.titleStyles}>Size: {downloadSize} MB</Text>
          </View>
        )}
      </View>
      {showNameSheet && (
        <SaveRouteSheet
          title="Map Name"
          // modalVisible={showNameSheet}
          routeName={routeName}
          onChangeText={(text: any) => setRouteName(text)}
          onPressSave={() => handleSaveRouteBtn()}
          onPressCancel={() => setShowNameSheet(false)}
          btnTitle="Save Map"
        />
      )}
    </MainWrapper>
  );
};

export default DownloadOfflineMap;
