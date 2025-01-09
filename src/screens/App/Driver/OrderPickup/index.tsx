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
  const [showRideActionSheet, setShowRideActionSheet] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      setShowRideActionSheet(true);
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
      {!showCancelSheet && (
        <RideActionCard
          modalVisible={showRideActionSheet}
          item={item}
          onPressCancel={() => {
            setShowRideActionSheet(false);
            setTimeout(() => {
              setShowCancelSheet(true);
            }, 1000);
          }}
        />
      )}
      <CancelRideSheet
        modalVisible={showCancelSheet}
        onPressDone={() => {
          setShowCancelSheet(false);
          navigation.goBack();
        }}
        setModalVisible={() => {
          setShowCancelSheet(false);
          setTimeout(() => {
            setShowRideActionSheet(true);
          }, 1000);
        }}
      />
    </MainWrapper>
  );
};

export default OrderPickup;
