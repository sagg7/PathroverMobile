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
import useLocation from '../../../hooks/getLocation';

const LocationMessage = ({content, isLeft, showTime, created_at}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {location} = useLocation();

  const {startingPoint, endingPoint} =
    JSON.parse(content)?.messageContainsLocation;

  const handleClick = () => {
    if (startingPoint?.length > 0) {
      dispatch(
        setStartingPoint([
          parseFloat(startingPoint[0]),
          parseFloat(startingPoint[1]),
        ]),
      );
    } else {
      if (location?.longitude && location?.latitude) {
        dispatch(setStartingPoint([location.longitude, location.latitude]));
      }
    }

    if (endingPoint?.length > 0) {
      dispatch(
        setEndingPoint([
          parseFloat(endingPoint[0]),
          parseFloat(endingPoint[1]),
        ]),
      );
    }

    navigation.navigate(Routes.SearchTrailLatLng);
  };

  return (
    <View style={{...styles.main, marginLeft: 10}}>
      <TouchableOpacity
        style={[
          styles.bubbleContainer,
          isLeft ? styles.leftBubble : styles.rightBubble,
        ]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleClick}
          style={[
            styles.locContainer,
            {flexDirection: isLeft ? 'row-reverse' : 'row'},
          ]}>
          <View
            style={[
              styles.locButtonLeft,
              {
                backgroundColor: isLeft
                  ? PFColors.Orange.Soft
                  : PFColors.Blue.SoftGlacier,
              },
            ]}>
            <Svg
              width={20}
              height={20}
              stroke={isLeft ? PFColors.Orange.Dark : PFColors.Blue.Dark}
            />
          </View>
          <Text
            style={{
              ...styles.locText,
              color: isLeft ? PFColors.Orange.Dark : PFColors.Blue.Dark,
            }}>
            {'Shared location'}
          </Text>
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
  locButtonLeft: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleContainer: {
    width: '60%',
    marginVertical: 1,
    padding: 9,
    borderRadius: 8,
    marginLeft: 10,
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
    textAlign: 'center',
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Medium,
  },
  time: {
    fontSize: PFFontSize.FONT_SIZE_8,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Medium,
    marginBottom: 3,
    marginHorizontal: 10,
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
