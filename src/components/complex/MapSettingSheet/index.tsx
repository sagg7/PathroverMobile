import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import Modal from 'react-native-modal';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {svgIcon} from '../../../assets/svg';
import SwitchToggle from 'react-native-switch-toggle';

interface MapSettingSheetProps {
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressCancel: () => void;
  onPressSave?: () => void;
  onPressCard: (v: any) => void;
  data?: any[];
}

const MapSettingSheet = ({
  modalVisible,
  setModalVisible,
  onPressCard,
  data = [],
  onPressCancel,
  onPressSave,
}: MapSettingSheetProps) => {
  const renderItem = () => (
    <View style={styles.switchView}>
      <SwitchToggle
        switchOn={true}
        // onPress={onPressToggle}
        circleColorOff={PFColors.Gray.AshGray}
        circleColorOn={PFColors.Blue.Dark}
        backgroundColorOn={PFColors.Blue.SoftGlacier}
        backgroundColorOff={PFColors.Gray.FrostedGray}
        circleStyle={styles.circleStyle}
        containerStyle={styles.toggleContainer}
      />
      <Text style={styles.settingText}>Show nearby Wells</Text>
    </View>
  );

  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View style={styles.titleView}>
        <Text style={styles.headerText}>Map Settings</Text>
        <TouchableOpacity>{svgIcon.CancelIcon}</TouchableOpacity>
      </View>
      {renderItem()}
      {renderItem()}

      <View style={styles.btnContainer}>
        <AppButton title="Clear" isSmall="90%" handleClick={onPressSave} />
      </View>
    </Modal>
  );
};

export {MapSettingSheet};

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
  userprofiles: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  roleName: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Standard.Black,
    marginTop: 5,
  },
  imageStyle: {
    borderRadius: 18,
    borderColor: PFColors.Blue.Dark,
  },
  headerText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    // paddingLeft: WP('8'),s
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: WP('3'),
  },
  cancelbtnStyles: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
  },
  cancelTextStyles: {
    color: PFColors.Blue.Dark,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  dragablePin: {
    alignSelf: 'center',
    marginBottom: 10,
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
});
