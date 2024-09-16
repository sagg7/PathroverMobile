import { FlatList, Image, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import Modal from 'react-native-modal';
import { AppButton } from '../AppButton';
import { PFColors, PFFontSize, PFFonts, WP, appIcons, fetchSuggestions } from '../../../shared/exporter';
import { AppInput } from '../..';
import MapboxGL from '@rnmapbox/maps';
import { svgIcon } from '../../../assets/svg';


interface FilterLocationSheetProps {
    modalVisible: boolean;
    handleClick: (dates: { startDate: string; endDate: string }) => void;
    setModalVisible: () => void;
    onPressDone: () => void;
    onPressCancel: () => void
}
const FilterLocationSheet = ({ modalVisible, setModalVisible, onPressDone, onPressCancel }: FilterLocationSheetProps) => {

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const debounceTimeout = useRef(null);


    const handleSelect = (place: any) => {
        const [longitude, latitude] = place.center;
        setQuery(place.place_name);
        setSuggestions([])

    };
    const handleChangeText = (text: any) => {
        setQuery(text);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
            const fetchData = await fetchSuggestions(text);
            console.log("fetchData", fetchData);

            setSuggestions(fetchData?.features);
        }, 2000);
    };




    return (
        <Modal
            useNativeDriver
            isVisible={modalVisible}
            onBackdropPress={setModalVisible}
            avoidKeyboard
            style={styles.modalContainer}>
            <View style={styles.container}>
                <View style={styles.sheetHeader}>
                    <Text style={styles.selectOptionText}>Locaion</Text>
                    <TouchableOpacity onPress={onPressCancel}>
                        {svgIcon.CrossCirlce}
                    </TouchableOpacity>
                </View>
                <AppInput placeholder='Location' value={query} onChangeText={handleChangeText} />

                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSelect(item)}>
                            <Text style={{ padding: 10 }}>{item.place_name}</Text>
                        </TouchableOpacity>
                    )}
                />

            </View>
            <Text style={styles.titleStyles}>Choose on map</Text>
            <View style={styles.mapViewContainer}>
                <MapboxGL.MapView style={styles.map}>

                    <MapboxGL.Camera
                        zoomLevel={12}
                        centerCoordinate={[74.2753883, 31.4541112]}

                    />
                </MapboxGL.MapView>
            </View>
            <AppButton title='Done' buttonStyle={styles.btnStyles} handleClick={() => onPressDone()} />
        </Modal>
    )
}

export { FilterLocationSheet }

const styles = StyleSheet.create({
    modalContainer: {
        bottom: 0,
        margin: 0,
        position: 'absolute',
        borderRadius: WP('3'),
        paddingVertical: WP('5'),
        backgroundColor: PFColors.Standard.White,
        width: "100%"
    },
    container: {
        marginHorizontal: WP('5')
    },
    mapViewContainer: {
        marginHorizontal: WP('5'),
        height: WP('35'),
        borderRadius: 20,
        overflow: "hidden",
        marginVertical: WP('5')
    },
    map: {
        flex: 1,
        borderRadius: 20
    },
    titleStyles: {
        fontFamily: PFFonts.Foundation.Regular,
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,
        marginHorizontal: WP('6'),
        paddingTop: WP('5s')
    },
    btnStyles: {
        alignSelf: "center",
        width: WP('92'),
        marginVertical: WP('4')
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: WP('5')
    },
    selectOptionText: {
        color: PFColors.Standard.Black,
        fontSize: PFFontSize.FONT_SIZE_16,
        fontFamily: PFFonts.Foundation.SemiBold,
    },

})