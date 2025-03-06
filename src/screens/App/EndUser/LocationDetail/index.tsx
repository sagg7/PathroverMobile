import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Svg from 'react-native-svg';
import { appImages } from '../../../../assets/images';
import { svgIcon } from '../../../../assets/svg';
import { RatingStars } from '../../../../components';
import LocationDetailTab from '../../../../navigation/LocationDetailTopTab/LocationDetailTopTab';
import styles from './styles';

interface LocationDetailModalProps {
    modalVisible: boolean;
    setModalVisible?: () => void;
    onPressCross: () => void;
}

const IconDetail = ({ icon, title }) => {
    return (
        <View style={styles.iconView}>
            {icon}
            <Text style={styles.detailText}>{title}</Text>
        </View>
    )
};

const IconButton = ({ icon, title, isDarkBg = true, onPress }) => {
    return (
        <TouchableOpacity style={styles.iconButtonStyle(isDarkBg)} onPress={onPress}>
            <Svg height={20} width={20}>
                {icon}
            </Svg>
            <Text style={styles.iconButtonText(isDarkBg)}>{title}</Text>
        </TouchableOpacity>
    )
}

const LocationDetail = ({
    modalVisible,
    setModalVisible,
    onPressCross,
}: LocationDetailModalProps) => {
    const bottomSheetRef = useRef(null);

    const snapPoints = ['35%', '60%', '90%'];

    const renderItem = () => {
        return (
            <Image
                source={appImages.locationView}
                style={styles.imageStyle}
            />
        )
    }

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={modalVisible ? 1 : -1}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={() => setModalVisible(false)}
            style={styles.bottomSheet}
            handleComponent={null}
        >
            <BottomSheetView
                style={styles.main}
            >
                <View style={styles.headerView}>
                    <Text style={styles.locationText}>Wapda Town</Text>
                    <TouchableOpacity onPress={onPressCross}>
                        {svgIcon.Cross}
                    </TouchableOpacity>
                </View>
                <View style={styles.detailContainer}>
                    <View style={styles.leftContainer}>
                        <View style={styles.ratingView}>
                            <Text style={styles.ratingText}>4.3</Text>
                            <RatingStars rating={4} />
                            <Text style={styles.ratingCountText}>(414)</Text>
                        </View>
                        <View style={styles.detailsView}>
                            <IconDetail title={'33.77Km'} icon={svgIcon.MapWindow} />
                            <View style={styles.circleView} />
                            <IconDetail title={'9:44'} icon={svgIcon.BlueClock} />
                        </View>
                    </View>
                    <View style={styles.rightContainer}>
                        <TouchableOpacity style={styles.actionButton}>
                            {svgIcon.ShareButton}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            {svgIcon.PinButton}
                        </TouchableOpacity>

                    </View>
                </View>
                <View style={styles.buttonView}>
                    <IconButton title={'Direction'} icon={svgIcon.Direction} />
                    <IconButton title={'Start'} icon={svgIcon.StartIcon} isDarkBg={false} />
                </View>
                <View>
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6]}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => item + index.toString()
                        }
                        renderItem={renderItem}
                    />
                </View>
                <LocationDetailTab />
            </BottomSheetView>
        </BottomSheet>
    );
};

export default LocationDetail;

