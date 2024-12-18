import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import { AppHeader, CancelRideSheet, MainWrapper, OrderAddressCard, RideActionCard } from '../../../../components';

// MapboxGL.setAccessToken('sk.eyJ1IjoibWF0YW9zbWFuIiwiYSI6ImNtMHhsejduczBkOGEycXBnbmh2NG5oaDcifQ.pPM1yQbjLKE-C0Mjg8mi0Q');

const MapScreen = () => {
    return (
        <MainWrapper style={styles.container}>

            <AppHeader title='Pickup Address' />
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
    )
}


export default MapScreen