import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {AppInput} from '../../primitive/AppInput';

interface SaveRecordHikingRouteSheetProps {
  setModalVisible?: () => void;
  onPressSave: () => void;
  onPressResume: () => void;
  onPressPause: () => void;
  onPressEnd?: () => void;
  time: string;
  speed?: string;
  elevation?: string;
  value: any;
  onChange: any;
  distance: any;
  setHideActionBtn: any;
}

const SaveRecordHikingRouteSheet = ({
  onPressSave,
  onPressResume,
  onPressPause,
  onPressEnd,
  speed,
  time,
  elevation,
  value,
  onChange,
  distance = 0.0,
  setHideActionBtn,
}: SaveRecordHikingRouteSheetProps) => {
  const [btnStatus, setBtnStatus] = useState('play');

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
            <Text style={styles.headerText}>Record Track</Text>
            {/* <TouchableOpacity onPress={setModalVisible}>
              {svgIcon.CancelIcon}
            </TouchableOpacity> */}
          </View>
          {btnStatus === 'pause' && (
            <>
              <Text style={styles.inputTitle}>Track Name</Text>
              <AppInput
                placeholder="Name"
                inputContainerStyle={styles.inputWidth}
                value={value?.name}
                onChangeText={text =>
                  onChange({
                    ...value,
                    name: text,
                  })
                }
              />
            </>
          )}
          {btnStatus === 'play' && (
            <View style={styles.distanceView}>
              <Text style={styles.distanceNumberText}>
                {String(distance)} m
              </Text>
              <Text style={styles.distanceText}>Distance</Text>
            </View>
          )}
          <View style={styles.recordingDetailsView}>
            <View style={styles.detailInnerView}>
              <Text style={styles.digitsText}>{elevation || '478'}</Text>
              <Text style={styles.digitTitleText}>Elevation (ft)</Text>
            </View>
            <View style={styles.detailInnerView}>
              <Text style={styles.digitsText}>{speed} mph</Text>
              <Text style={styles.digitTitleText}>Speed</Text>
            </View>
            <View style={styles.detailInnerView}>
              <Text style={styles.digitsText}>{time}</Text>
              <Text style={styles.digitTitleText}>Time</Text>
            </View>
          </View>
          {btnStatus === 'pause' && (
            <>
              <Text style={styles.inputTitle}>Notes</Text>
              <AppInput
                textAlignVertical={'top'}
                placeholder="Note"
                inputContainerStyle={styles.inputWidth}
                value={value.note}
                onChangeText={text =>
                  onChange({
                    ...value,
                    note: text,
                  })
                }
              />
            </>
          )}

          <View style={styles.btnContainer}>
            {btnStatus === 'play' ? (
              <AppButton
                handleClick={() => {
                  setBtnStatus('pause');
                  onPressPause();
                  setHideActionBtn(true);
                }}
                title="Pause"
              />
            ) : btnStatus === 'pause' ? (
              <>
                <AppButton
                  title="Resume"
                  buttonStyle={styles.resumeBtn}
                  handleClick={() => {
                    setBtnStatus('play');
                    onPressResume();
                    setHideActionBtn(false);
                  }}
                />
                {/* <AppButton
                  handleClick={onPressEnd}
                  title="End"
                  buttonStyle={styles.endBtn}
                /> */}
                <AppButton
                  handleClick={onPressSave}
                  title="Save"
                  buttonStyle={styles.entranceBtn}
                  // disabled={value.name || value.note}
                  disabled={!value.name || !value.note}
                />
              </>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export {SaveRecordHikingRouteSheet};

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
  endBtn: {
    // fontSize: PFFontSize.FONT_SIZE_12,
    width: WP('44'),
    backgroundColor: PFColors.Red.RadiantRed,
  },
  resumeBtn: {
    fontSize: PFFontSize.FONT_SIZE_12,
    backgroundColor: PFColors.Yellow.Light,
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
  distanceView: {
    backgroundColor: PFColors.Orange.Dark,
    padding: 10,
    paddingVertical: WP('4'),
    marginHorizontal: WP('4'),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  distanceText: {
    fontSize: PFFontSize.FONT_SIZE_10,
    color: PFColors.Standard.White,
    fontFamily: PFFonts.Foundation.Medium,
    paddingTop: 5,
  },
  distanceNumberText: {
    fontSize: PFFontSize.FONT_SIZE_18,
    color: PFColors.Standard.White,
    fontFamily: PFFonts.Foundation.Medium,
  },
  recordingDetailsView: {
    backgroundColor: PFColors.Gray.WhisperGray,
    padding: 10,
    marginHorizontal: WP('4'),
    borderRadius: 10,
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailInnerView: {
    alignItems: 'center',
    width: WP('28'),
  },
  digitsText: {
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  digitTitleText: {
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Regular,
  },
  inputTitle: {
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
    paddingLeft: 15,
  },
});
