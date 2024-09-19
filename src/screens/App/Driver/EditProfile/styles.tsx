import { StyleSheet } from 'react-native';
import { PFColors, PFFontSize, PFFonts, WP, scrHeight } from '../../../../shared/exporter';

const styles = StyleSheet.create({
    container: {
    },
    formikContainer: {
        marginHorizontal: WP('4'),
        marginTop: WP('4'),
    },
    divider: {
        flexGrow: .94,
        justifyContent: "flex-end",
    },
    btnContainer: isOpen => ({
        marginBottom: isOpen ? 300 : 40,

    }),
    scrollViewStyle: {
        flexGrow: 1,
    },
    heightStyle: {
        minHeight: scrHeight,
    },
    forgotText: {
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,
        paddingTop: 10
    }
});
export default styles;
