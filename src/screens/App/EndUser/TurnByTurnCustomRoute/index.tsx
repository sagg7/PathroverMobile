import React, {useState, useEffect} from 'react';
import {Text, View, requireNativeComponent} from 'react-native';
import {AppLoader} from '../../../../components';
import TrailRouteView from '../TrailRouteView';
import ViewSaveRoutes from '../ViewSaveRoutes';

const MapBoxView = requireNativeComponent('MapBoxView');

const TurnByTurnCustomRoute = ({route, navigation}: any) => {
  const routeParams = route.params;
  const [loading, setLoading] = useState(true);
  const [isTurnByTurnNavigation, setisTurnByTurnNavigation] = useState(true);
  const [isDashedLineDrawn, setIsDashedLineDrawn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  // console.log('routeIno', routeParams?.routeInfo);

  return (
    <>
      {isTurnByTurnNavigation ? (
        <View style={{flex: 1}}>
          <MapBoxView
            startLat={routeParams?.originCoords?.[1]}
            startLng={routeParams?.originCoords?.[0]}
            endLat={routeParams?.entranceCoords?.[1]}
            endLng={routeParams?.entranceCoords?.[0]}
            originName="Origin"
            destinationName={routeParams?.entranceName}
            style={{flex: 1}}
            hasTrail={routeParams?.isTrail ? 1 : 0}
            onClose={(res: any) => {
              const resp = res?.nativeEvent;
              setIsDashedLineDrawn(resp?.isDashedLineDrawn);
              if (resp?.message === 'Navigation completed') {
                // navigation.navigate(Routes.TrailRouteView);
                setisTurnByTurnNavigation(false);
              } else if (resp?.message === 'Navigation cancelled') {
                // Clear trail data from redux if isTrail true
                navigation.goBack();
              }
            }}
          />
          {loading && <AppLoader />}
        </View>
      ) : (
        <ViewSaveRoutes route={routeParams?.routeInfo} />
      )}
    </>
  );
};

export default TurnByTurnCustomRoute;
