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
        width: scrWidth,
        position: 'absolute',
        paddingHorizontal: WP('5'),
        bottom: isIOS() ? WP('15') : WP('10'),
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
    }


});
export default styles;
