import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppHeader, MainWrapper} from '../../../../../components';
import MapboxGL from '@rnmapbox/maps';
import {svgIcon} from '../../../../../assets/svg';
import {PFColors, PFFonts} from '../../../../../shared/exporter';
import {scale} from '../../../../../shared/theme/responsive';

const PickUp = ({route,navigation}: any) => {
  const {pickUpAddress , setPickUpAddress} = route?.params;
  const [currentLocation, setCurrentLocation] = useState([
    74.2753883, 31.4541112,
  ]);
  const [pickUpLoc, setPickUpLoc] = useState<any>(null);
  const RADIUS_IN_METERS = 100;

  const pickLocation = (event: any) => {
    setPickUpLoc(event.geometry?.coordinates);
    console.log(event.geometry);
  };
console.log(pickUpLoc);

  const handleDone = () => {
    setPickUpAddress({
      latitude: pickUpLoc[0],
      longitude: pickUpLoc[1],
    });
    navigation.goBack()
  };

  const isDisable = !pickUpLoc;
  return (
    <MainWrapper>
      <AppHeader title="Pickup Location" />
      <MapboxGL.MapView style={styles.map} onPress={pickLocation}>
        <MapboxGL.Camera centerCoordinate={currentLocation} zoomLevel={14} />

        <MapboxGL.ShapeSource
          id="markerSource"
          shape={{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: currentLocation,
            },
          }}>
          <MapboxGL.SymbolLayer
            id="markerLayer"
            style={{
              iconImage: 'marker-15', // Use a valid marker icon from Mapbox or your custom icon
              iconSize: 1.5, // Correct property to set the size
              iconAnchor: 'bottom', // Anchor point of the icon
            }}
          />
          <MapboxGL.CircleLayer
            id="circleLayer"
            style={{
              circleRadius: RADIUS_IN_METERS,
              circleColor: 'rgba(14, 146, 75, 0.15)', // Adjust color and transparency
              circleStrokeColor: 'rgba(14, 146, 75, 1)',
              circleStrokeWidth: 1,
            }}
          />
          <MapboxGL.UserLocation
            visible={true}
            showsUserHeadingIndicator={true}
            onUpdate={data => {}} // Automatically updates current location
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
      <View style={styles.sheetStyle}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <Text style={styles.messageText}>
            Select pickup location in the green zone
          </Text>
          <View style={styles.itemStyle}>
            <View style={styles.itemInnerView}>
              <Text style={styles.titleText}>Pickup Location</Text>
              <View style={styles.addressView}>
                {svgIcon.MapPin}
                <Text style={styles.addressText}>My current location</Text>
              </View>
            </View>
            {svgIcon.LeftArrow}
          </View>
          <AppButton
            disabled={isDisable}
            title="Done"
            buttonStyle={styles.btnStyle}
            handleClick={handleDone}
          />
        </ScrollView>
      </View>
    </MainWrapper>
  );
};

export default PickUp;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  searchBox: {
    position: 'absolute',
    top: scale(16),
    backgroundColor: PFColors.Standard.White,
    width: scale(343),
    height: scale(44),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: scale(10),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
  },
  input: {
    flex: 1,
    marginLeft: scale(12),
    fontSize: scale(16),
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
  },
  sheetStyle: {
    backgroundColor: PFColors.Standard.White,
    flex: 0.5,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
  },
  scrollViewStyle: {
    padding: scale(16),
  },
  messageText: {
    fontSize: scale(20),
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    marginBottom: scale(12),
  },
  itemStyle: {
    backgroundColor: PFColors.Gray.WhisperGray,
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: scale(12),
    marginBottom: scale(16),
  },
  titleText: {
    fontSize: scale(10),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Gray.DarkGray,
    marginBottom: scale(8),
  },
  itemInnerView: {
    flex: 1,
  },
  addressView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: scale(12),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    marginLeft: scale(4),
  },
  btnStyle: {
    marginTop: scale(16),
  },
});

// import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
// import React, {useState} from 'react';
// import {AppButton, AppHeader, MainWrapper} from '../../../../../components';
// import MapboxGL from '@rnmapbox/maps';
// import {svgIcon} from '../../../../../assets/svg';
// import {PFColors, PFFonts} from '../../../../../shared/exporter';
// import {scale} from '../../../../../shared/theme/responsive';
// import {calculateDistance} from '../../../../../shared/utils/helpers';
// // import geolib from 'geolib'; // Import geolib to calculate distances

// const PickUp = ({route, navigation}: any) => {
//   const {pickUpAddress, setPickUpAddress} = route?.params;
//   const [currentLocation, setCurrentLocation] = useState([
//     74.2753883,
//     31.4541112, // Initial center coordinates
//   ]);
//   const [mapCenter, setMapCenter] = useState([74.2753883, 31.4541112]); // Map center coordinates
//   const [isValidLocation, setIsValidLocation] = useState(true);
//   const RADIUS_IN_METERS = 100;

//   const handleRegionChange = async (region: any) => {
//     if (region?.geometry?.coordinates) {
//       setMapCenter(region.geometry.coordinates);
//       // setMapCenter(center);

//       // Validate if center is within radius
//       const distance = calculateDistance(
//         [currentLocation[0], currentLocation[1]], // Fixed center (initial location)
//         [region?.geometry?.coordinates[0], region?.geometry?.coordinates[1]], // Dragged map center
//       );
//       console.log('distance ===== : ',distance);
      

//       setIsValidLocation(distance <= RADIUS_IN_METERS);
//     }
//   };

//   const handleDone = () => {
//     setPickUpAddress({
//       latitude: mapCenter[1],
//       longitude: mapCenter[0],
//     });
//     navigation.goBack();
//   };

//   return (
//     <MainWrapper>
//       <AppHeader title="Pickup Location" />
//       <MapboxGL.MapView
//         style={styles.map}
//         onRegionDidChange={handleRegionChange}>
//         <MapboxGL.Camera centerCoordinate={currentLocation} zoomLevel={14} />
//         <MapboxGL.ShapeSource
//           id="markerSource"
//           shape={{
//             type: 'Feature',
//             geometry: {
//               type: 'Point',
//               coordinates: mapCenter,
//             },
//           }}>
//           <MapboxGL.SymbolLayer
//             id="markerLayer"
//             style={{
//               iconImage: 'marker-15',
//               iconSize: 1.5,
//               iconAnchor: 'bottom',
//             }}
//           />
//         </MapboxGL.ShapeSource>
//         <MapboxGL.CircleLayer
//           id="circleLayer"
//           style={{
//             circleRadius: RADIUS_IN_METERS / 100, // Adjust size to meters
//             circleColor: 'rgba(14, 146, 75, 0.15)',
//             circleStrokeColor: 'rgba(14, 146, 75, 1)',
//             circleStrokeWidth: 1,
//           }}
//         />
//       </MapboxGL.MapView>
//       <View style={styles.sheetStyle}>
//         <ScrollView contentContainerStyle={styles.scrollViewStyle}>
//           <Text style={styles.messageText}>
//             Drag the map and release to select pickup location in the green zone
//           </Text>
//           <View style={styles.itemStyle}>
//             <View style={styles.itemInnerView}>
//               <Text style={styles.titleText}>Pickup Location</Text>
//               <View style={styles.addressView}>
//                 {svgIcon.MapPin}
//                 <Text style={styles.addressText}>
//                   {isValidLocation ? 'Valid Location' : 'Out of bounds'}
//                 </Text>
//               </View>
//             </View>
//             {svgIcon.LeftArrow}
//           </View>
//           <AppButton
//             disabled={!isValidLocation}
//             title="Done"
//             buttonStyle={styles.btnStyle}
//             handleClick={handleDone}
//           />
//         </ScrollView>
//       </View>
//     </MainWrapper>
//   );
// };

// export default PickUp;

// const styles = StyleSheet.create({
//   map: {
//     flex: 1,
//   },
//   sheetStyle: {
//     backgroundColor: PFColors.Standard.White,
//     flex: 0.5,
//     borderTopLeftRadius: scale(24),
//     borderTopRightRadius: scale(24),
//   },
//   scrollViewStyle: {
//     padding: scale(16),
//   },
//   messageText: {
//     fontSize: scale(20),
//     fontFamily: PFFonts.Foundation.SemiBold,
//     color: PFColors.Standard.Black,
//     marginBottom: scale(12),
//   },
//   itemStyle: {
//     backgroundColor: PFColors.Gray.WhisperGray,
//     paddingVertical: scale(8),
//     paddingHorizontal: scale(12),
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderRadius: scale(12),
//     marginBottom: scale(16),
//   },
//   titleText: {
//     fontSize: scale(10),
//     fontFamily: PFFonts.Foundation.Regular,
//     color: PFColors.Gray.DarkGray,
//     marginBottom: scale(8),
//   },
//   itemInnerView: {
//     flex: 1,
//   },
//   addressView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   addressText: {
//     fontSize: scale(12),
//     fontFamily: PFFonts.Foundation.Regular,
//     color: PFColors.Standard.Black,
//     marginLeft: scale(4),
//   },
//   btnStyle: {
//     marginTop: scale(16),
//   },
// });
