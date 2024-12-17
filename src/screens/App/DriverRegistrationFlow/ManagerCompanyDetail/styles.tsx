import { StyleSheet } from 'react-native';
import { PFColors, PFFontSize, PFFonts, WP } from '../../../../shared/exporter';

const styles = StyleSheet.create({
    height: {
        height: 40
    },
    buttonStyle: {
        width: WP('90'),
        alignSelf: "center",
        marginTop: WP('10'),
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
    },
    companyCard: {
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,
        textAlign: "center",
        paddingVertical: WP('2')
    },
    detailBox: {
        backgroundColor: PFColors.Gray.WhisperGray,
        width: WP('88'),
        alignSelf: "center",
        borderRadius: 10,
        marginVertical: WP('3')
    },
    companyDetailText: {
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,
        paddingVertical: WP('2'),
        paddingHorizontal: WP('3'),
        paddingTop: 15

    },
    textInput: {
        height: WP('35'),
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Gray.DarkGray,
        textAlignVertical: "top",
        paddingHorizontal: WP('4')
    },
    normalInput: {
        width: WP('90')
    },
    companyTypeContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: PFColors.Gray.WhisperGray,
        marginHorizontal: WP('4'),
        padding: 20,
        borderRadius: 10,
        marginVertical: WP('3'),
    },
    title: {
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,
        width: WP("63"),
    },
    clearView: {
        width: WP('15'),
    },
    inputContainer: {
        width: '90%',
        height: WP('14'),
        alignItems: 'center',
        borderRadius: WP('2'),
        flexDirection: 'row',
        marginTop: WP('4'),
        paddingHorizontal: WP('4'),
        justifyContent: 'space-between',
        backgroundColor: PFColors.Gray.WhisperGray,
        alignSelf: "center"
    },
    input: {
        height: WP('12'),
        color: PFColors.Standard.Black,
        width: '100%',
        fontSize: PFFontSize.FONT_SIZE_16,
        fontFamily: PFFonts.Foundation.Regular,
    }

});
export default styles;
