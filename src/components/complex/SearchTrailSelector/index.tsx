import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  appIcons,
  INVALID_COORDINATE_ERROR,
  PFColors,
  PFFonts,
  PFFontSize,
  Routes,
  scale,
  showAlert,
  verticalScale,
  WP,
} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';
import {AppInput, AppButton} from '../..';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setManagerRoute} from '../../../redux/manager/managerSlice';

interface SelectionBoxProps {
  isSelected: boolean;
  onPress: () => void;
  title: string;
}

interface LocationBoxProps {
  title: string;
  showArrow?: boolean;
  onPress?: () => void;
}
const locationInitial = {
  pickupLatitude: '',
  pickupLongitude: '',
  dropoffLatitude: '',
  dropoffLongitude: '',
};
const SearchTrailSelector = () => {
  const {endingPoint, startingPoint} = useSelector(
    (state: any) => state?.endUser?.trailRoute,
  );
  const navigation = useNavigation<any>();
  const LocationBox = ({
    title,
    showArrow = false,
    onPress,
  }: LocationBoxProps) => (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <View style={styles.locationBox}>
        <Text style={styles.locationBoxText}>{title}</Text>
        {showArrow && svgIcon.LeftArrow}
      </View>
    </TouchableOpacity>
  );

  const onPressAddressPickup = (isStartPoint: boolean) => {
    navigation.navigate(Routes.SetTrailStartpoint, {isStartPoint});
  };

  return (
    <View>
      <View style={styles.locationBoxContainer}>
        <View style={styles.locationBoxSideContainer}>
          <View style={styles.blueDotStyles} />
          <View style={styles.verticalDashLine} />
          <Image source={appIcons.redMarker} style={styles.redMarkerStyles} />
        </View>
        <View style={{flex: 1}}>
          <LocationBox
            title={
              startingPoint?.length
                ? startingPoint.join(', ')
                : 'Starting Point'
            }
            onPress={() => onPressAddressPickup(true)}
          />
          <LocationBox
            title={
              endingPoint?.length ? endingPoint.join(', ') : 'Ending Point'
            }
            onPress={() => onPressAddressPickup(false)}
          />
        </View>
      </View>
    </View>
  );
};
export default SearchTrailSelector;

const styles = StyleSheet.create({
  selectorMainView: {
    backgroundColor: PFColors.Gray.LightMist,
    height: scale(48),
    width: WP('82'),
    alignSelf: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  locationBox: {
    borderWidth: 1,
    width: WP('82'),
    padding: WP('5'),
    alignSelf: 'center',
    borderColor: PFColors.Gray.borderGray,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationBoxText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Standard.Black,
  },
  locationBoxSideContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  locationBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: WP('2.5'),
  },
  redMarkerStyles: {
    height: scale(16),
    width: scale(16),
  },
  verticalDashLine: {
    borderWidth: 1,
    width: 1,
    height: scale(55),
    borderStyle: 'dashed',
    borderColor: PFColors.Gray.borderGray,
  },
  blueDotStyles: {
    backgroundColor: PFColors.Blue.Dark,
    height: scale(11),
    width: scale(11),
    borderRadius: 20,
    borderWidth: 3,
    borderColor: PFColors.Gray.borderGray,
    marginBottom: 4,
  },
  inputContainerStyle: {
    width: WP('82'),
  },
  btnContainer: {
    alignSelf: 'center',
    width: WP('82'),
    marginVertical: verticalScale(12),
  },
  selectedLocationBox: {
    backgroundColor: PFColors.Gray.WhisperGray,
    width: WP('82'),
    alignSelf: 'center',
    borderRadius: 10,
    padding: 5,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickupText: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingVertical: scale(5),
  },
  latlngText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Gray.DarkGray,
  },
  clearTextStyle: {
    color: PFColors.Orange.Dark,
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: scale(14),
    textDecorationLine: 'underline',
  },
  orangeArrowStyles: {
    height: scale(12),
    width: scale(12),
    // transform: [{rotate: '270deg'}],
  },
});
