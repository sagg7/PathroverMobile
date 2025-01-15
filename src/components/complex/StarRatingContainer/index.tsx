import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {appIcons} from '../../../assets/icons';
import {PFColors, PFFonts, PFFontSize, scale} from '../../../shared/exporter';

interface StarRatingProp {
  rating: number;
  reviewText: string;
}

const StarRatingContainer = ({rating, reviewText}: StarRatingProp) => {
  const maxRating = 5;
  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        <Text style={styles.titleStyles}>Review & Feedback</Text>
        <View style={styles.starContainer}>
          {[...Array(maxRating)]?.map((_, index) => (
            <Image
              key={index}
              source={index < rating ? appIcons.starFill : appIcons.grayStar}
              style={styles.star}
            />
          ))}
        </View>
      </View>
      {reviewText && <Text style={styles.reviewText}>{reviewText}</Text>}
    </View>
  );
};

export default StarRatingContainer;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  starContainer: {
    flexDirection: 'row',
  },
  star: {
    height: scale(13),
    width: scale(13),
    marginHorizontal: 3,
  },
  titleStyles: {
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_12,
  },
  reviewText: {
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_10,
    paddingTop: scale(10),
    lineHeight: 15,
  },
});
