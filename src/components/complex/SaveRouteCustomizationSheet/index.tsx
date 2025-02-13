import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';

interface SaveRouteCustomizationSheetProps {
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressCancel: () => void;
  onPressSave?: () => void;
  well: boolean;
  pin: boolean;
  setPin: any;
  setWell: any;
  onPressClear: () => void;
  onPressDel: () => void;
  onPressShare: () => void;
}

const SaveRouteCustomizationSheet = ({
  modalVisible,
  setModalVisible,
  onPressCancel,
  onPressDel,
  onPressShare,
}: SaveRouteCustomizationSheetProps) => {
  const OptionView = ({title, icon, onPress}: any) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.optionView}>
          <Text style={styles.optionText}>{title}</Text>
          {icon}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View style={styles.titleView}>
        <Text style={styles.headerText}>Select Options</Text>
        <TouchableOpacity onPress={onPressCancel}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>

      <OptionView
        title={'Delete'}
        icon={svgIcon.DeleteIcon}
        onPress={onPressDel}
      />
      <OptionView title={'Share'} icon={svgIcon.Share} onPress={onPressShare} />
    </Modal>
  );
};

export {SaveRouteCustomizationSheet};

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
  optionText: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
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
  optionView: {
    borderWidth: 1,
    marginHorizontal: 15,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingVertical: 20,
    marginVertical: 10,
    borderColor: PFColors.Blue.Dark,
  },
});
