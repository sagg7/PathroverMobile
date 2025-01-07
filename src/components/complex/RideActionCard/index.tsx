import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {AppButton} from '../AppButton';
import {
  PFColors,
  PFFontSize,
  PFFonts,
  WP,
  appIcons,
} from '../../../shared/exporter';

interface RideActionCardProps {
  modalVisible: boolean;
  handleClick: (dates: {startDate: string; endDate: string}) => void;
  setModalVisible: () => void;
  onPressCancel: () => void;
  item: any;
}
const RideActionCard = ({
  modalVisible,
  setModalVisible,
  onPressCancel,
  item,
}: RideActionCardProps) => {
  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View>
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
              <Text style={styles.text}>5 minutes to delivery</Text>
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
          <Text style={styles.userName}>Call {item?.user_name} </Text>
          <TouchableOpacity
            disabled
            onPress={() => Linking.openURL(`tel:1111222333`)}>
            <Image source={appIcons.phoneIcon} style={styles.actionIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsRow}>
          <AppButton
            title="Cancel Ride"
            isEmpty={false}
            textStyle={styles.yesTextStyle}
            handleClick={onPressCancel}
          />
        </View>
      </View>
    </Modal>
  );
};

export {RideActionCard};

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    margin: 0,
    position: 'absolute',
    borderRadius: WP('3'),
    paddingVertical: WP('5'),
    backgroundColor: PFColors.Standard.White,
  },
  buttonsRow: {
    paddingHorizontal: WP('5'),
    marginVertical: 10,
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
  userName: {
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.EclipseBlack,
    fontSize: PFFontSize.FONT_SIZE_14,
    paddingLeft: 10,
    // width: WP('30'),
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubleViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  expandingView: {
    alignSelf: 'flex-start',
    backgroundColor: PFColors.Gray.CloudWhite,
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
});
