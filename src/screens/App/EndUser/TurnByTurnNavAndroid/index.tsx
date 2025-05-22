import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, requireNativeComponent} from 'react-native';
import {useSelector} from 'react-redux';
import {AppLoader, MapTypes} from '../../../../shared/exporter';

const MapBoxView = requireNativeComponent('MapBoxView');

const TurnByTurnNavAndroid = ({navigation, route}: any) => {
  console.log('ROUTE', route);
  const routeParams = route?.params;
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);
  const [selectedMapStyle, setSelectedMapStyle] = useState<any>('default');
  const [loader, setLoader] = useState(true);
  const [isTurnByTurnNavigation, setisTurnByTurnNavigation] = useState(true);
  const [isDashedLineDrawn, setIsDashedLineDrawn] = useState(false);

  useEffect(() => {
    if (mapLayerStyle) {
      setSelectedMapStyle(
        MapTypes?.find(item => item.type === mapLayerStyle)?.value,
      );
    }
  }, [mapLayerStyle]);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  }, []);

  const handleDisplayError = (event: any) => {
    const {error} = event.nativeEvent;
    // const route = useRoute();
    const regex = /message=(.*?)(?:,|\])/;
    const match = error.match(regex);

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

  const handleUserArrival = (event: any) => {
    const {hasTrail, drawDashedLine} = event.nativeEvent;
    console.log('Has Trail => ', hasTrail);
    console.log('Has Dashed Line => ', drawDashedLine);
    Alert.alert(
      'Arrived',
      hasTrail || drawDashedLine
        ? 'Off-road navigation begins here. Follow the dashed line to your destination.'
        : 'You have reached your destination.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <>
      {loader ? (
        <AppLoader />
      ) : (
        <MapBoxView
          style={{flex: 1}}
          showsEndOfRouteFeedback={true}
          mapStyle={selectedMapStyle} // or 'terrain', 'default'
          // shouldSimulateRoute={true}
          origin={[
            routeParams?.originCoords?.[0],
            routeParams?.originCoords?.[1],
          ]}
          destination={[
            routeParams?.entranceCoords?.[0],
            routeParams?.entranceCoords?.[1],
          ]}
          onLocationChange={(event: any) => {
            // console.log('onLocationChange', event.nativeEvent);
          }}
          onRouteProgressChange={(event: any) => {
            // console.log('onRouteProgressChange', event.nativeEvent);
          }}
          onError={(event: any) => handleDisplayError(event)}
          onArrive={(event: any) => handleUserArrival(event)}
          originName="Origin"
          destinationName={routeParams?.entranceName}
          hasTrail={true}
          drawDashedLine={false}
          onCancelNavigation={(event: any) => navigation.goBack()}
        />
      )}
    </>
  );
};

export default TurnByTurnNavAndroid;
