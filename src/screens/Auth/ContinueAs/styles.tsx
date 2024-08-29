import { StyleSheet } from 'react-native';
import { PFColors, PFFontSize, PFFonts, WP, isIOS, scrWidth } from '../../../shared/exporter';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageStyles: {
        flex: 1,
        width: scrWidth,
    },
    textContainer: {
        position: 'absolute',
        bottom: isIOS() ? WP('15') : WP('10'),
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: WP('98'),
        alignSelf: "center"
    },
    titleTextStyle: {
        lineHeight: 40,
        color: PFColors.Standard.White,
        fontSize: PFFontSize.FONT_SIZE_24,
        fontFamily: PFFonts.Foundation.SemiBold,
    },
    infoTextStyle: {
        lineHeight: 24,
        marginVertical: WP('3'),
        color: PFColors.Standard.White,
        fontSize: PFFontSize.FONT_SIZE_16,
        fontFamily: PFFonts.Foundation.Regular,
    },
    dummyContainer: {
        height: 50
    },
    loginBtn: {
        backgroundColor: PFColors.Orange.Dark
    }


});
export default styles;
