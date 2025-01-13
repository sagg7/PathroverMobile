import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  PFColors,
  PFFontSize,
  PFFonts,
  WP,
  formatDate,
} from '../../../shared/exporter';
import {FromAndToCard} from '../FromAndToCard';
import {RideOfferDscription} from '../RideOfferDscription';
import {AppButton} from '../AppButton';
import {svgIcon} from '../../../assets/svg';
import StarRatingContainer from '../StarRatingContainer';

interface RideOfferHistoryCardProps {
  onPressDel?: () => void;
  onPressAccept?: () => void;
  item?: any;
  onPressCard?: () => void;
  index: number;
}

const RideOfferHistoryCard = ({
  onPressAccept,
  onPressDel,
  item,
  onPressCard,
  index,
}: RideOfferHistoryCardProps) => {
  return (
    <TouchableOpacity
      style={styles.mainContainer}
      activeOpacity={0.7}
      onPress={onPressCard}>
      <View style={styles.blueHeader} key={index}>
        <Text style={styles.dateText}>Date: {formatDate(item.order_date)}</Text>
        <View style={styles.delIconConntainer}>
          <View style={styles.codeView}>
            <Text style={styles.rideCodeText} numberOfLines={1}>
              {item?.order_number}
            </Text>
          </View>
          <TouchableOpacity onPress={onPressDel}>
            {svgIcon.Delete}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.innerContainer}>
        <FromAndToCard
          pickup={item.pickup_location?.name}
          dropOff={item.dropoff_location?.name}
        />
        <View style={styles.heightContainer} />
        <RideOfferDscription items={item.description} />
        <View style={styles.horizontalBar} />
        <StarRatingContainer
          rating={item?.review_and_feedback?.rating}
          reviewText={item?.feedback || 'Inprogress'}
        />

        {/* <View style={styles.butonContainer}>
          <AppButton
            title={`$ ${item?.total_amount || 0}`}
            buttonStyle={styles.btnStyles}
            handleClick={onPressAccept}
            textStyle={styles.amountBtn}
          />
        </View> */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceStyle}>$ {item?.total_amount || 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const RideHistoryCard = memo(RideOfferHistoryCard);

export {RideHistoryCard};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: PFColors.Gray.WhisperGray,
    borderRadius: 20,
    margin: WP('5'),
  },
  blueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  dateText: {
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_12,
  },
  innerContainer: {
    padding: 10,
  },
  horizontalBar: {
    backgroundColor: PFColors.Gray.FadedGray,
    height: 1,
    marginVertical: 15,
  },
  butonContainer: {
    marginVertical: WP('3'),
  },
  btnStyles: {
    width: WP('23'),
    height: 40,
  },
  delIconConntainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideCodeText: {
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_10,
    padding: 5,
    maxWidth: WP('70'),
  },
  codeView: {
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: PFColors.Standard.White,
  },
  amountBtn: {
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.White,
  },
  heightContainer: {
    height: 15,
  },
  priceContainer: {
    backgroundColor: PFColors.Gray.borderGray,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  priceStyle: {
    color: PFColors.Blue.Dark,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
});
