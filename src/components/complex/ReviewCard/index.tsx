import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { PFColors, PFFontSize, PFFonts, WP, appIcons } from '../../../shared/exporter'
import { RatingStars } from '../RatingStars'

const ReviewCard = () => {
    return (
        <View style={styles.container}>
            <View style={styles.rowStyles}>
                <Image source={appIcons.userPlaceholder} style={styles.userProfile} />
                <Text style={styles.userName} numberOfLines={1}>Alex Hales</Text>
            </View>
            <View style={styles.starRowStyles}>
                <RatingStars rating={2} />
                <Text style={[styles.userName, styles.dateColor]} numberOfLines={1}>1 Day (s) ago </Text>
            </View>
            <Text style={styles.reviewText} >This boy is a perfect driver to go.</Text>
        </View>
    )
}

export default ReviewCard

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: PFColors.Blue.Dark,
        padding: 10,
        borderRadius: 15,
        width: WP('75'),
        marginRight: 10,
        marginVertical: 5
    },
    userProfile: {
        height: WP('10'),
        width: WP('10'),
        borderRadius: WP('20') / 2
    },
    rowStyles: {
        flexDirection: "row",
        alignItems: "center"
    },
    userName: {
        fontFamily: PFFonts.Foundation.Regular,
        fontSize: PFFontSize.FONT_SIZE_12,
        color: PFColors.Standard.Black,
        paddingLeft: WP('3')
    },
    starRowStyles: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 15
    },
    reviewText: {
        fontFamily: PFFonts.Foundation.Regular,
        fontSize: PFFontSize.FONT_SIZE_12,
        color: PFColors.Standard.Black,
        paddingVertical: WP("3")
    },
    dateColor: {
        color: "#7a7a7a"
    }
})