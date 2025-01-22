import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {appIcons} from '../../../assets/icons';
import {WP} from '../../../shared/exporter';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  disabled?: boolean;
  ratingStarStyles?: any;
  starContainerStyle?: any;
  onRatingChange?: (newRating: number) => void;
}

const RatingStars = ({
  rating = 0,
  maxStars = 5,
  onRatingChange,
  ratingStarStyles,
  starContainerStyle,
  disabled = true,
}: RatingStarsProps) => {
  const [initialRating, setRating] = useState(rating);

  const handleStarPress = (starValue: number): void => {
    setRating(starValue);
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <View style={[styles.rowStyles, starContainerStyle]}>
      {Array.from({length: maxStars}, (_, index) => {
        const starValue = index + 1;
        const starIcon =
          starValue <= initialRating ? appIcons.starFill : appIcons.starEmpty;

        return (
          <TouchableOpacity
            disabled={disabled}
            key={index}
            onPress={() => !disabled && handleStarPress(starValue)}>
            <Image
              source={starIcon}
              style={[styles.ratingStar, ratingStarStyles]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export {RatingStars};

const styles = StyleSheet.create({
  ratingStar: {
    height: WP('3'),
    width: WP('3'),
    marginRight: 2,
    marginTop: 5,
  },
  rowStyles: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    width: 30,
    height: 30,
    marginHorizontal: 2,
  },
});
