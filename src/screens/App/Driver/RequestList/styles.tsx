import { StyleSheet } from 'react-native';
import { PFColors, PFFontSize, PFFonts, WP } from '../../../../shared/exporter';

const styles = StyleSheet.create({
    height: {
        height: 40,
    },
    buttonStyle: {
        width: WP('95'),
        alignSelf: 'center',
        marginTop: WP('60'),
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'pink',
        alignSelf: 'center',
    },

    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 50,
    },
    centerSwitchWrapper: {
        position: 'absolute',
        left: '35%',
        transform: [{ translateX: -25 }],
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightText: {
        marginLeft: 'auto',
    },
    bellIcon: {
        marginLeft: 'auto',
        height: WP('6'),
        width: WP('6'),
        right: WP('5'),
    },
    bellContainer: {
        marginLeft: 'auto',
    },
    headerText: {
        fontFamily: PFFonts.Foundation.SemiBold,
        color: PFColors.Standard.Black,
        fontSize: PFFontSize.FONT_SIZE_16,
        paddingLeft: 10,
        paddingBottom: 5,
    },
    toggleContainer: {
        width: 50,
        height: 25,
        borderRadius: 25,
        padding: 5,
    },
    circleStyle: {
        width: 18,
        height: 18,
        borderRadius: 10,
    },

    sheetContainer: {
        width: WP('94'),
        alignSelf: 'center',
    },
    bubleViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },

    expandingView: {
        alignSelf: 'flex-start',
        backgroundColor: PFColors.Gray.CloudWhite,
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.Medium,
    },
    bubleIcon: {
        height: 8,
        width: 16,
        marginHorizontal: 5,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: WP('5')
    },
    bubleIconClockStyles: {
        height: 16,
        width: 16,
    },
    crossIconStyles: {
        alignSelf: 'flex-end',
        position: 'absolute',
        top: 10,
        right: 0
    },
    horizontalBar: {
        backgroundColor: PFColors.Gray.FadedGray,
        height: 1,
        marginVertical: 15,
        width: WP('90')
    },
    totalRideHeading: {
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.Medium,
        textAlign: "center"
    },
    offerFaresContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: WP('4')
    },
    crossIcon: {
        height: WP('6'),
        width: WP('6')
    },
    offerBtnStyle: {
        marginTop: WP('5')
    },
    onOffContainer: {
        backgroundColor: PFColors.Gray.WhisperGray,
        padding: 30,
        marginVertical: 15,
        marginHorizontal: WP('4'),
        borderWidth: 1,
        borderRadius: 10,
        borderColor: PFColors.Blue.Dark
    },
    turnOnOfText: {
        fontSize: PFFontSize.FONT_SIZE_16,
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.SemiBold,
        textAlign: "center",
        lineHeight: 25
    }
});
export default styles;
