import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {scale} from '../../../../../shared/theme/responsive';
import {appImages} from '../../../../../assets/images';
import {svgIcon} from '../../../../../assets/svg';
import {PFColors, PFFonts} from '../../../../../shared/exporter';

interface OfferCardProps {
  style: StyleProp<ViewStyle>;
}

const OfferCard = ({style}: OfferCardProps) => {
  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.cardInnerContainer}>
        <View style={styles.userView}>
          <Image source={appImages.continueAs} style={styles.userImage} />
          <View style={styles.userInfoView}>
            <Text style={styles.userName}>Smith</Text>
            <Text style={styles.vehicleType}>Semi Truck</Text>
            <View style={styles.ratingView}>
              {svgIcon.RatingStar}
              <Text style={styles.ratingFigure}>{`5.0(847)`}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceView}>
          <View style={styles.arriveTimeView}>
            {svgIcon.ClockRed}
            <Text style={styles.arriveTimeText}>Arrives in 3 mins</Text>
          </View>
          <Text style={styles.priceText}>$1500</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.declineBtn}>
          <Text style={styles.declineBtnText}>Decline</Text>
        </Pressable>
        <Pressable style={styles.acceptBtn}>
          <Text style={styles.acceptBtnText}>Accept</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default OfferCard;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: scale(12),
    padding: scale(16),
    backgroundColor: PFColors.Standard.White,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  cardInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userView: {
    flexDirection: 'row',
    flex: 1,
  },
  userImage: {
    height: scale(40),
    width: scale(40),
    resizeMode: 'cover',
    borderRadius: scale(20),
    marginRight: scale(11),
  },
  userInfoView: {},
  userName: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: scale(16),
    color: PFColors.Standard.Black,
    marginBottom: scale(6),
  },
  vehicleType: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: scale(14),
    color: PFColors.Gray.DarkGray,
  },
  ratingView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(14),
  },
  ratingFigure: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: scale(14),
    color: PFColors.Gray.DarkGray,
    marginLeft: scale(4),
  },
  priceView: {
    flex: 1,
    // backgroundColor: 'green',
    alignItems: 'flex-end',
    paddingTop: scale(10),
  },
  arriveTimeView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PFColors.Blue.lightBlue,
    borderRadius: scale(20),
    padding: scale(4),
    marginBottom: scale(16),
  },
  arriveTimeText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(12),
    color: PFColors.Standard.Black,
    marginLeft: scale(4),
  },
  priceText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: scale(20),
    color: PFColors.Orange.Dark,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:scale(20)
  },
  declineBtn: {
    height: scale(32),
    width: scale(144),
    borderRadius:scale(20),
    borderWidth:1,
    borderColor:PFColors.Blue.Dark,
    alignItems:'center',
    justifyContent:'center'
  },
  declineBtnText: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: scale(16),
    color: PFColors.Blue.Dark,
  },
  acceptBtn: {
    height: scale(32),
    width: scale(144),
    borderRadius:scale(20),
    backgroundColor:PFColors.Blue.Dark,
    alignItems:'center',
    justifyContent:'center'
  },
  acceptBtnText: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: scale(16),
    color: PFColors.Standard.White,
  },
});
