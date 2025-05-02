import React, {useState, useEffect} from 'react';
import {Text, View, requireNativeComponent} from 'react-native';
import {AppLoader} from '../../../../components';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedTrail} from '../../../../redux/endUser/endUserSlice';
import {Routes} from '../../../../shared/exporter';
import TrailRouteView from '../TrailRouteView';

const MapBoxView = requireNativeComponent('MapBoxView');

const TurnByTurnNav = ({route, navigation}: any) => {
  const routeParams = route.params;
  const [loading, setLoading] = useState(true);
  const {selectedTrail} = useSelector(state => state?.endUser?.trailRoute);
  const dispatch = useDispatch();
  const [isTurnByTurnNavigation, setisTurnByTurnNavigation] = useState(true);

  console.log('\n\n\n===>12345TRAIL', selectedTrail);
  console.log('\n\n\n===>12345', routeParams?.isTrail);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

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
              if (resp?.isTrail) {
                if (resp?.message === 'Navigation completed') {
                  // Move to Trail Path display screen (custom)
                  // navigation.navigate(Routes.TrailRouteView);
                  setisTurnByTurnNavigation(false);
                } else if (resp?.message === 'Navigation cancelled') {
                  // Clear trail data from redux if isTrail true
                  dispatch(setSelectedTrail(null));
                  navigation.goBack();
                }
              } else {
                navigation.goBack();
              }
            }}
          />
          {loading && <AppLoader />}
        </View>
      ) : (
        <TrailRouteView route={selectedTrail} />
      )}
    </>
  );
};

export default TurnByTurnNav;
