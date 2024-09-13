import { StyleSheet } from 'react-native';
import { PFColors, PFFontSize, PFFonts, WP } from '../../../../shared/exporter';

const styles = StyleSheet.create({
    profilePicContainer: {
        height: WP('30'),
        width: WP('30'),
        borderRadius: WP('30') / 2,
        borderWidth: 1,
        borderColor: PFColors.Blue.Dark,
        borderStyle: "dashed",
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
        marginTop: WP('5')
    },

    placeholder: {
        height: WP('20'),
        width: WP('20'),
    },
    uploadText: {
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_16,
        color: PFColors.Standard.Black,
        textAlign: "center",
        paddingTop: 5
    },
    changeText: {
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_16,
        color: PFColors.Orange.Dark,
        textAlign: "center",
        textDecorationLine: "underline",
        paddingTop: 5
    },
    profilePicture: {
        height: WP('30'),
        width: WP('30'),
        borderRadius: WP('30') / 2,
        alignSelf: "center",
        marginTop: WP('5')
    },
    height: {
        height: 40
    },
    buttonStyle: {
        width: WP('94'),
        alignSelf: "center",
        marginTop: WP('10')
    },
    rowStyles: {
        backgroundColor: PFColors.Gray.WhisperGray,
        marginHorizontal: WP('4'),
        padding: 15,
        borderRadius: 10,
        marginVertical: WP('3'),
    },
    innerContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    fileIcon: {
        height: WP('10'),
        width: WP('10'),
        borderRadius: WP('10') / 2,
    },
    title: {
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,
        paddingLeft: WP('3'),
        width: WP("58"),
    },
    clearView: {
        width: WP('15'),
    },
    clearText: {
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Orange.Dark,
        textAlign: "center",
        textDecorationLine: "underline",
    },
    secondaryView: {
        flexDirection: "row",
        paddingVertical: 10
    },
    secondaryTitle: {
        fontFamily: PFFonts.Foundation.Regular,
        fontSize: PFFontSize.FONT_SIZE_12,
        color: PFColors.Standard.Black
    },
    WeightContainer: {
        width: WP('44'),
    },
    modalContainer: {
        width: WP('44'),
        paddingLeft: 10
    },
    weightText: {
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,
        paddingTop: 5
    }
});
export default styles;
