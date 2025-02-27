import React, {useState, useEffect, useRef} from 'react';
import {View, Dimensions} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {mapBoxToken} from '../../../../shared/exporter';
import {AppHeader, MainWrapper} from '../../../../components';

MapboxGL.setAccessToken(mapBoxToken);

const {width, height} = Dimensions.get('window');
const DEFAULT_ZOOM = 12;

const ViewOfflineMap = ({route}: any) => {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const {item} = route?.params;

  // Extract offline style and bounds
  const styleURI =
    item?._metadata?._rnmapbox?.styleURI ||
    'mapbox://styles/mapbox/streets-v11';

  // Ensure bounds are structured correctly
  const bounds = item?.pack?.bounds
    ? [
        [item.pack.bounds[0], item.pack.bounds[1]],
        [item.pack.bounds[2], item.pack.bounds[3]],
      ]
    : null;

  // Compute center coordinate if bounds exist
  const centerLongitude = bounds ? (bounds[0][0] + bounds[1][0]) / 2 : -92.25;
  const centerLatitude = bounds ? (bounds[0][1] + bounds[1][1]) / 2 : 37.75;

  useEffect(() => {
    MapboxGL.offlineManager.setTileCountLimit(100000);
  }, []);

  const handleMapLoaded = () => {
    setIsMapLoaded(true);
  };

  return (
    <MainWrapper>
      <AppHeader title={item?.name} />
      <MapboxGL.MapView
        ref={mapRef}
        style={{flex: 1}}
        styleURL={styleURI} // Use offline tiles
        onDidFinishLoadingMap={handleMapLoaded}
        rotateEnabled={false}
        pitchEnabled={false}
        scrollEnabled={true}
        zoomEnabled={true}
        compassEnabled={false}>
        {bounds ? (
          <>
            {/* Camera focusing on the offline region */}
            <MapboxGL.Camera
              bounds={{
                ne: bounds[1], // [maxLng, maxLat]
                sw: bounds[0], // [minLng, minLat]
                padding: {top: 20, left: 20, right: 20, bottom: 20},
              }}
              animationMode="flyTo"
              animationDuration={1000}
            />

            {/* Restrict map movement outside the offline region */}
            <MapboxGL.Camera
              maxBounds={{
                ne: bounds[1], // [maxLng, maxLat]
                sw: bounds[0], // [minLng, minLat]
              }}
            />
          </>
        ) : (
          <MapboxGL.Camera
            zoomLevel={DEFAULT_ZOOM}
            centerCoordinate={[centerLongitude, centerLatitude]}
          />
        )}
      </MapboxGL.MapView>
    </MainWrapper>
  );
};

export default ViewOfflineMap;
