import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  AppButton,
  AppHeader,
  AppInput,
  MainWrapper,
} from '../../../../../components';
import MapboxGL from '@rnmapbox/maps';
import {svgIcon} from '../../../../../assets/svg';
import {PFColors, PFFonts, Routes} from '../../../../../shared/exporter';
import {scale} from '../../../../../shared/theme/responsive';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const Locations = ({navigation, route}: any) => {
  const {selectedRouteDetails, setSelectedRouteDetails} = route.params || {};

  const [search, setSearch] = useState<string>('');
  const [pickUpAddress, setPickUpAddress] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState(null);

  const [permissionGranted, setPermissionGranted] = useState(false);

    useEffect(() => {
      const getLocationPermission = async () => {
        try {
          const permission =
            Platform.OS === 'android'
              ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
              : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  
          const result = await check(permission);
  
          if (result === RESULTS.GRANTED) {
            setPermissionGranted(true);
          } else if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
            const requestResult = await request(permission);
            if (requestResult === RESULTS.GRANTED) {
              setPermissionGranted(true);
            } else {
              Alert.alert('Permission Denied', 'Please enable location permissions.');
            }
          } else {
            Alert.alert('Permission Error', 'Unable to access location.');
          }
        } catch (error) {
          console.error('Permission error:', error);
        }
      };
  
      getLocationPermission();
    }, []);
  

  const handleSave = () => {
    setSelectedRouteDetails({
      pickup_latitude: pickUpAddress?.latitude,
      pickup_longitude: pickUpAddress?.longitude,
      dropoff_latitude: destinationAddress?.latitude,
      dropoff_longitude: destinationAddress?.longitude,
    });
    navigation.goBack()
  };

  const navigateToPickup = () => {
    navigation.navigate(Routes.PickUp, {pickUpAddress, setPickUpAddress});
  };
  const navigateToDestination = () => {
    navigation.navigate(Routes.Destination, {
      destinationAddress,
      setDestinationAddress,
    });
  };
  const isDisable = !pickUpAddress || !destinationAddress;
  return (
    <MainWrapper>
      <AppHeader title="Locations" />
      <MapboxGL.MapView style={styles.map}>
        <View style={styles.searchBox}>
          {svgIcon.Search}
          <TextInput
            placeholder="Search"
            placeholderTextColor={PFColors.Gray.DarkGray}
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
        </View>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={[74.2753883, 31.4541112]}
        />
        <MapboxGL.UserLocation
          visible
          showsUserHeadingIndicator
          onUpdate={() => {}} // Automatically updates current location
        />
      </MapboxGL.MapView>
      <View style={styles.sheetStyle}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <Pressable style={styles.itemStyle} onPress={navigateToPickup}>
            <View style={styles.itemInnerView}>
              <Text style={styles.titleText}>Pickup Location</Text>
              <View style={styles.addressView}>
                {svgIcon.MapPin}
                <Text style={styles.addressText}>My current location</Text>
              </View>
            </View>
            {svgIcon.LeftArrow}
          </Pressable>
          <Pressable style={styles.itemStyle} onPress={navigateToDestination}>
            <View style={styles.itemInnerView}>
              <Text style={styles.titleText}>Destination Location</Text>
              <View style={styles.addressView}>
                {svgIcon.Location}
                <Text style={styles.addressText}>
                  {destinationAddress?.placeName
                    ? destinationAddress?.placeName
                    : 'choose desitination address'}
                </Text>
              </View>
            </View>
            {svgIcon.LeftArrow}
          </Pressable>
          <AppButton
            disabled={isDisable}
            title="Save"
            buttonStyle={styles.btnStyle}
            handleClick={handleSave}
          />
        </ScrollView>
      </View>
    </MainWrapper>
  );
};

export default Locations;

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

// import React, {useEffect, useState} from 'react';
// import {StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Platform} from 'react-native';
// import MapboxGL from '@rnmapbox/maps';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

// const Locations = () => {
//   const [currentLocation, setCurrentLocation] = useState([74.2753883, 31.4541112]); // Default coordinates (Lahore, Pakistan)
//   const [selectedLocation, setSelectedLocation] = useState([74.2753883, 31.4541112]); // Selected location
//   const [permissionGranted, setPermissionGranted] = useState(false);

//   useEffect(() => {
//     const getLocationPermission = async () => {
//       try {
//         const permission =
//           Platform.OS === 'android'
//             ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
//             : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

//         const result = await check(permission);

//         if (result === RESULTS.GRANTED) {
//           setPermissionGranted(true);
//         } else if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
//           const requestResult = await request(permission);
//           if (requestResult === RESULTS.GRANTED) {
//             setPermissionGranted(true);
//           } else {
//             Alert.alert('Permission Denied', 'Please enable location permissions.');
//           }
//         } else {
//           Alert.alert('Permission Error', 'Unable to access location.');
//         }
//       } catch (error) {
//         console.error('Permission error:', error);
//       }
//     };

//     getLocationPermission();
//   }, []);

//   const handleUserLocationUpdate = (location) => {
//     const {latitude, longitude} = location.coords;
//     const coordinates = [longitude, latitude];
//     setCurrentLocation(coordinates); // Set current location
//     setSelectedLocation(coordinates); // Also set as selected location initially
//   };

//   const handleCameraChange = (event) => {
//     const {geometry} = event;
//     setSelectedLocation(geometry.coordinates); // Update selected location
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Locations</Text>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchBar}>
//         <TextInput style={styles.searchInput} placeholder="Search" />
//       </View>

//       {/* Map */}
//       {permissionGranted && (
//         <MapboxGL.MapView
//           style={styles.map}
//           onRegionDidChange={(e) => handleCameraChange(e)}>
//           <MapboxGL.Camera
//             zoomLevel={14}
//             // centerCoordinate={currentLocation}
//             animationMode="flyTo"
//           />
//           {/* User Location */}
//           <MapboxGL.UserLocation
//             visible
//             onUpdate={handleUserLocationUpdate} // Automatically updates current location
//           />
//           {/* Pin at the Center */}
//           <MapboxGL.MarkerView coordinate={selectedLocation}>
//             <View style={styles.marker}>
//               <Text style={styles.markerText}>📍</Text>
//             </View>
//           </MapboxGL.MarkerView>
//         </MapboxGL.MapView>
//       )}

//       {/* Location Inputs */}
//       <View style={styles.locationContainer}>
//         <View style={styles.locationItem}>
//           <Text style={styles.locationLabel}>Pickup Location</Text>
//           <Text style={styles.locationValue}>
//             {selectedLocation[1]}, {selectedLocation[0]}
//           </Text>
//         </View>
//         <View style={styles.locationItem}>
//           <Text style={styles.locationLabel}>Destination Location</Text>
//           <Text style={styles.locationValue}>
//             Street 5, Block R2 Block R 2 Phase 2 Johar Town
//           </Text>
//         </View>
//       </View>

//       {/* Save Button */}
//       <TouchableOpacity style={styles.saveButton}>
//         <Text style={styles.saveButtonText}>Save</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Locations;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//     paddingBottom: 15,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   searchBar: {
//     margin: 15,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//   },
//   map: {
//     flex: 1,
//   },
//   locationContainer: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 15,
//     borderTopRightRadius: 15,
//     padding: 15,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: -1},
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   locationItem: {
//     marginBottom: 10,
//   },
//   locationLabel: {
//     color: '#888',
//     fontSize: 14,
//   },
//   locationValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   saveButton: {
//     backgroundColor: '#007BFF',
//     margin: 15,
//     borderRadius: 8,
//     padding: 15,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   marker: {
//     backgroundColor: 'white',
//     height: 30,
//     width: 30,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   markerText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });
