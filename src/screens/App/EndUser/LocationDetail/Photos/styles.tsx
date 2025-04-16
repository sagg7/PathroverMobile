import { StyleSheet } from "react-native";
import { PFColors, PFFonts, PFFontSize, scale } from "../../../../../shared/exporter";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(4),
    },
    headerText: {
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_14,
    },
    buttonStyle: {
        paddingHorizontal: scale(8),
        paddingVertical: scale(6),
        borderWidth: 1,
        borderColor: PFColors.Gray.DarkGray,
        borderRadius: 100,
    },
    buttonText: {
         color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_14,
    },
    imageStyle: {
        height: 240,
        width: 195,
        borderRadius: 14.75,
        backgroundColor: PFColors.Gray.LightMist,
    },
    columnWrapperStyle: {
        justifyContent: 'space-between',
        marginVertical: scale(6),
    },
    contentContainerStyle: {
        paddingBottom: scale(50),
    }
});

export default styles;