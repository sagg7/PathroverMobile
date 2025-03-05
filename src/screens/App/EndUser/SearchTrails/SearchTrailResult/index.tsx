import { useNavigation } from '@react-navigation/native';
import MapboxGL from '@rnmapbox/maps';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { svgIcon } from '../../../../../assets/svg';
import { MainWrapper, MapLayerSheet } from '../../../../../components';
import useLocation from '../../../../../hooks/getLocation';
import {
    Default_Map_Style,
    MapTypes
} from '../../../../../shared/exporter';
import styles from './styles';
import LocationDetail from '../../LocationDetail';


const SearchTrailResult = () => {
    const navigation: any = useNavigation();
    const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
    const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
    const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const [showSheet, setShowSheet] = useState<boolean>(true);
    const dispatch = useDispatch();

    const [queryParams, setQueryParams] = useState<any>({
        latitude: null,
        longitude: null,
        radius: 50,
    });

    const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);

    const { location } = useLocation();

    const cameraRef = useRef<any>(null);

    useEffect(() => {
        if (location) {
            setCurrentLocation([location?.longitude, location?.latitude]);
            setQueryParams({
                ...queryParams,
                latitude: location?.longitude,
                longitude: location?.latitude,
            });
        }
    }, [location]);

    useEffect(() => {
        if (mapLayerStyle) {
            setSelectedMapType(mapLayerStyle);
            const tempMap = mapTypesArr.map(item => ({
                ...item,
                isSelected: item.type === mapLayerStyle,
            }));
            setMapTypesArr(tempMap);
        }
    }, [mapLayerStyle]);


    return (
        <GestureHandlerRootView style={styles.gestureView}>
            <MainWrapper style={styles.container}>
                <MapboxGL.MapView
                    key={selectedMapType}
                    styleURL={selectedMapType}
                    style={styles.map}
                    scaleBarEnabled={false}
                >
                    <MapboxGL.Camera
                        ref={cameraRef}
                        zoomLevel={12}
                        centerCoordinate={currentLocation}
                    />
                    {currentLocation && (
                        <MapboxGL.MarkerView coordinate={currentLocation}>
                            {svgIcon.CurrentLocation}
                        </MapboxGL.MarkerView>
                    )}
                </MapboxGL.MapView>

                <MapLayerSheet
                    setModalVisible={() => setMapLayerSheeet(false)}
                    modalVisible={mapLayerSheeet}
                    data={mapTypesArr}
                    onPressCancel={() => setMapLayerSheeet(false)}
                />
                <View style={styles.actionBtnView}>

                </View>
            </MainWrapper>
            {showSheet && <LocationDetail
                modalVisible={showSheet}
                setModalVisible={() => { setShowSheet(!showSheet) }}
            />}
        </GestureHandlerRootView>
    );
};

export default SearchTrailResult;
