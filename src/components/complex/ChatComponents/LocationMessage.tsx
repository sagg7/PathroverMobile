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
  setSelectedTrail,
  setStartingPoint,
} from '../../../redux/endUser/endUserSlice';
import {useNavigation} from '@react-navigation/native';
import useLocation from '../../../hooks/getLocation';

const LocationMessage = ({content, isLeft, showTime, created_at}) => {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const {location} = useLocation();

  const {startingPoint, endingPoint, type, data, hiking_trail, trailData} =
    JSON.parse(content)?.messageContainsLocation;

  const handleClick = () => {
    if (type === 'Chosen Trail') {
      if (isIOS()) {
        dispatch(setSelectedTrail(data));
        navigation.navigate(Routes.TurnByTurnNav, {
          originCoords: [location.longitude, location.latitude],
          entranceCoords: startingPoint,
          entranceName: data?.properties?.tags?.name || 'UNKNOWN TRIAL',
        });
      } else {
        navigation.navigate(Routes.TurnByTurnNavAndroid, {
          originCoords: [location.longitude, location.latitude],
          entranceCoords: startingPoint,
          entranceName: data?.properties?.tags?.name || 'UNKNOWN TRIAL',
        });
      }
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
        if (isIOS()) {
          navigation.navigate(Routes.TurnByTurnNav, {
            originCoords: [location.longitude, location.latitude],
            entranceCoords: formatedData?.endingPoint,
            entranceName: 'Destination',
          });
        } else {
          navigation.navigate(Routes.TurnByTurnNavAndroid, {
            originCoords: [location.longitude, location.latitude],
            entranceCoords: formatedData?.endingPoint,
            entranceName: 'Destination',
          });
        }
      } else if (
        formatedData?.route_type === 'hiking_trail_route' ||
        type === 'trail' ||
        type === 'hiking_trail_route'
      ) {
        if (isIOS()) {
          dispatch(setSelectedTrail(trailData));
          setTimeout(() => {
            navigation.navigate(Routes.TurnByTurnNav, {
              originCoords: [location?.longitude, location?.latitude],
              entranceCoords: trailData?.geometry?.coordinates[0],
              entranceName: 'Unknown Trail',
              isTrail: true,
            });
          }, 300);
        } else {
          setTimeout(() => {
            navigation.navigate(Routes.TurnByTurnNavAndroid, {
              originCoords: [location?.longitude, location?.latitude],
              entranceCoords: trailData?.geometry?.coordinates[0],
              entranceName: 'Unknown Trail',
              isTrail: true,
            });
          }, 300);
        }
      } else {
        if (isIOS()) {
          setTimeout(() => {
            const coords = formatedData?.pickup_location;

            const lngLat = [
              Number(coords?.longitude),
              Number(coords?.latitude),
            ];
            navigation.navigate(Routes.TurnByTurnNav, {
              originCoords: [location?.longitude, location?.latitude],
              entranceCoords: lngLat,
              entranceName: formatedData?.name,
              isTrail: false,
              routeInfo: formatedData,
              isLibrary: true,
            });
          }, 300);
        } else {
          setTimeout(() => {
            const coords = formatedData?.pickup_location;

            const lngLat = [
              Number(coords?.longitude),
              Number(coords?.latitude),
            ];
            navigation.navigate(Routes.TurnByTurnNavAndroid, {
              originCoords: [location?.longitude, location?.latitude],
              entranceCoords: lngLat,
              entranceName: formatedData?.name,
              isTrail: false,
              routeInfo: formatedData,
              isLibrary: true,
            });
          }, 300);
        }
      }
    }
    22;
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
