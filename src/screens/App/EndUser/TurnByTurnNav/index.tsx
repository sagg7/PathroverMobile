import React, {useState, useEffect} from 'react';
import {Text, View, requireNativeComponent} from 'react-native';
import {AppLoader} from '../../../../components';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedTrail} from '../../../../redux/endUser/endUserSlice';
import TrailRouteView from '../TrailRouteView';
import ViewCustomizedSaveRoutes from '../ViewCustomizedSaveRoutes';
import {MapTypes} from '../../../../shared/exporter';

const MapBoxView = requireNativeComponent('MapBoxView');

const TurnByTurnNav = ({route, navigation}: any) => {
  const routeParams = route.params;
  const [loading, setLoading] = useState(true);
  const {selectedTrail} = useSelector(state => state?.endUser?.trailRoute);
  const dispatch = useDispatch();
  const [isTurnByTurnNavigation, setisTurnByTurnNavigation] = useState(true);
  const [isDashedLineDrawn, setIsDashedLineDrawn] = useState(false);
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);
  const [selectedMapStyle, setSelectedMapStyle] = useState<any>('default');

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (mapLayerStyle) {
      setSelectedMapStyle(
        MapTypes?.find(item => item.type === mapLayerStyle)?.value,
      );
    }
  }, [mapLayerStyle]);

  const isLibrary = routeParams?.isLibrary;

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
            mapStyle={selectedMapStyle} // "default", "satellite", or "terrain"
            hasTrail={routeParams?.isTrail ? 1 : 0}
            onClose={(res: any) => {
              const resp = res?.nativeEvent;
              if (resp?.isDashedLineDrawn) {
                setIsDashedLineDrawn(resp?.isDashedLineDrawn);
                setisTurnByTurnNavigation(false);

                return;
              }
              if (resp?.isTrail) {
                if (resp?.message === 'Navigation completed') {
                  setisTurnByTurnNavigation(false);
                } else if (resp?.message === 'Navigation cancelled') {
                  dispatch(setSelectedTrail(null));
                  navigation.goBack();
                }
              } else {
                if (isLibrary && resp?.message === 'Navigation completed') {
                  setisTurnByTurnNavigation(false);
                } else {
                  navigation.goBack();
                }
              }
            }}
          />
          {loading && <AppLoader />}
        </View>
      ) : isLibrary ? (
        <ViewCustomizedSaveRoutes route={routeParams?.routeInfo} />
      ) : (
        <TrailRouteView
          route={selectedTrail}
          isDashedLineDrawn={isDashedLineDrawn}
          destinationCords={routeParams?.entranceCoords}
          isWayPoint={routeParams?.isTrail ? false : true}
          isTrail={routeParams?.isTrail}
        />
      )}
    </>
  );
};

export default TurnByTurnNav;
