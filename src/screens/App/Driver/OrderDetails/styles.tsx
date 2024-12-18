

import { StyleSheet } from 'react-native';
import { PFColors, PFFontSize, PFFonts, WP } from '../../../../shared/exporter';

const styles = StyleSheet.create({
    orderStatusInfo: {
        backgroundColor: PFColors.Blue.SoftGlacier,
        padding: WP('5'),
    },
    orderStatus: {
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_16,
        color: PFColors.Standard.Black,
    },
    orderStatusInfoText: {
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_12,
        color: PFColors.Gray.DarkGray,
        paddingVertical: WP('1'),
    },
    orderDeliveryInfoCard: {
        flexDirection: 'row',
        paddingHorizontal: WP('7'),
        paddingVertical: WP('5'),
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: PFColors.Gray.FrostedGray,
    },
    truckstyles: {
        height: WP('6'),
        width: WP('6'),
    },
    orderDeliveryTime: {
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_12,
        color: PFColors.Gray.DarkGray,
        paddingLeft: WP('3'),
    },
    itemOrderText: {
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_16,
        color: PFColors.Standard.Black,
    },
    orderDeliveryTimeCard: {
        flexDirection: 'row',
        paddingHorizontal: WP('7'),
        paddingVertical: WP('5'),
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: PFColors.Gray.FrostedGray,
        justifyContent: 'space-between',
    },
    accordianContainer: {
        backgroundColor: PFColors.Standard.White,
        paddingHorizontal: WP('5'),
        paddingVertical: WP('2'),
    },
    itemInfoContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: WP('1'),
    },
    itemInfoText: {
        fontFamily: PFFonts.Foundation.Regular,
        fontSize: PFFontSize.FONT_SIZE_12,
        color: PFColors.Standard.Black,
    },
    fontSize: {
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,

    },
    infoCard: {
        margin: WP('5'),
    },
    divider: {
        backgroundColor: PFColors.Gray.WhisperGray,
        height: WP('2'),
    },
    boldText: {
        fontFamily: PFFonts.Foundation.SemiBold,
        color: PFColors.Standard.Black,
    },
    grayShade: {
        color: PFColors.Gray.CharcoalGray,

    }
});

export default styles;

