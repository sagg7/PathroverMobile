import { StyleSheet } from "react-native";
import { PFColors, PFFontSize, PFFonts, WP } from "../../../../shared/exporter";

const styles = StyleSheet.create({
    listConatainer: {
        backgroundColor: PFColors.Gray.WhisperGray,
        flexDirection: "row",
        justifyContent: "space-between",
        width: WP('94'),
        padding: 10,
        borderRadius: 10,
        alignSelf: "center",
        paddingVertical: 15
    },
    setingOptionIcon: {
        height: WP('7'),
        width: WP('7')
    },
    listOptionText: {
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,
        paddingLeft: WP('3')
    }

})
export default styles