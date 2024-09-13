import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle, Image } from 'react-native';
import Modal from 'react-native-modal';
import { svgIcon } from '../../../assets/svg';
import { PFColors, PFFontSize, PFFonts, WP, appIcons, isIOS } from '../../../shared/exporter';
import { AppButton } from '../AppButton';

interface SendOfferModalProps {
    isModalVisible: boolean;
    handleClickEmail: () => void;
    onPressClose: () => void
    type: boolean
}

const SendOfferModal: React.FC<SendOfferModalProps> = ({
    isModalVisible,
    onPressClose,
    type = "accepted"
}) => {
    return (
        <View style={styles.container}>
            <Modal
                isVisible={isModalVisible}
                style={styles.modal}
                swipeDirection="down"
                onBackdropPress={onPressClose}
            >
                <View style={styles.modalContent}>
                    {type === "rejected" ?
                        <>
                            <Text style={styles.rejecttMessage}>{"Unfortunately, your offer has\nbeen declined"}</Text>
                            <AppButton title='Go Back' buttonStyle={styles.goBackBtn} />
                        </>
                        :
                        <>
                            <TouchableOpacity disabled>
                                <View style={styles.bubleViewContainer}>
                                    <View style={styles.expandingView}>
                                        <Image source={appIcons.clock} style={[styles.bubleIcon]} resizeMode='contain' />
                                        <Text style={styles.text}>
                                            Expires in : <Text style={styles.timeText}>04:54</Text>
                                        </Text>

                                    </View>
                                    <Text style={styles.offerSentText}>
                                        Your offer has been been sent, Please wait for Transport Manager Response.
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    }
                </View>
            </Modal>
        </View>
    );
};

export { SendOfferModal };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    modal: {
        justifyContent: 'center',
        margin: 0,
    } as ViewStyle,
    modalContent: {
        backgroundColor: 'white',
        padding: WP('3'),
        borderRadius: WP('5'),
        margin: 15
    } as ViewStyle,
    rejecttMessage: {
        fontFamily: PFFonts.Foundation.SemiBold,
        color: PFColors.Standard.Black,
        fontSize: PFFontSize.FONT_SIZE_20,
        textAlign: "center",
        lineHeight: 30

    } as TextStyle,
    goBackBtn: {
        width: WP('40'),
        alignSelf: "center",
        marginVertical: WP('3'),
        height: WP('12s')
    } as ViewStyle,
    bubleViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        alignSelf: "center",
        marginVertical: 5,

    },

    expandingView: {
        backgroundColor: PFColors.Gray.CloudWhite,
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.Medium, paddingBottom: 3
    },
    bubleIcon: {
        height: 16,
        width: 16,
        marginHorizontal: 5,
    },
    timeText: {
        color: PFColors.Red.RadiantRed
    },
    offerSentText: {
        fontSize: PFFontSize.FONT_SIZE_16,
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.Medium,
        textAlign: "center",
        paddingTop: 10
    }

});
