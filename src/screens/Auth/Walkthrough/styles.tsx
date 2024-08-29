import { StyleSheet } from 'react-native';
import { PFColors, PFFontSize, PFFonts, WP, isIOS, scrHeight, scrWidth } from '../../../shared/exporter';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageStyles: {
        flex: 1,
        width: scrWidth,
    },
    textContainer: {
        width: scrWidth,
        position: 'absolute',
        paddingHorizontal: WP('5'),
        bottom: isIOS() ? WP('25') : WP('20'),
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
    skipContainer: {
        top: WP('2'),
        marginLeft: WP('1'),
        borderRadius: WP('5'),
        paddingVertical: WP('1.5'),
        paddingHorizontal: WP('3'),
        backgroundColor: PFColors.Standard.BackdropLightColor,

    },
    skipTextStyle: {
        color: PFColors.Orange.Dark,
        bottom: isIOS() ? 0 : 1.5,
        fontSize: PFFontSize.FONT_SIZE_16,
        fontFamily: PFFonts.Foundation.Medium,
    },
    activeDotStyle: {
        width: WP('2'),
        height: WP('2'),
        backgroundColor: PFColors.Standard.White,
    },
    inActiveDotStyle: {
        width: WP('2'),
        height: WP('2'),
        backgroundColor: PFColors.Standard.BackdropLightColor,
    },
    nextContainer: {
        // bottom: WP('2'),
        marginRight: WP('1'),
        backgroundColor: PFColors.Orange.Dark,
        height: WP('10'),
        width: WP('10'),
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: PFColors.Standard.White,
        borderRadius: 10

    },
});
export default styles;
