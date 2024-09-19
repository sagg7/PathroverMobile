import { StyleSheet } from "react-native";
import { PFColors, PFFontSize, PFFonts, WP } from "../../../../shared/exporter";

const styles = StyleSheet.create({
    listConatainer: {
        backgroundColor: PFColors.Gray.WhisperGray,
        flexDirection: "row",
        justifyContent: "space-between",
        width: WP('92'),
        padding: 10,
        borderRadius: 10,
        alignSelf: "center",
        paddingVertical: 15,
        alignItems: "center",
        marginVertical: 5
    },
    setingOptionIcon: {
        height: WP('5'),
        width: WP('5')
    },
    listOptionText: {
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.Black,
        paddingLeft: WP('3')
    },
    iconContainer: {
        backgroundColor: PFColors.Blue.SoftGlacier,
        borderRadius: 9,
        height: WP('7.5'),
        width: WP('7.5'),
        alignItems: "center",
        justifyContent: "center"

    },
    innerContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    userProfileContainer: {
        backgroundColor: PFColors.Blue.SoftGlacier,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: WP('5'),
        paddingVertical: WP('4'),
        marginVertical: WP('3')
    },
    userPicture: {
        height: WP('14'),
        width: WP('14'),
        borderRadius: WP('14') / 2,
    },
    userProfileInner: {
        paddingLeft: WP('4')
    },
    profileTextStyles: {
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_16,
        color: PFColors.Standard.Black
    },
    contentContainerStyle: {
        paddingBottom: WP("10")
    }

})
export default styles