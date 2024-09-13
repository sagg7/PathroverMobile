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
        width: WP('95'),
        alignSelf: "center",
        marginTop: WP('60')
    }
});
export default styles;
