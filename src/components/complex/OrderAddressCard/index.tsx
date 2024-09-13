import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { PFColors, PFFontSize, PFFonts, WP, appIcons } from '../../../shared/exporter'

const OrderAddressCard = () => {
    return (
        <View style={styles.cardView}>
            <View style={styles.innerContainer}>
                <View style={{ flexDirection: "row" }}>
                    <Image source={appIcons.letterCircle} style={styles.pointIcon} />
                    <View style={styles.bubleTextView}>
                        <Text style={styles.bubleText}>Pick-up point </Text>
                    </View>
                </View>

                <TouchableOpacity>
                    <View style={{ alignItems: "center" }}>
                        <Image source={appIcons.navigation} style={styles.navigationIcon} />
                        <Text style={styles.navigationText}>Navigation</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <Text style={styles.locationName} numberOfLines={2}>Street 5, Block R2 Block R 2 Phase 2 Johar Town, Lahore,
                Punjab 54000 </Text>

        </View>
    )
}

export { OrderAddressCard }

const styles = StyleSheet.create({
    cardView: {
        backgroundColor: PFColors.Standard.White,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        padding: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15

    },
    innerContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    pointIcon: {
        height: WP('9'),
        width: WP('9')
    },
    bubleTextView: {
        backgroundColor: PFColors.Gray.CloudWhite,
        padding: 8,
        borderRadius: 20,
        marginLeft: 5,
        justifyContent: "center",
        marginBottom: 5
    },
    bubleText: {
        fontFamily: PFFonts.Foundation.Light,
        fontSize: PFFontSize.FONT_SIZE_12,
        color: PFColors.Standard.Black
    },
    locationName: {
        fontFamily: PFFonts.Foundation.Regular,
        fontSize: PFFontSize.FONT_SIZE_10,
        color: PFColors.Standard.Black,
        width: WP('80'),
        lineHeight: 20,
        paddingBottom: 10
    },
    navigationIcon: {
        height: WP('6'),
        width: WP('6'),
        marginTop: 5
    },
    navigationText: {
        fontFamily: PFFonts.Foundation.Light,
        fontSize: PFFontSize.FONT_SIZE_10,
        color: PFColors.Standard.Black
    }
})