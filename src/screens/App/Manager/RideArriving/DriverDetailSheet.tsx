import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  appIcons,
  PFColors,
  PFFonts,
  PFFontSize,
  RIDE_STATUS,
  scale,
  WP,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import {AppButton} from '../../../../components';
import {getTimeAndDistance} from '../../../../shared/utils/helpers';
interface DriverDetailSheetProp {
  onPressCancelOrder: () => void;
  item: any;
  type: string;
  handleRideStatus?: any;
  myLocation: any;
}

const DriverDetailSheet = ({
  onPressCancelOrder,
  item,
  type,
  handleRideStatus,
  myLocation,
}: DriverDetailSheetProp) => {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (item) getResults();
  }, [item]);

  const getResults = async () => {
    const driverLocation = [
      Number(item?.driver_location_longitude),
      Number(item?.driver_location_latitude),
    ];
    const location = [myLocation?.longitude, myLocation?.latitude];

    const locResults = await getTimeAndDistance(location, driverLocation);

    setResult(locResults);
  };
  return (
    <View style={styles.modalContainer}>
      {/* {svgIcon.DragablePin} */}
      <Text style={styles.driverUpdateTiming}>
        {type === RIDE_STATUS.I_AM_HERE
          ? 'Driver Reached'
          : type === RIDE_STATUS.START_RIDE
          ? 'Driver is heading to destination'
          : `Your Driver is comming in ${
              result?.duration == '0 min' ? 'few moments' : result?.duration
            }`}
      </Text>
      <View style={styles.driverProfileContainer}>
        <View style={styles.row}>
          <Image
            source={
              item?.profile_image
                ? {uri: item?.profile_image}
                : appIcons.userPlaceholder
            }
            style={styles.driverProfile}
          />
          <View style={styles.driverNameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {item?.user_name}
            </Text>
            <View style={{height: 3}} />
            <Text style={styles.location}>{svgIcon.MiniPin}800m</Text>
            <View style={{height: 3}} />

            <Text style={styles.location}>
              {svgIcon.MiniRatingIcon}4.9 (531 reviews)
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <TouchableOpacity disabled style={styles.actionBtnStyles}>
            <Image
              source={appIcons.phoneIcon}
              style={styles.actionIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity disabled style={styles.actionBtnStyles}>
            <Image
              source={appIcons.message}
              style={styles.actionIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.row, {width: WP('30'), marginTop: WP('4')}]}>
        {svgIcon.VanFilledIcon}
        <Text style={styles.price}> ${item?.amount}</Text>
      </View>
      {type === 'Initial' && (
        <AppButton
          title="Cancel Order"
          buttonStyle={styles.cancelBtnStyle}
          textStyle={styles.cancelBtnStyles}
          handleClick={onPressCancelOrder}
        />
      )}
      {(type === RIDE_STATUS.I_AM_HERE || type === RIDE_STATUS.START_RIDE) && (
        <AppButton
          title="Truck Dispatch"
          disabled
          buttonStyle={styles.disabledStyle}
          // textStyle={styles.cancelBtnStyles}
          handleClick={onPressCancelOrder}
        />
      )}

      {type === RIDE_STATUS.COMPLETE_RIDE && (
        <AppButton
          title="Order Delivered"
          // buttonStyle={styles.cancelBtnStyle}
          // textStyle={styles.cancelBtnStyles}
          handleClick={() => handleRideStatus(RIDE_STATUS.ORDER_DELIVERED)}
        />
      )}
    </View>
  );
};

export default DriverDetailSheet;

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    margin: 0,
    width: '100%',
    position: 'absolute',
    borderRadius: WP('5'),
    paddingVertical: WP('5'),
    backgroundColor: PFColors.Standard.White,
    padding: 10,
  },
  driverUpdateTiming: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Gray.FadedGray,
    paddingVertical: WP('3'),
  },
  driverProfileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  driverProfile: {
    width: scale(54),
    height: scale(59),
    borderRadius: 10,
  },
  driverNameContainer: {
    marginLeft: 15,
    width: WP('40'),
  },
  name: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingTop: 5,
  },
  location: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Gray.FadedGray,
    paddingLeft: 5,
  },
  actionIcon: {
    height: scale(20),
    width: scale(20),
  },
  actionBtnStyles: {
    height: scale(40),
    width: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
  },
  row: {
    flexDirection: 'row',
    width: WP('23'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_28,
    color: PFColors.Standard.Black,
    paddingLeft: 10,
  },
  cancelBtnStyle: {
    backgroundColor: PFColors.Standard.White,
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
    marginVertical: WP('5'),
  },
  cancelBtnStyles: {
    color: PFColors.Blue.Dark,
  },
  disabledStyle: {
    backgroundColor: PFColors.Blue.Dark,
    marginVertical: WP('5'),
  },
});
