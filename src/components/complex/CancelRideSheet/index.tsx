import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import { AppButton } from '../AppButton';
import { PFColors, PFFontSize, PFFonts, WP } from '../../../shared/exporter';

interface CancelRideSheetProps {
    modalVisible: boolean;
    handleClick: (dates: { startDate: string; endDate: string }) => void;
    setModalVisible: () => void;
    onPressDone: () => void;
}
const CancelRideSheet = ({ modalVisible, setModalVisible, onPressDone }: CancelRideSheetProps) => {
    return (
        <Modal
            useNativeDriver
            isVisible={modalVisible}
            onBackdropPress={setModalVisible}
            style={styles.modalContainer}>
            <View>
                <Text style={styles.text}>{"Are you sure you want to Cancel\nRide?"}</Text>
                <View style={styles.buttonsRow}>
                    <AppButton
                        title="Done"
                        isEmpty={false}
                        textStyle={styles.textStyle}
                        handleClick={onPressDone}
                    />
                </View>
            </View>
        </Modal>
    )
}

export { CancelRideSheet }

const styles = StyleSheet.create({
    modalContainer: {
        bottom: 0,
        margin: 0,
        position: 'absolute',
        borderRadius: WP('3'),
        paddingVertical: WP('5'),
        backgroundColor: PFColors.Standard.White,
    },
    buttonsRow: {
        paddingHorizontal: WP('5'),
        marginVertical: 10
    },
    textStyle: {
        width: '100%',
        textAlign: 'center',
    },

    text: {
        fontFamily: PFFonts.Foundation.SemiBold,
        color: PFColors.Standard.EclipseBlack,
        fontSize: PFFontSize.FONT_SIZE_20,
        textAlign: "center",
        lineHeight: 30
    },

})