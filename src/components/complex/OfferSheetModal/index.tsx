import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import { AppButton } from '../AppButton';
import { PFColors, PFFontSize, PFFonts, WP, appIcons } from '../../../shared/exporter';
import ReviewCard from '../ReviewCard';
import { svgIcon } from '../../../assets/svg';
import OfferSheet from '../../../screens/App/Driver/RequestList/OfferSheet';

interface OfferSheetModalProps {
    modalVisible: boolean;
    setModalVisible: () => void;
    onPressDone: () => void;
    onPressCross: () => void
    onPressCancel: () => void

}
const OfferSheetModal = ({ modalVisible, setModalVisible, onPressCancel }: OfferSheetModalProps) => {
    return (
        <Modal
            useNativeDriver
            isVisible={modalVisible}
            onBackdropPress={setModalVisible}
            style={styles.modalContainer}>
            <View>
                <OfferSheet handleSendOfferBtn={() => console.log("ok")
                } onPressCancel={onPressCancel} />
            </View>
        </Modal>
    )
}

export { OfferSheetModal }

const styles = StyleSheet.create({
    modalContainer: {
        bottom: 0,
        margin: 0,
        position: 'absolute',
        borderRadius: WP('3'),
        paddingVertical: WP('5'),
        backgroundColor: PFColors.Standard.White,
        width: WP('100'),
        paddingHorizontal: WP('4')
    },

})