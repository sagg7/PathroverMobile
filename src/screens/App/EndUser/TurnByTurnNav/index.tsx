import React, {useState, useEffect} from 'react';
import {View, requireNativeComponent} from 'react-native';
import {AppLoader} from '../../../../components';

const MapBoxView = requireNativeComponent('MapBoxView');

const TurnByTurnNav = ({route, navigation}: any) => {
  const routeParams = route.params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <View style={{flex: 1}}>
      <MapBoxView
        startLat={routeParams?.originCoords?.[1]}
        startLng={routeParams?.originCoords?.[0]}
        endLat={routeParams?.entranceCoords?.[1]}
        endLng={routeParams?.entranceCoords?.[0]}
        originName="Origin"
        destinationName={routeParams?.entranceName}
        style={{flex: 1}}
        onClose={() => navigation.goBack()}
      />
      {loading && <AppLoader />}
    </View>
  );
};

export default TurnByTurnNav;
