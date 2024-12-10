import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppHeader, MainWrapper} from '../../../../../components';
import {scale} from '../../../../../shared/theme/responsive';
import {PFColors, PFFonts} from '../../../../../shared/exporter';
import {svgIcon} from '../../../../../assets/svg';
import OfferCard from './OfferCard';

const VehiclesOffer = () => {
  return (
    <MainWrapper>
      <AppHeader title="Request Vehicle" leftIcon={false} />
      <View style={styles.bodyConntainer}>
        <View style={styles.expireCard}>
          <View style={styles.expireTimeView}>
            {svgIcon.ClockRed}
            <Text style={styles.expireTimeText}>Expires in: 04:53</Text>
          </View>
          <Text style={styles.expireMessageText}>
            Your request has been been sent, You will receive offers shortly
          </Text>
          <Pressable style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3]}
          renderItem={({item}) => <OfferCard style={styles.OfferCard} />}
        />
      </View>
    </MainWrapper>
  );
};

export default VehiclesOffer;

const styles = StyleSheet.create({
  bodyConntainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingVertical: scale(24),
  },
  expireCard: {
    backgroundColor: PFColors.Blue.lightBlue,
    padding: scale(16),
    borderRadius: scale(12),
    alignItems: 'center',
    marginBottom: scale(16),
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
  OfferCard: {
    marginBottom: scale(12),
  },
});
