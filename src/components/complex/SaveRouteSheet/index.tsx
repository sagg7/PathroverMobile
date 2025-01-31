import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {svgIcon} from '../../../assets/svg';
import {AppInput} from '../../primitive/AppInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface SaveRouteSheetProps {
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressCancel: () => void;
  onPressSave?: any;
  onChangeText: any;
  routeName: any;
}

const SaveRouteSheet = ({
  modalVisible,
  setModalVisible,
  onPressCancel,
  onPressSave,
  routeName,
  onChangeText,
}: SaveRouteSheetProps) => {
  const handleSave = () => {
    onPressSave();
  };

  return (
    // <KeyboardAwareScrollView
    //   enableAutomaticScroll={true}
    //   enableOnAndroid={true}
    //   keyboardShouldPersistTaps={'handled'}
    //   contentContainerStyle={{flex: 1, flexGrow: 1}}
    //   showsVerticalScrollIndicator={false}>
    //   <Modal
    //     useNativeDriver
    //     isVisible={modalVisible}
    //     onBackdropPress={setModalVisible}
    //     style={styles.modalContainer}>
    <View style={styles.modalContainer}>
      <View style={styles.titleView}>
        <Text style={styles.headerText}>Save Route</Text>
        <TouchableOpacity onPress={onPressCancel}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>
      <AppInput
        placeholder="Route Name"
        inputContainerStyle={styles.inputStyles}
        onChangeText={onChangeText}
        value={routeName}
      />

      <View style={styles.btnContainer}>
        <AppButton
          title="Cancel"
          isSmall="40%"
          handleClick={onPressCancel}
          buttonStyle={styles.cancelBtn}
          textStyle={{color: PFColors.Blue.Dark}}
        />

        <AppButton
          disabled={routeName?.length < 1}
          title="Save Route"
          isSmall="40%"
          handleClick={() => handleSave()}
        />
      </View>
    </View>
  );
};

export {SaveRouteSheet};

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    // alignSelf: 'flex-end',
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
    paddingLeft: WP('3'),
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: WP('5'),
    marginTop: 30,
  },

  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WP('4'),
    marginVertical: 5,
  },

  cancelBtn: {
    backgroundColor: PFColors.Standard.White,
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
  },
  inputStyles: {
    width: WP('88'),
  },
});
