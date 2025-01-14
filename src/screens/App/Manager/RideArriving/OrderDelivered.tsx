import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  appIcons,
  PFColors,
  PFFonts,
  PFFontSize,
  RIDE_STATUS,
  scale,
  WP,
} from '../../../../shared/exporter';
import {AppButton, FromAndToCard} from '../../../../components';
import {svgIcon} from '../../../../assets/svg';
interface OrderDeliveredSheetProp {
  onPressCancelOrder: () => void;
  onPressOrderDelivered: (v: string) => void;
  item: any;
}

const OrderDeliveredSheet = ({
  onPressCancelOrder,
  onPressOrderDelivered,
  item,
}: OrderDeliveredSheetProp) => {
  return (
    <View style={styles.modalContainer}>
      <View style={{alignSelf: 'center', marginVertical: 5}}>
        {svgIcon.DragablePin}
      </View>
      {/* {svgIcon.DragablePin} */}
      <View style={styles.rowStyles}>
        <Text style={styles.titleStyles}>Your Route</Text>
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
      <FromAndToCard
        dropOff={item?.ride_request_data?.dropoff_location_name}
        pickup={item?.ride_request_data?.pickup_location_name}
      />
      <View style={styles.BtnContainer}>
        {/* <AppButton
          title="Cancel Order"
          buttonStyle={styles.cancelBtn}
          // textStyle={styles.cancelBtnStyles}
          handleClick={onPressCancelOrder}
        /> */}
        <AppButton
          title="Order Delivered"
          buttonStyle={styles.orderDeliveredBtn}
          handleClick={() => onPressOrderDelivered(RIDE_STATUS.ORDER_DELIVERED)}
        />
      </View>
    </View>
  );
};

export default OrderDeliveredSheet;

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
  rowStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleStyles: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_16,
  },
  row: {
    flexDirection: 'row',
    width: WP('23'),
    justifyContent: 'space-between',
    alignItems: 'center',
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
  BtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: WP('95'),
    marginVertical: 15,
  },
  orderDeliveredBtn: {
    // width: WP('50'),
  },
  cancelBtn: {
    width: WP('40'),
    backgroundColor: PFColors.Blue.DisableBlue,
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
  },
  cancelBtnStyles: {
    color: PFColors.Blue.Dark,
  },
});
