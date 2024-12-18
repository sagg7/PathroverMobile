import { StyleSheet } from 'react-native';
import { PFColors, PFFontSize, PFFonts, WP } from '../../../../shared/exporter';

const styles = StyleSheet.create({
    height: {
        height: 40,
    },
    buttonStyle: {
        width: WP('95'),
        alignSelf: 'center',
        marginTop: WP('60'),
    },
    walletTransactionCard: {
        backgroundColor: PFColors.Standard.White,
        margin: WP('5'),
        padding: 10,
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginBottom: 5
    },
    transactionAmount: {
        backgroundColor: PFColors.Blue.Dark,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        padding: 10,
        paddingHorizontal: 12
    },
    transactionAmounttext: {
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Standard.White,
        fontFamily: PFFonts.Foundation.Medium
    },
    nameTime: {
        fontSize: PFFontSize.FONT_SIZE_12,
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.Regular,
    },
    headerText: {
        fontSize: PFFontSize.FONT_SIZE_16,
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.SemiBold,
        paddingLeft: WP('5'),
        paddingTop: WP('3')
    },
    selectorBtn: {
        width: WP('20')
    }

});
export default styles;
