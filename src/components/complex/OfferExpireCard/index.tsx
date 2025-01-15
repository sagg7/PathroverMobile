import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFonts, scale} from '../../../shared/exporter';
interface OfferExpireCardType {
  time: any;
  onPressCancel?: () => void;
}

const OfferExpireCard = ({time, onPressCancel}: OfferExpireCardType) => {
  return (
    <View style={styles.expireCard}>
      <View style={styles.expireTimeView}>
        {svgIcon.ClockRed}
        <Text style={styles.expireTimeText}>Expires in: {time}</Text>
      </View>
      <Text style={styles.expireMessageText}>
        Your request has been been sent, You will receive offers shortly
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.cancelBtn}
        onPress={() => onPressCancel && onPressCancel()}>
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export {OfferExpireCard};

const styles = StyleSheet.create({
  expireCard: {
    backgroundColor: PFColors.Blue.lightBlue,
    padding: scale(16),
    borderRadius: scale(12),
    alignItems: 'center',
    marginBottom: scale(16),
    marginTop: scale(24),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  expireTimeView: {
    flexDirection: 'row',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    backgroundColor: PFColors.Standard.White,
    marginBottom: scale(18),
    alignItems: 'center',
  },
  expireTimeText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(10),
    color: PFColors.Standard.Black,
    marginLeft: scale(4),
  },
  expireMessageText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(14),
    color: PFColors.Standard.Black,
    lineHeight: scale(18),
    textAlign: 'center',
    marginBottom: scale(18),
  },
  cancelBtn: {
    height: scale(28),
    width: scale(118),
    borderRadius: scale(20),
    borderColor: PFColors.Blue.Dark,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(12),
    color: PFColors.Standard.Black,
    lineHeight: scale(16),
    textAlign: 'center',
  },
});
