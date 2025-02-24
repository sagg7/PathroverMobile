import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {PFColors, PFFonts, PFFontSize, Routes} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';
import Svg from '../../../assets/svg/blueMarker.svg';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {
  setEndingPoint,
  setStartingPoint,
} from '../../../redux/endUser/endUserSlice';
import {useNavigation} from '@react-navigation/native';

const LocationMessage = ({content, isLeft, showTime, created_at}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {startingPoint, endingPoint} =
    JSON.parse(content)?.messageContainsLocation;

  const hanldeClick = () => {
    dispatch(
      setStartingPoint([
        parseFloat(startingPoint?.[0]),
        parseFloat(startingPoint?.[1]),
      ]),
    );
    dispatch(
      setEndingPoint([
        parseFloat(endingPoint?.[0]),
        parseFloat(endingPoint?.[1]),
      ]),
    );
    navigation.navigate(Routes.SearchTrailLatLng);
  };

  return (
    <View style={styles.main}>
      <TouchableOpacity
        style={[
          styles.bubbleContainer,
          isLeft ? styles.leftBubble : styles.rightBubble,
        ]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={hanldeClick}
          style={styles.locContainer}>
          <Svg width={23} height={23} />
          <Text style={styles.locText}>{'Shared location'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      {showTime && (
        <Text
          style={[styles.time, isLeft ? styles.leftTime : styles.rightTime]}>
          {moment(created_at).format('hh:mm A')}
        </Text>
      )}
    </View>
  );
};

export default LocationMessage;

const styles = StyleSheet.create({
  main: {
    width: '100%',
  },
  bubbleContainer: {
    width: '60%',
    marginVertical: 1,
    padding: 9,
    borderRadius: 8,
  },
  leftBubble: {
    alignSelf: 'flex-start',
    backgroundColor: PFColors.Orange.Soft,
  },
  rightBubble: {
    alignSelf: 'flex-end',
    backgroundColor: PFColors.Blue.Dark,
  },
  locContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 10,
    backgroundColor: PFColors.Standard.White,
    borderRadius: 15,
    width: '100%',
    justifyContent: 'space-between',
  },
  locText: {
    width: '80%',
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Blue.Dark,
    fontFamily: PFFonts.Foundation.Medium,
  },
  time: {
    fontSize: PFFontSize.FONT_SIZE_8,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Medium,
    marginBottom: 3,
    marginHorizontal: 2,
  },
  leftTime: {
    fontSize: PFFontSize.FONT_SIZE_8,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Medium,
  },
  rightTime: {
    fontSize: PFFontSize.FONT_SIZE_8,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Medium,
    alignSelf: 'flex-end',
  },
});
