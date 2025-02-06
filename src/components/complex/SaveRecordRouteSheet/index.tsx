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

interface SaveRecordRouteSheetProps {
  setModalVisible?: () => void;
  recordingDetails: any;
  setDetails: any;
  onPressCancel: () => void;
  onPressSave: () => void;
}

const SaveRecordRouteSheet = ({
  setModalVisible,
  recordingDetails,
  setDetails,
  onPressCancel,
  onPressSave,
}: SaveRecordRouteSheetProps) => {
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
            <Text style={styles.headerText}>Save Recording</Text>
            <TouchableOpacity onPress={setModalVisible}>
              {svgIcon.CancelIcon}
            </TouchableOpacity>
          </View>

          <AppInput
            placeholder="Recording Name"
            inputContainerStyle={styles.inputWidth}
            value={recordingDetails.name}
            onChangeText={text =>
              setDetails({
                ...recordingDetails,
                name: text,
              })
            }
          />
          <AppInput
            placeholder="Notes"
            inputContainerStyle={styles.notesInputStyles}
            value={recordingDetails?.notes}
            multiline
            onChangeText={text =>
              setDetails({
                ...recordingDetails,
                notes: text,
              })
            }
          />

          <View style={styles.btnContainer}>
            <AppButton
              title="Cancel"
              buttonStyle={styles.cancelBtn}
              textStyle={styles.entranceBtntextStyle}
              handleClick={onPressCancel}
            />
            <AppButton
              handleClick={onPressSave}
              title="Save"
              buttonStyle={styles.entranceBtn}
              disabled={
                recordingDetails?.name?.length < 1 ||
                recordingDetails?.notes?.length < 1
              }
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export {SaveRecordRouteSheet};

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

  entranceBtn: {
    fontSize: PFFontSize.FONT_SIZE_12,
    borderColor: PFColors.Blue.Dark,
    width: WP('44'),
  },
  cancelBtn: {
    fontSize: PFFontSize.FONT_SIZE_12,
    backgroundColor: PFColors.Standard.White,
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
    width: WP('44'),
  },
  entranceBtntextStyle: {
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Blue.Dark,
    fontFamily: PFFonts.Foundation.Medium,
  },

  notesInputStyles: {
    width: WP('92'),
    height: WP('30'),
  },
  inputWidth: {
    width: WP('92'),
  },
});
