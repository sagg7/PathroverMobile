import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {AppButton} from '../AppButton';
import {
  PFColors,
  PFFontSize,
  PFFonts,
  RIDE_STATUS,
  WP,
  appIcons,
} from '../../../shared/exporter';

interface RideActionCardProps {
  handleClick: (dates: {startDate: string; endDate: string}) => void;
  setModalVisible: () => void;
  onPressCancel?: () => void;
  data: any;
  type: string;
  onPressBtn: (v: any) => void;
}
const RideActionCard = ({
  onPressCancel,
  data,
  type,
  onPressBtn,
}: RideActionCardProps) => {
  const item = data;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalViewContainer}>
        <View style={styles.rowContainer}>
          <View style={styles.userNameContainer}>
            <Image
              source={
                item?.profile_image
                  ? {uri: item?.profile_image}
                  : appIcons.userPlaceholder
              }
              style={styles.userPic}
            />
            <Text style={styles.userName} numberOfLines={2}>
              {item?.user_name}
            </Text>
          </View>
          <View style={styles.bubleViewContainer}>
            <View style={styles.expandingView}>
              <Image
                source={appIcons.curvedarrow}
                style={[styles.bubleIcon]}
                resizeMode="contain"
              />

              <Text style={styles.text}>
                {type === RIDE_STATUS.ORDER_DELIVERED
                  ? 'Order Delivered to Drop off location'
                  : '5 minute to arive'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <TouchableOpacity disabled>
            <Image
              source={appIcons.message}
              style={styles.actionIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={[styles.userName, {textAlign: 'center'}]}>
            Call {item?.user_name}
          </Text>
          <TouchableOpacity
            disabled
            onPress={() => Linking.openURL(`tel:1111222333`)}>
            <Image source={appIcons.phoneIcon} style={styles.actionIcon} />
          </TouchableOpacity>
        </View>
        {type === 'Initial' && (
          <View style={styles.doubleButton}>
            <AppButton
              title="Cancel"
              textStyle={styles.yesTextStyle}
              handleClick={onPressCancel}
              disabled={type !== 'Initial'}
              buttonStyle={[
                styles.cancelButtonStyles,
                {
                  backgroundColor: PFColors.Red.RubyRed,
                },
              ]}
            />
            <AppButton
              title={"I'm Here"}
              textStyle={styles.yesTextStyle}
              handleClick={() => onPressBtn(RIDE_STATUS.I_AM_HERE)}
              buttonStyle={styles.secondButtonStyles}
            />
          </View>
        )}
        {type === RIDE_STATUS.I_AM_HERE && (
          <View style={styles.doubleButton}>
            <AppButton
              title="Cancel"
              textStyle={styles.yesTextStyle}
              handleClick={onPressCancel}
              disabled
              buttonStyle={[styles.cancelButtonStyles]}
            />
            <AppButton
              title={'Start Ride'}
              textStyle={styles.yesTextStyle}
              handleClick={() => onPressBtn(RIDE_STATUS.START_RIDE)}
              buttonStyle={styles.secondButtonStyles}
            />
          </View>
        )}
        {type === RIDE_STATUS.ORDER_DELIVERED && (
          <View style={styles.buttonsRow}>
            <AppButton
              title="Complete Ride"
              textStyle={styles.yesTextStyle}
              handleClick={() => onPressBtn(RIDE_STATUS.COMPLETE_RIDE)}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export {RideActionCard};

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    margin: 0,
    width: '100%',
    position: 'absolute',
    borderRadius: WP('3'),
    paddingVertical: WP('5'),
    backgroundColor: PFColors.Standard.White,
  },
  modalViewContainer: {
    flex: 1,
  },
  buttonsRow: {
    paddingHorizontal: WP('5'),
    marginVertical: WP('5'),
  },
  yesTextStyle: {
    width: '100%',
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    marginHorizontal: WP('5'),
    justifyContent: 'space-between',
    marginVertical: 15,
    alignItems: 'center',
  },
  userPic: {
    height: WP('10'),
    width: WP('10'),
    borderRadius: 20,
  },
  userNameContainer: {
    flex: 0.95,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    width: '75%',
    flexWrap: 'wrap',
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.EclipseBlack,
    fontSize: PFFontSize.FONT_SIZE_12,
    paddingLeft: 10,
  },
  bubleViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  expandingView: {
    alignSelf: 'flex-start',
    backgroundColor: PFColors.Gray.CloudWhite,
    padding: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  text: {
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
  },
  bubleIcon: {
    height: 8,
    width: 16,
    marginHorizontal: 5,
  },
  actionIcon: {
    height: WP('6'),
    width: WP('6'),
  },
  cancelButtonStyles: {
    width: WP('37'),
  },
  doubleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WP('4'),
    marginVertical: WP('5'),
  },
  secondButtonStyles: {
    width: WP('52'),
  },
});
