import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
  well: boolean;
  pin: boolean;
  setPin: any;
  setWell: any;
  onPressClear: () => void;
}

const MapSettingSheet = ({
  modalVisible,
  setModalVisible,
  onPressCancel,
  well,
  pin,
  setPin,
  setWell,
  onPressClear,
}: MapSettingSheetProps) => {
  const SwitchView = ({
    value,
    setValue,
    title,
    otherValue,
    setOtherValue,
  }: any) => {
    const handleToggle = () => {
      if (value) {
        // Trying to turn off this toggle
        if (!otherValue) {
          setOtherValue(true);
        }
        setValue(false);
      } else {
        // Turning this toggle on is always allowed
        setValue(true);
      }
    };

    return (
      <View style={styles.switchView}>
        <SwitchToggle
          switchOn={value}
          onPress={handleToggle}
          circleColorOff={PFColors.Gray.AshGray}
          circleColorOn={PFColors.Blue.Dark}
          backgroundColorOn={PFColors.Blue.SoftGlacier}
          backgroundColorOff={PFColors.Gray.FrostedGray}
          circleStyle={styles.circleStyle}
          containerStyle={styles.toggleContainer}
        />
        <Text style={styles.settingText}>Show nearby {title}</Text>
      </View>
    );
  };
  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View style={styles.titleView}>
        <Text style={styles.headerText}>Map Settings</Text>
        <TouchableOpacity onPress={onPressCancel}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>
      <SwitchView
        value={well}
        setValue={setWell}
        otherValue={pin}
        setOtherValue={setPin}
        title={'Wells'}
      />

      <SwitchView
        value={pin}
        setValue={setPin}
        otherValue={well}
        setOtherValue={setWell}
        title={'Pins'}
      />

      <View style={styles.btnContainer}>
        <AppButton
          title="Clear"
          isSmall="90%"
          handleClick={onPressClear}
          // disabled={well && pin}
        />
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
