import { StyleSheet } from "react-native";
import { PFColors, PFFonts, PFFontSize, scale } from "../../../../../shared/exporter";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderBottomWidth: 1,
        borderColor: PFColors.Gray.borderGray,
        paddingBottom: scale(8),
    },
    ratingLeftView: {
        width: '38%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ratingText: {
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_24,
    },
    ratingCountText: {
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_12,
    },
    ratingRightView: {
        width: '60%',
        paddingVertical: scale(12),
    },
    lineContainer: {
        height: 5,
        width: '100%',
        backgroundColor: PFColors.Gray.borderGray,
        borderRadius: 2,
        marginVertical: scale(4),
    },
    lineStyle: {
        height: '100%',
        backgroundColor: PFColors.Yellow.Light,
        borderRadius: 2,
    },
    ratingStarStyles: {
        height: scale(18),
        width: scale(18),
        marginHorizontal: 4,
        marginTop: scale(12),
        marginBottom: scale(12),
    },
    rateStarStyles: {
        height: 27,
        width: 27,
        marginHorizontal: 4,
        marginTop: 0,
        marginLeft: scale(4),
    },
    smallStarsStyle: {
        height: 12,
        width: 12,
        marginHorizontal: 2,
        marginTop: 0,
    },
    userImageStyle: {
        height: 32,
        width: 32,
        borderRadius: 32,
        backgroundColor: PFColors.Gray.LightMist,
    },
    rateView: {
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderColor: PFColors.Gray.borderGray,
        paddingVertical: scale(12),
        justifyContent: 'center'
    },
    rateSubView: {
        flexDirection: 'row',
         marginTop: scale(12),
    },
    rateHeaderText: {
         color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_16,
    },
     imageStyle: {
        height: 240,
        width: 195,
        borderRadius: 14.75,
        backgroundColor: PFColors.Gray.LightMist,
    },
    columnWrapperStyle: {
        justifyContent: 'space-between',
        marginVertical: scale(6),
    },
    contentContainerStyle: {
        // paddingBottom: scale(50),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: scale(6),
    },
    rightView: {
        flexDirection: 'row',
        width: '48%',
        alignItems: 'center'
    },
    leftView: {
        flexDirection: 'row',
        width: '48%',
        alignItems: 'center',
         justifyContent: 'flex-end',
    },
    rateCardContainer: {
        paddingVertical: scale(6),
        borderBottomWidth: 1,
        borderColor: PFColors.Gray.borderGray,
    },
    nameText: {
         color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_12,
        marginLeft: scale(4),
    },
    timeText: {
         color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_10,
        marginRight: scale(2),
    },
    detailsText: {
         color: PFColors.Gray.DarkGray,
        fontFamily: PFFonts.Foundation.Regular,
        fontSize: PFFontSize.FONT_SIZE_12,
        marginVertical: scale(4),
    },
});

export default styles;