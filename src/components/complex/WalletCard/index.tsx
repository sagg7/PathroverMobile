import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { PFColors, PFFontSize, PFFonts, WP, appIcons } from '../../../shared/exporter';
import { AppButton } from '../AppButton';

interface WalletCardProps {
    balance: string;
    handleClick: (dates: { startDate: string; endDate: string }) => void;
}

const WalletCard = ({ balance, handleClick }: WalletCardProps) => {
    return (
        <View style={styles.containr}>
            <View style={styles.innerContainer}>
                <View style={styles.balanceTextContainer}>
                    <Image source={appIcons.balanceIcon} style={styles.balanceIcon} resizeMode='contain' />
                    <Text style={styles.balanceText}>Balance</Text>
                </View>
                <AppButton handleClick={handleClick} title='Deposyt' buttonStyle={styles.deposytBtn} textStyle={styles.deposytBtnText} />

            </View>
            <Text style={styles.balanceDigits}>${balance}</Text>
        </View>
    )
}

export { WalletCard }

const styles = StyleSheet.create({
    containr: {
        borderWidth: 1,
        borderColor: PFColors.Blue.Dark,
        borderRadius: 15,
        padding: 15,
        backgroundColor: PFColors.Gray.WhisperGray,
        marginHorizontal: WP('5'),
        marginVertical: WP('5')
    },
    innerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    balanceIcon: {
        height: 35,
        width: 35
    },
    balanceTextContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    balanceText: {
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_16,
        color: PFColors.Standard.Black,
        paddingLeft: WP('3')
    },
    deposytBtn: {
        width: WP('30'),
        height: WP('10'),
    },
    deposytBtnText: {
        paddingBottom: 5
    },
    balanceDigits: {
        fontFamily: PFFonts.Foundation.SemiBold,
        fontSize: PFFontSize.FONT_SIZE_20,
        color: PFColors.Standard.Black,
        paddingVertical: WP("3"),
        paddingBottom: WP('8')
    }
})