import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {svgIcon} from '../../../assets/svg';

interface TrailInfoSheetProps {
  trailInfo: any;
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressShare: (trailInfo: any) => void;
  onPressNavigation?: () => void;
  onPressPin: (trailIno: any) => void;
}

const TrailInfoSheet = ({
  trailInfo,
  modalVisible,
  setModalVisible,
  onPressShare,
  onPressNavigation,
  onPressPin,
}: TrailInfoSheetProps) => {
  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View style={styles.contentView}>
        <View>
          <Text style={styles.trailNameStyle}>
            Name: {trailInfo?.properties?.tags?.name || 'Unknown Trail/Path'}
          </Text>
          {trailInfo?.properties?.tags?.description && (
            <Text style={styles.trailDescStyle}>
              {trailInfo?.properties?.tags?.description}
            </Text>
          )}
          {trailInfo?.properties?.tags?.highway && (
            <Text style={styles.trailNameStyle}>
              <Text style={{textTransform: 'capitalize'}}>
                Highway: {trailInfo?.properties?.tags?.highway}
              </Text>
            </Text>
          )}
          {trailInfo?.properties?.tags?.surface && (
            <Text style={styles.trailNameStyle}>
              <Text style={{textTransform: 'capitalize'}}>
                Surface: {trailInfo?.properties?.tags?.surface}
              </Text>
            </Text>
          )}
        </View>

        <TouchableOpacity onPress={setModalVisible}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>
      <View style={styles.actionIcon}>
        <TouchableOpacity
          onPress={() => onPressShare(trailInfo)}
          style={{right: 12}}>
          {svgIcon.ShareWellPath}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressPin(trailInfo)}>
          {svgIcon.PinLocation}
        </TouchableOpacity>
      </View>

      <View style={styles.btnContainer}>
        <AppButton
          title="Cancel"
          isSmall="45%"
          handleClick={setModalVisible}
          textStyle={styles.cancelBtnTextStyle}
          buttonStyle={styles.cancelBtnContainer}
        />
        <AppButton
          title="Explore"
          isSmall="45%"
          handleClick={onPressNavigation}
          textStyle={styles.btnTextStyle}
        />
      </View>
    </Modal>
  );
};

export {TrailInfoSheet};

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
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WP('4'),
    marginVertical: 5,
  },
  trailNameStyle: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
    width: WP('80'),
    paddingVertical: 5,
  },
  trailDescStyle: {
    lineHeight: 20,
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    width: WP('80'),
    paddingVertical: 5,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: WP('3'),
    width: WP('88'),
    alignSelf: 'center',
  },
  btnTextStyle: {
    fontSize: PFFontSize.FONT_SIZE_12,
  },
  cancelBtnContainer: {
    fontSize: PFFontSize.FONT_SIZE_12,
    backgroundColor: PFColors.Standard.White,
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
  },
  cancelBtnTextStyle: {
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Blue.Dark,
    fontFamily: PFFonts.Foundation.Regular,
  },
  actionIcon: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    right: WP('6'),
    marginBottom: 20,
  },
});
