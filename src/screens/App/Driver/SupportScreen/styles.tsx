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
        flexGrow: .96,
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
    inputStyle: {
        height: WP('40'),
        color: PFColors.Standard.Black,
        fontSize: PFFontSize.FONT_SIZE_16,
        fontFamily: PFFonts.Foundation.Regular,
        backgroundColor: PFColors.Gray.WhisperGray,
        borderRadius: 10,
        marginTop: 20,
        padding: 20,
        textAlignVertical: "top"
    },
});
export default styles;
