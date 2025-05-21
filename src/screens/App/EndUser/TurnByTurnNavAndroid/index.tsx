import {useRoute} from '@react-navigation/native';
import React from 'react';
import {Alert, requireNativeComponent} from 'react-native';

const MapBoxView = requireNativeComponent('MapBoxView');

const TurnByTurnNavAndroid = ({navigation, route}: any) => {
  const handleDisplayError = (event: any) => {
    const {error} = event.nativeEvent;
    // const route = useRoute();
    const regex = /message=(.*?)(?:,|\])/;
    const match = error.match(regex);
    console.log('ROUTE', route);

    if (match) {
      const [, message] = match;
      console.log(message.trim());
      if (message === 'No route found') {
        Alert.alert(
          'No Route',
          'No route found between origin and destination.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert('Error', message.trim());
      }
    } else {
      console.log('Message not found.');
    }
  };

  return (
    <MapBoxView
      style={{flex: 1}}
      showsEndOfRouteFeedback={true}
      shouldSimulateRoute={true}
      origin={[74.2753, 31.4542]}
      destination={[74.2774, 31.4563]}
      onLocationChange={(event: any) => {
        // console.log('onLocationChange', event.nativeEvent);
      }}
      onRouteProgressChange={(event: any) => {
        // console.log('onRouteProgressChange', event.nativeEvent);
      }}
      onError={(event: any) => handleDisplayError(event)}
      onArrive={(event: any) => {
        navigation.goBack();
        console.log('Has Trail => ', event.nativeEvent.hasTrail);
        console.log('Has Dashed Line => ', event.nativeEvent.drawDashedLine);
      }}
      mapStyle="satellite" // or 'terrain', 'default'
      originName="Origin"
      destinationName="Destination"
      hasTrail={true}
      drawDashedLine={false}
      onCancelNavigation={(event: any) => navigation.goBack()}
    />
  );
};

export default TurnByTurnNavAndroid;
