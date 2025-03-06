import { StyleSheet } from "react-native";
import { PFColors, PFFonts, PFFontSize, scale } from "../../../../shared/exporter";

const styles = StyleSheet.create({
    bottomSheet: {
        margin: 0,
        justifyContent: 'flex-end',
         borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    main: {
        backgroundColor: PFColors.Standard.White,
        padding: scale(16),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flex: 1,
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: scale(4),
    },
    ratingView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: scale(8),
    },
    detailsView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circleView: {
        padding: scale(3),
        borderRadius: 3,
        backgroundColor: PFColors.Gray.borderGray,
        marginHorizontal: scale(8),
    },
    iconView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftContainer: {
        justifyContent: 'center',
        width: '80%',
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: scale(6),
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconButtonStyle: isDark => ({
        backgroundColor: isDark ? PFColors.Blue.Dark : `${PFColors.Blue.SoftBlue}30`,
        borderWidth: 1,
        borderColor: PFColors.Blue.Dark,
        borderRadius: 36,
        marginRight: scale(6),
        marginVertical: scale(4),
        flexDirection: 'row',
        paddingVertical: scale(8),
        paddingHorizontal: scale(12),
    }),
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(6),
    },
    imageStyle: {
        height: 118,
        width: 152,
        borderRadius: 14.75,
        backgroundColor: PFColors.Gray.LightMist,
        marginRight: scale(6),
        marginVertical: scale(4),
    },
    locationText: {
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.Bold,
        fontSize: PFFontSize.FONT_SIZE_16,
    },
    ratingText: {
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_12,
        marginRight: scale(6),
        marginTop: scale(2),
    },
    ratingCountText: {
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_12,
        marginHorizontal: scale(8),
        marginTop: scale(2),
    },
    detailText: {
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_14,
        marginLeft: scale(5),
    },
    actionButton: {
        marginLeft: scale(6),
    },
    iconButtonText: isDark => ({
        color: !isDark ? PFColors.Blue.Dark : PFColors.Standard.White,
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_14,
        marginLeft: scale(4),
    })
});

export default styles;