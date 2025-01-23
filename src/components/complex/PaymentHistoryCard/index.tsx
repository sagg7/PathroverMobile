import React, {memo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  PFColors,
  PFFontSize,
  PFFonts,
  WP,
  appIcons,
  formatDate,
} from '../../../shared/exporter';
import {FromAndToCard} from '../FromAndToCard';
import {RideOfferDscription} from '../RideOfferDscription';
import StarRatingContainer from '../StarRatingContainer';
import {PickAndDropTimeCard} from '../PickAndDropTimeCard';

interface PaymentHistoryCardProps {
  onPressAccept?: () => void;
  item?: any;
  onPressCard?: () => void;
  index: number;
}

const PaymentHistoryView = ({
  item,
  onPressCard,
  index,
}: PaymentHistoryCardProps) => {
  return (
    <TouchableOpacity
      style={styles.mainContainer}
      activeOpacity={0.7}
      onPress={onPressCard}>
      <View style={styles.blueHeader} key={index}>
        <Text style={styles.rideCodeText} numberOfLines={1}>
          Order ID: {item?.order_number || ''}
        </Text>
      </View>

      <View style={styles.priceStatusView}>
        <Text style={styles.amount} numberOfLines={1}>
          $ {item?.total_amount || ''}
        </Text>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Image source={appIcons.checked} style={styles.checked} />
            <Text style={styles.Completed} numberOfLines={1}>
              Completed
            </Text>
          </View>
          <View style={styles.row}>
            <Image
              source={appIcons.semitruck}
              style={styles.truckIcon}
              resizeMode="contain"
            />
            <Text style={styles.truckName}>{item?.vehicle_type}Semi Truck</Text>
          </View>
        </View>
      </View>
      <View style={styles.horizontalBars} />

      <View style={styles.innerContainer}>
        <FromAndToCard
          pickup={item.pickup_location?.name}
          dropOff={item.dropoff_location?.name}
        />
        <View style={styles.heightContainer} />
        <RideOfferDscription items={item.description} />
        <View style={styles.horizontalBar} />
        <PickAndDropTimeCard type={'pickup'} value={`333`} />
        <PickAndDropTimeCard
          type={'delivery'}
          value={item?.estimated_time || '3.4 KM'}
          isHistory
        />
        <View style={styles.horizontalBar} />
        <StarRatingContainer
          rating={item?.review_and_feedback?.rating}
          reviewText={item?.review_and_feedback?.feedback || ''}
        />
      </View>
    </TouchableOpacity>
  );
};

const PaymentHistoryCard = memo(PaymentHistoryView);

export {PaymentHistoryCard};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: PFColors.Gray.WhisperGray,
    borderRadius: 20,
    margin: WP('5'),
  },
  blueHeader: {
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: PFColors.Blue.SoftGlacier,
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
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Blue.Dark,
    fontSize: PFFontSize.FONT_SIZE_14,
    padding: 5,
    alignSelf: 'center',
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
  priceStatusView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: PFFontSize.FONT_SIZE_20,
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Orange.Dark,
    paddingLeft: WP('4'),
  },
  checked: {
    height: 16,
    width: 16,
  },
  Completed: {
    fontSize: PFFontSize.FONT_SIZE_12,
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  truckIcon: {
    height: WP('4'),
    width: WP('4'),
  },
  truckName: {
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_12,
    paddingLeft: WP('2'),
  },
  horizontalBars: {
    backgroundColor: PFColors.Gray.FadedGray,
    height: 1,
    marginVertical: 10,
    marginHorizontal: 10,
  },
});
