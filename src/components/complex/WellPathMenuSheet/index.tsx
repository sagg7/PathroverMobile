import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';

interface WellPathMenuSheetProps {
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressCancel: () => void;
  onPressCreateRoute: () => void;
  show: boolean;
  onPressRecordRoute: () => void;
}

const WellPathMenuSheet = ({
  modalVisible,
  setModalVisible,
  onPressCancel,
  onPressCreateRoute,
  show = true,
  onPressRecordRoute,
}: WellPathMenuSheetProps) => {
  const OptionView = ({title, onPress, icon, disabled}: any) => {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View style={styles.optionView}>
          <Text style={styles.titleStyles}>{title}</Text>
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
        <Text style={styles.headerText}>Select Option</Text>
        <TouchableOpacity onPress={onPressCancel}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>

      <OptionView
        title={'Route Recording'}
        icon={svgIcon.RecordingIcon}
        onPress={onPressRecordRoute}
      />
      {show && (
        <OptionView
          title={'Create Route'}
          icon={svgIcon.MyRequest}
          onPress={onPressCreateRoute}
        />
      )}
    </Modal>
  );
};

export {WellPathMenuSheet};

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

  headerText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
  },

  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WP('4'),
    marginVertical: 5,
  },
  optionView: {
    backgroundColor: PFColors.Gray.LightMist,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WP('4'),
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  titleStyles: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
  },
});
