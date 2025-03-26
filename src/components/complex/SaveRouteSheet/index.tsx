import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {svgIcon} from '../../../assets/svg';
import {AppInput} from '../../primitive/AppInput';

interface SaveRouteSheetProps {
  onPressCancel: () => void;
  onPressSave?: any;
  onChangeText: any;
  routeName: any;
  title?: string;
  btnTitle?: string;
  onEndEditing?: () => void;
  onSubmitEditing?: () => void;
}

const SaveRouteSheet = ({
  onPressCancel,
  onPressSave,
  routeName,
  onChangeText,
  title = 'Save Route',
  btnTitle = 'Save Route',
  onEndEditing,
  onSubmitEditing,
}: SaveRouteSheetProps) => {
  const handleSave = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      onPressSave();
    }, 500);
  };
  console.log('routeName', routeName);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}>
      <ScrollView
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.modalContainer}>
          <View style={styles.titleView}>
            <Text style={styles.headerText}>{title}</Text>
            <TouchableOpacity onPress={onPressCancel}>
              {svgIcon.CancelIcon}
            </TouchableOpacity>
          </View>
          <AppInput
            placeholder=" Name"
            inputContainerStyle={styles.inputStyles}
            onChangeText={onChangeText}
            value={routeName}
            onEndEditing={onEndEditing}
            onSubmitEditing={onSubmitEditing}
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
              title={btnTitle}
              isSmall="40%"
              handleClick={() => handleSave()}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export {SaveRouteSheet};

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
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});
