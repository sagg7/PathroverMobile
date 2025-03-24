import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {svgIcon} from '../../../assets/svg';
import {AppInput} from '../../primitive/AppInput';

interface PinYourLocationSheetProps {
  onPressSave?: () => void;
  onPressCancel: () => void;
  values?: any;
  setValues: any;
}

const PinYourLocationSheet = ({
  onPressCancel,
  onPressSave,
  values,
  setValues,
}: PinYourLocationSheetProps) => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.titleView}>
        <Text style={styles.headerText}>Pin Your Location</Text>
        <TouchableOpacity onPress={onPressCancel}>
          {svgIcon.CancelIcon}
        </TouchableOpacity>
      </View>
      <AppInput
        placeholder="Name"
        inputContainerStyle={styles.inputStyles}
        value={values?.name}
        onChangeText={text => {
          setValues({
            ...values,
            name: text,
          });
        }}
      />
      <AppInput
        value={values?.longitude?.toString() ?? ''}
        placeholder="Longitude"
        inputContainerStyle={styles.inputStyles}
        editable={false}
      />
      <AppInput
        value={values?.latitude.toString() ?? ''}
        placeholder="Latitude"
        inputContainerStyle={styles.inputStyles}
        editable={false}
      />

      <View style={styles.btnContainer}>
        <AppButton
          title="Save"
          isSmall="100%"
          handleClick={onPressSave}
          disabled={values?.name?.length < 1}
        />
      </View>
    </View>
  );
};

export {PinYourLocationSheet};

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    margin: 0,
    position: 'absolute',
    borderRadius: WP('3'),
    paddingVertical: WP('5'),
    backgroundColor: PFColors.Standard.White,
    width: WP('100'),
    zIndex: 1,
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

  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WP('4'),
    marginVertical: 5,
  },

  placeName: {
    fontFamily: PFFonts.Foundation.Medium,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
  inputStyles: {
    width: WP('90'),
  },
});
