import { StyleSheet } from 'react-native';
import { PFColors, PFFontSize, PFFonts, WP } from '../../../../shared/exporter';

const styles = StyleSheet.create({
    height: {
        height: 40
    },
    buttonStyle: {
        width: WP('90'),
        alignSelf: "center",
        marginTop: WP('90'),
    },
    rowStyles: {
        backgroundColor: PFColors.Gray.WhisperGray,
        flexDirection: "row",
        marginHorizontal: WP('7'),
        padding: 10,
        borderRadius: 10,
        marginVertical: WP('3'),
        justifyContent: "space-between",
        alignItems: "center"
    },
    fileIcon: {
        height: WP('10'),
        width: WP('10'),
        borderRadius: WP('10') / 2,
    },
    filename: {
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,
        width: WP("60"),
    }
});
export default styles;
