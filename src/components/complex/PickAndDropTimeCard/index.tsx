import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { PFColors, PFFontSize, PFFonts, WP, appIcons } from '../../../shared/exporter'

const PickAndDropTimeCard = ({ type }) => {
    return (
        <View style={styles.cardContainer}>
            <Image source={appIcons.clock} style={styles.clockIcon(type)} />
            <Text style={styles.textStyles}>
                {type === "pickup" ? "Pickup Time" : "Estimated Delivery Time"}: <Text style={styles.timeStyles}>8 mins, 3 miles</Text>
            </Text>
        </View>
    )
}

export { PickAndDropTimeCard }

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: PFColors.Standard.White,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    clockIcon: color => ({
        tintColor: color === 'delivery' ? PFColors.Green.LeafGreen : PFColors.Standard.Red,
        height: WP('5'),
        width: WP('5'),
    }),
    textStyles: {
        fontFamily: PFFonts.Foundation.SemiBold,
        color: PFColors.Standard.Black,
        fontSize: PFFontSize.FONT_SIZE_12,
        paddingLeft: 10,
    },
    timeStyles: {
        fontFamily: PFFonts.Foundation.Regular,
        color: PFColors.Standard.Black,
        fontSize: PFFontSize.FONT_SIZE_12,
        paddingLeft: 5,
    },
})
