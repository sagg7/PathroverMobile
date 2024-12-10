import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppHeader, MainWrapper} from '../../../../../components';
import MapboxGL from '@rnmapbox/maps';

const Locations = () => {
  return (
    <MainWrapper>
      <AppHeader title="Locations" />
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={[74.2753883, 31.4541112]}
        />
         <MapboxGL.UserLocation
            visible
            onUpdate={()=>{}} // Automatically updates current location
          />
      </MapboxGL.MapView>
    </MainWrapper>
  );
};

export default Locations;

const styles = StyleSheet.create({
  map: {
    flex:1
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


