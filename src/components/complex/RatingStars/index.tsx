import { Image, StyleSheet, View } from 'react-native'
import React from 'react'
import { appIcons } from '../../../assets/icons';
import { WP } from '../../../shared/exporter';

interface RatingStarsProps {
    rating: number
    ratingStarStyles?: any
}

const RatingStars = ({ ratingStarStyles, rating = 3 }: RatingStarsProps) => {
    return (
        <View style={styles.rowStyles}>
            {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                let image;
                if (starValue <= rating) {
                    image = appIcons.starFill;
                } else {
                    image = appIcons.starEmpty;
                }
                return (
                    <Image
                        key={index}
                        source={image}
                        style={[styles.ratingStar, ratingStarStyles]}
                        resizeMode="contain"
                    />
                );
            })}
        </View>
    )
}

export { RatingStars }

const styles = StyleSheet.create({
    ratingStar: {
        height: WP('3'),
        width: WP('3'),
        marginRight: 2,
        marginTop: 5
    },
    rowStyles: {
        flexDirection: "row"
    }
})