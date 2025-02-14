import React from 'react';
import {
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

interface AddEntranceSheetProps {
  setModalVisible?: () => void;
  onPressShare?: () => void;
  selectedPin: any;
  onPressPlaceToEntrance?: () => void;
  entranceName: string;
  onChangeEntranceName: any;
  isEntranceMarker?: any;
  selectedWellName: any;
}

const AddEntranceSheet = ({
  setModalVisible,
  onPressShare,
  selectedPin,
  onPressPlaceToEntrance,
  entranceName,
  onChangeEntranceName,
  isEntranceMarker,
  selectedWellName,
}: AddEntranceSheetProps) => {
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.modalContainer}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View>
          <View style={styles.titleView}>
            <Text style={styles.headerText}>Pin Address Location</Text>
            <TouchableOpacity onPress={setModalVisible}>
              {svgIcon.CancelIcon}
            </TouchableOpacity>
          </View>
          <View style={styles.addressView}>
            <View style={{flexDirection: 'row'}}>
              {svgIcon.MapPinBlue}
              <Text style={styles.placeName}> {selectedWellName || ''}</Text>
            </View>
            <TouchableOpacity onPress={onPressShare}>
              {svgIcon.ShareWellPath}
            </TouchableOpacity>
          </View>
          {selectedPin && (
            <View>
              <Text style={styles.latLngText}>
                Latitude:{' '}
                <Text style={styles.latLngNumberText}>
                  {isEntranceMarker?.length ? Number(isEntranceMarker[1]) : ''}
                </Text>
              </Text>
              <Text style={styles.latLngText}>
                Longitude:{' '}
                <Text style={styles.latLngNumberText}>
                  {isEntranceMarker?.length ? Number(isEntranceMarker[0]) : ''}
                </Text>
              </Text>
            </View>
          )}
          <AppInput
            placeholder="Add Enternace Name"
            inputContainerStyle={styles.inputWidth}
            value={entranceName}
            onChangeText={onChangeEntranceName}
          />
          {!isEntranceMarker && (
            <Text style={styles.descText}>
              Drag the pin to enter the destination
            </Text>
          )}

          <View style={styles.btnContainer}>
            <AppButton
              title="Place Entrance"
              handleClick={onPressPlaceToEntrance}
              disabled={entranceName?.length < 1 || !isEntranceMarker}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export {AddEntranceSheet};

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    margin: 0,
    position: 'absolute',
    borderRadius: WP('3'),
    paddingVertical: WP('5'),
    backgroundColor: PFColors.Standard.White,
    width: WP('100'),
    maxHeight: '90%',
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
  inputWidth: {
    width: WP('92'),
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
  descText: {
    fontFamily: PFFonts.Foundation.Bold,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    alignSelf: 'center',
    paddingVertical: WP('5'),
  },
});
