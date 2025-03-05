import { StyleSheet } from "react-native";
import { PFColors, PFFonts, PFFontSize } from "../../../../../shared/exporter";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textStyle: {
         color: PFColors.Gray.DarkGray,
                fontFamily: PFFonts.Foundation.Regular,
                fontSize: PFFontSize.FONT_SIZE_12,
    }
});

export default styles;