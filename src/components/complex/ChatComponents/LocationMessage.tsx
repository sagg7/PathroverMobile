import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  isIOS,
  PFColors,
  PFFonts,
  PFFontSize,
  Routes,
} from '../../../shared/exporter';
import Svg from '../../../assets/svg/blueMarker.svg';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {
  resetTrailRoute,
  setEndingPoint,
  setRouteData,
  setRouteType,
  setStartingPoint,
} from '../../../redux/endUser/endUserSlice';
import {useNavigation} from '@react-navigation/native';
import useLocation from '../../../hooks/getLocation';

const LocationMessage = ({content, isLeft, showTime, created_at}) => {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const {location} = useLocation();

  const {startingPoint, endingPoint, type, data} =
    JSON.parse(content)?.messageContainsLocation;

  const handleClick = () => {
    if (type === 'Chosen Trail') {
      navigation.navigate(Routes.TrailDetails, {trailInfo: data});
    } else {
      dispatch(resetTrailRoute());
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

      dispatch(setRouteType(type));

      if (data) {
        dispatch(setRouteData(data));
      }
      const formatedData = JSON.parse(content)?.messageContainsLocation;
      if (
        formatedData?.route_type === 'waypoint_route' ||
        formatedData?.route_type === 'hiking_waypoint' ||
        formatedData?.route_type === 'maps_location_pins' ||
        formatedData?.type === 'entrance route' ||
        formatedData?.type === 'Well route' ||
        formatedData?.type === 'Well entrance route' ||
        formatedData?.type === 'Pin Point' ||
        formatedData?.type === 'Way point'
      ) {
        // navigation.navigate(Routes.ViewWellPathNavigation, {
        //   entranceCoords: formatedData?.endingPoint,
        //   entranceName: formatedData?.name,
        // });

        if (isIOS()) {
          navigation.navigate(Routes.TurnByTurnNav, {
            originCoords: [location.longitude, location.laatitude],
            entranceCoords: formatedData?.endingPoint,
            entranceName: formatedData?.name,
          });
        } else {
          navigation.navigate(Routes.ViewWellPathNavigation, {
            entranceCoords: formatedData?.endingPoint,
            entranceName: formatedData?.name,
          });
        }
      } else if (
        formatedData?.route_type === 'hiking_trail_route' ||
        type === 'trail'
      ) {
        navigation.navigate(Routes.SearchTrailLatLng);
      } else {
        navigation.navigate(Routes.ViewSaveRoutes, {
          item: formatedData,
        });
      }
    }
  };

  return (
    <View style={{...styles.main, marginLeft: -10}}>
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
              textAlign: isLeft ? 'right' : 'left',
            }}>
            {`Shared ${type ? type : 'location'}`}
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
    width: '75%',
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Medium,
    textTransform: 'capitalize',
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
