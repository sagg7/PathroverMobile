import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {
  AppHeader,
  CancelRideSheet,
  MainWrapper,
  OrderAddressCard,
  RideActionCard,
} from '../../../../components';

const OrderPickup = () => {
  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="Pickup Address" />
      <OrderAddressCard />

      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={[74.2753883, 31.4541112]}
        />
      </MapboxGL.MapView>
      <RideActionCard />
      <CancelRideSheet />
    </MainWrapper>
  );
};

export default OrderPickup;
