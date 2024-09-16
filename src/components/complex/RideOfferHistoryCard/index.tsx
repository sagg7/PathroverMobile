import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PFColors, PFFontSize, PFFonts, WP } from '../../../shared/exporter';
import { FromAndToCard } from '../FromAndToCard';
import { RideOfferDscription } from '../RideOfferDscription';
import { AppButton } from '../AppButton';
import { svgIcon } from '../../../assets/svg';

interface RideOfferHistoryCardProps {
    onPressDel?: () => void;
    onPressAccept?: () => void;
    item?: any;
    onPressCard?: () => void
}

const RideOfferHistoryCard = ({
    onPressAccept,
    onPressDel,
    item,
    onPressCard
}: RideOfferHistoryCardProps) => {
    return (
        <TouchableOpacity style={styles.mainContainer} activeOpacity={.7} onPress={onPressCard}>
            <View style={styles.blueHeader}>
                <Text style={styles.dateText}>Date: {item.date} 06/12/2022</Text>
                <View style={styles.delIconConntainer}>
                    <Text style={styles.rideCodeText}>{item.rideCode}RMK-KDF</Text>
                    <TouchableOpacity onPress={onPressDel}>
                        {svgIcon.Delete}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.innerContainer}>
                <FromAndToCard from={item.from} to={item.to} />
                <View style={styles.horizontalBar} />
                <RideOfferDscription items={item.descriptionItems} />
                <View style={styles.butonContainer}>
                    <AppButton
                        // title={`$ ${item.amount}`}
                        title={`$ 4342`}
                        buttonStyle={styles.btnStyles}
                        handleClick={onPressAccept}
                        textStyle={styles.amountBtn}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const RideHistoryCard = memo(RideOfferHistoryCard);

export { RideHistoryCard };

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: PFColors.Gray.WhisperGray,
        borderRadius: 20,
        margin: WP('5'),
    },
    blueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
    },
    dateText: {
        fontFamily: PFFonts.Foundation.Regular,
        color: PFColors.Standard.Black,
        fontSize: PFFontSize.FONT_SIZE_12,
    },
    innerContainer: {
        padding: 10,
    },
    horizontalBar: {
        backgroundColor: PFColors.Gray.FadedGray,
        height: 1,
        marginVertical: 15,
    },
    butonContainer: {
        marginVertical: WP('3'),
    },
    btnStyles: {
        width: WP('23'),
        height: 40,
    },
    delIconConntainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rideCodeText: {
        fontFamily: PFFonts.Foundation.Regular,
        color: PFColors.Standard.Black,
        fontSize: PFFontSize.FONT_SIZE_10,
        padding: 5,
        borderWidth: 1,
        borderColor: PFColors.Blue.Dark,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
        backgroundColor: PFColors.Standard.White,
    },
    amountBtn: {
        fontSize: PFFontSize.FONT_SIZE_14,
        fontFamily: PFFonts.Foundation.Regular,
        color: PFColors.Standard.White,
    },
});
