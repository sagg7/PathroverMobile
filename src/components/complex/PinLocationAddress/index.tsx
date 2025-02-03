import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {svgIcon} from '../../../assets/svg';

interface PinLocationAddressProps {
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressShare?: () => void;
  selectedPin: any;
  onPressRouteToWell: () => void;
  onPresAddEntrance?: () => void;
}

const PinLocationAddress = ({
  modalVisible,
  setModalVisible,
  onPressShare,
  selectedPin,
  onPresAddEntrance,
  onPressRouteToWell,
}: PinLocationAddressProps) => {
  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View style={styles.titleView}>
        <Text style={styles.headerText}>Pin Address Location</Text>
        <TouchableOpacity onPress={setModalVisible}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>
      <View style={styles.addressView}>
        <View style={{flexDirection: 'row'}}>
          {svgIcon.MapPinBlue}
          <Text style={styles.placeName}> Location</Text>
        </View>
      </View>
      {selectedPin?.length > 1 && (
        <View>
          <Text style={styles.latLngText}>
            Latitude:{' '}
            <Text style={styles.latLngNumberText}>{selectedPin[1]}</Text>
          </Text>
          <Text style={styles.latLngText}>
            Longitude:{' '}
            <Text style={styles.latLngNumberText}>{selectedPin[0]}</Text>
          </Text>
        </View>
      )}

      <View style={styles.btnContainer}>
        <AppButton
          title="Add Entrance"
          isSmall="45%"
          handleClick={onPresAddEntrance}
          textStyle={styles.entranceBtntextStyle}
          buttonStyle={styles.entranceBtn}
        />
        <AppButton
          title="Route to Well"
          isSmall="45%"
          handleClick={onPressRouteToWell}
          textStyle={styles.btnTextStyle}
        />
      </View>
    </Modal>
  );
};

export {PinLocationAddress};

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    margin: 0,
    position: 'absolute',
    borderRadius: WP('3'),
    paddingVertical: WP('5'),
    backgroundColor: PFColors.Standard.White,
    width: WP('100'),
  },

  item: {
    flex: 1,
    margin: 5,
  },
  container: {
    alignItems: 'center',
    padding: 10,
    borderRadius: WP('2'),
  },

  headerText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: WP('3'),
    width: WP('92'),
    alignSelf: 'center',
  },

  switchView: {
    flexDirection: 'row',
    width: WP('94'),
    marginVertical: 10,
  },
  toggleContainer: {
    width: 50,
    height: 25,
    borderRadius: 25,
    padding: 5,
    left: 15,
  },
  circleStyle: {
    width: 18,
    height: 18,
    borderRadius: 10,
  },
  settingText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Medium,
    paddingLeft: 25,
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WP('4'),
    marginVertical: 5,
  },
  latLngText: {
    fontFamily: PFFonts.Foundation.Bold,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    paddingLeft: WP('4'),
    paddingVertical: WP('1'),
  },
  latLngNumberText: {
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Gray.DarkGray,
  },
  btnTextStyle: {
    fontSize: PFFontSize.FONT_SIZE_12,
  },
  entranceBtn: {
    fontSize: PFFontSize.FONT_SIZE_12,
    backgroundColor: PFColors.Standard.White,
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
  },
  entranceBtntextStyle: {
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Blue.Dark,
    fontFamily: PFFonts.Foundation.Regular,
  },
  addressView: {
    flexDirection: 'row',
    marginHorizontal: WP('4'),
    justifyContent: 'space-between',
    marginTop: 15,
  },
  placeName: {
    fontFamily: PFFonts.Foundation.Medium,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
});
