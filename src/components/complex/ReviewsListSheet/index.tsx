import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import { AppButton } from '../AppButton';
import { PFColors, PFFontSize, PFFonts, WP, appIcons } from '../../../shared/exporter';
import ReviewCard from '../ReviewCard';
import { svgIcon } from '../../../assets/svg';

interface ReviewsListSheetProps {
    modalVisible: boolean;
    setModalVisible?: () => void;
    onPressDone: () => void;
    onPressCross: () => void
}
const ReviewsListSheet = ({ modalVisible, setModalVisible, onPressDone, onPressCross }: ReviewsListSheetProps) => {
    return (
        <Modal
            useNativeDriver
            isVisible={modalVisible}
            onBackdropPress={setModalVisible}
            style={styles.modalContainer}>
            <View>
                <TouchableOpacity style={styles.crossIconStyle} onPress={onPressCross}>
                    {svgIcon.CrossCirlce}
                </TouchableOpacity>
                <Image source={appIcons.userPlaceholder} style={styles.userProfile} />
                <Text style={styles.userName} numberOfLines={1}>Alex Hales</Text>
                <View style={styles.userFeedback}>
                    <Text style={styles.titleText} >User Feedback</Text>
                    <Text style={[styles.titleText, styles.orangeColor]} >See all</Text>
                </View>
                <FlatList
                    horizontal
                    data={[0, 1]}
                    renderItem={({ item }) => <ReviewCard />}
                    keyExtractor={(item) => item.id}
                />

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

export { ReviewsListSheet }

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
    buttonsRow: {
        // paddingHorizontal: WP('5'),
        marginVertical: 10
    },
    textStyle: {
        width: '100%',
        textAlign: 'center',
    },

    userProfile: {
        height: WP('24'),
        width: WP('24'),
        borderRadius: WP('24') / 2,
        alignSelf: "center"
    },
    userName: {
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_16,
        color: PFColors.Standard.Black,
        alignSelf: "center",
        paddingVertical: WP('3')
    },
    titleText: {
        fontFamily: PFFonts.Foundation.SemiBold,
        color: PFColors.Standard.EclipseBlack,
        fontSize: PFFontSize.FONT_SIZE_16,
    },
    userFeedback: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5
    },
    orangeColor: {
        color: PFColors.Orange.Dark,
        fontSize: PFFontSize.FONT_SIZE_14,
        fontFamily: PFFonts.Foundation.Regular
    },
    crossIconStyle: {
        alignSelf: "flex-end",
        marginVertical: WP('2')
    }

})