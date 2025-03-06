import React, { useState } from 'react';
import {
  FlatList,
  Image,
  View
} from 'react-native';
import styles from './styles';
import { Text } from 'react-native';
import { RatingStars } from '../../../../../components';
import { appImages } from '../../../../../assets/images';

const Reviews = () => {
  const [rate, setRate] = useState(0);

  const renderItem = ({ item }) => {
    const widthPercentage = (item / 100) * 100;

    return (
      <View style={styles.lineContainer}>
        <View style={[styles.lineStyle, { width: `${widthPercentage}%` }]} />
      </View>
    );
  }

  const renderItemImage = () => {
    return (
      <Image
        source={appImages.sittingView}
        style={styles.imageStyle}
      />
    )
  }

  const renderRatingCard = ({ item }) => {
    return (
      <View style={styles.rateCardContainer}>
        <View style={styles.cardHeader}>
          <View style={styles.rightView}>
            <Image source={appImages.userPlaceholder} style={styles.userImageStyle} />
            <Text style={styles.nameText}>Darrell Steward</Text>
          </View>
          <View style={styles.leftView}>
            <Text style={styles.timeText}>1 month ago</Text>
            <RatingStars rating={4} ratingStarStyles={styles.smallStarsStyle} />
          </View>
        </View>
        <Text style={styles.detailsText}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</Text>
        <View>
          <FlatList
            data={[1, 2]}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item + index.toString()
            }
            renderItem={renderItemImage}
            columnWrapperStyle={styles.columnWrapperStyle}
            style={styles.contentContainerStyle}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer} >
        <View style={styles.ratingLeftView}>
          <Text style={styles.ratingText}>4.3</Text>
          <RatingStars rating={4} ratingStarStyles={styles.ratingStarStyles} />
          <Text style={styles.ratingCountText}>(414)</Text>
        </View>
        <View style={styles.ratingRightView}>
          <FlatList
            data={[40, 50, 30, 60, 10]}
            keyExtractor={(item, index) => item + index.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </View>
      </View>
      <View style={styles.rateView}>
        <Text style={styles.rateHeaderText}>Rate & Review</Text>
        <View style={styles.rateSubView}>
          <Image source={appImages.userPlaceholder} style={styles.userImageStyle} />
          <RatingStars rating={rate} ratingStarStyles={styles.rateStarStyles} disabled={false} onRatingChange={val => setRate(val)} />
        </View>
      </View>
      <FlatList
        data={[1, 2, 3]}
        keyExtractor={(item, index) => item + index.toString()
        }
        renderItem={renderRatingCard}
      />
    </View>
  );
};

export default Reviews;
