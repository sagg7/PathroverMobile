import React, {useEffect, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {
  AppHeader,
  CancelRideSheet,
  MainWrapper,
  OrderAddressCard,
  RideActionCard,
} from '../../../../components';
import {useNavigation} from '@react-navigation/native';

const OrderPickup = (route: any) => {
  const item = route?.route?.params?.item;
  const [showRideActioSheet, setshowRideActioSheet] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      setshowRideActioSheet(true);
    }, 3000);
  }, []);

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="Pickup Address" />
      <OrderAddressCard item={item} />

      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={[74.2753883, 31.4541112]}
        />
      </MapboxGL.MapView>
      <RideActionCard
        modalVisible={showRideActioSheet}
        item={item}
        onPressCancel={() => {
          setshowRideActioSheet(false);
          setTimeout(() => {
            setShowCancelSheet(true);
          }, 1000);
          // navigation.goBack();
        }}
      />
      <CancelRideSheet
        modalVisible={showCancelSheet}
        onPressDone={() => {
          setShowCancelSheet(false);
          navigation.goBack();
        }}
      />
    </MainWrapper>
  );
};

export default OrderPickup;
