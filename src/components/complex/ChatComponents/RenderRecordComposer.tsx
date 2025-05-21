import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {Composer, Send} from 'react-native-gifted-chat';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  RenderSend,
  showAlert,
} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {useSelector} from 'react-redux';

const RenderRecordComposer = ({props, isRecording, setIsRecording, onSend}) => {
  const {loginUser} = useSelector(state => state.auth);

  // const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  const [isPaused, setIsPaused] = useState(false);

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const recordingPath = useRef('');

  const formatTime = milliseconds => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  const checkMicrophonePermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'This app needs access to your microphone to record audio.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.MICROPHONE);

      if (result === RESULTS.GRANTED) {
        // console.log('Microphone permission granted');
        return true;
      } else if (result === RESULTS.BLOCKED) {
        // console.log(
        //   'Microphone permission denied. User needs to enable it in settings.',
        // );
      } else {
        // console.log('Microphone permission denied');
      }

      return false;
    }
  };

  const getAudioFilePath = () => {
    const fileName = `audio_${new Date().getTime()}.aac`;

    return Platform.OS === 'ios'
      ? `file://${RNFS.CachesDirectoryPath}/${fileName}`
      : `${RNFS.ExternalDirectoryPath}/${fileName}`;
  };

  const ensureDirectoryExists = async path => {
    const dir = path.substring(0, path.lastIndexOf('/'));
    const exists = await RNFS.exists(dir);
    if (!exists) {
      await RNFS.mkdir(dir);
    }
  };

  const onStartRecord = async () => {
    const hasPermission = await checkMicrophonePermissions();
    if (!hasPermission) {
      showAlert(
        'Permission Denied',
        'Microphone access is required to record audio.',
      );
      return;
    }

    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    const path = getAudioFilePath();
    recordingPath.current = path;

    try {
      await ensureDirectoryExists(path);
      await audioRecorderPlayer
        .startRecorder(path, audioSet)
        .then(res => {
          audioRecorderPlayer.addRecordBackListener(e => {
            const time = formatTime(e.currentPosition);
            setRecordTime(time);
          });
          setIsRecording(true);
        })
        .catch(err => {
          onStartRecord();
        });
    } catch (error) {
      showAlert('Error', 'Failed to start recording. Please try again.');
      setIsRecording(false);
    }
  };
  function getFileExtension(uri) {
    return uri.split('.').pop().split('?')[0];
  }
  const onStopRecord = async () => {
    if (!isRecording) {
      return;
    }
    console.log('Stopping recording...');
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      console.log('Recording stopped, file saved at:', result);
      console.log('`audio${getFileExtensi', {
        uri: result,
        name: `${new Date().getTime()}.${getFileExtension(result)}`,
        type: `audio/.${getFileExtension(result)}`,
      });
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setRecordTime('00:00');
      if (result && result !== 'Already stopped') {
        const fileExists = await RNFS.exists(result);
        if (fileExists) {
          // console.log('File exists:', result);
          const message = {
            _id: Math.random().toString(36).substring(7),
            text: '',
            createdAt: new Date(),
            user: {
              _id: loginUser?.id,
              name: loginUser?.name,
            },
            attachment: {
              uri: result,
              name: `${new Date().getTime()}.${getFileExtension(result)}`,
              type: `audio/${getFileExtension(result)}`,
            },
          };
          onSend([message]);
          // props.onSend([message]);
        } else {
          showAlert('Error', 'The recorded file does not exist.');
        }
      } else if (result === 'Already stopped') {
        // console.log('Recording was already stopped.');
        if (recordingPath.current) {
          const fileExists = await RNFS.exists(recordingPath.current);
          if (fileExists) {
            // console.log('File exists at stored path:', recordingPath.current);
            const message = {
              _id: Math.random().toString(36).substring(7),
              text: '',
              createdAt: new Date(),
              user: {
                _id: loginUser?.id,
                name: loginUser?.first_name,
              },
              attachment: recordingPath.current,
            };
            onSend([message]);
            // props.send([message]);
          } else {
            // console.error(
            //   'File does not exist at stored path:',
            //   recordingPath.current,
            // );
            showAlert('Error', 'The recorded file does not exist.');
          }
        } else {
          // console.error('No stored path available.');
          showAlert('Error', 'No audio file was recorded.');
        }
      } else {
        // console.error('No file path returned from stopRecorder:', result);
        showAlert('Error', 'No audio file was recorded.');
      }
    } catch (error) {
      // console.error('Failed to stop recording:', error);
      showAlert('Error', 'Failed to stop recording. Please try again.');
    }
  };

  const onPauseRecord = async () => {
    if (!isRecording) {
      // console.log('Recording is already paused.');
      return;
    }

    // console.log('Pausing recording...');
    try {
      if (isPaused) {
        await audioRecorderPlayer.resumeRecorder();
        setIsPaused(false);
      } else {
        await audioRecorderPlayer.pauseRecorder();
        setIsPaused(true);
      }
    } catch (error) {
      // console.error('Failed to pause recording:', error);
      showAlert('Error', 'Failed to pause recording. Please try again.');
    }
  };

  const handleRecordPress = async () => {
    // await audioRecorderPlayer.stopRecorder();
    if (isRecording) {
      // onStopRecord();
      onPauseRecord();
    } else {
      onStartRecord();
    }
  };
  const handleDelete = async () => {
    if (isRecording) {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setRecordTime('00:00');
    }
  };

  return (
    <>
      <View style={styles.viewStyle}>
        {!isRecording && (
          <View style={{width: '85%'}}>
            <Composer {...props} textInputStyle={styles.textInputStyle} />
          </View>
        )}
        <View style={styles.iconView}>
          <View style={styles.innerLeftView}>
            {/* {isRecording && (
              <TouchableOpacity
                onPress={handleRecordPress}
                style={styles.iconStyling}>
                {isPaused ? svgIcon.PauseIcon : svgIcon.StopIcon}
              </TouchableOpacity>
            )} */}
            {isRecording && (
              <Text style={styles.recordingText}>{recordTime}</Text>
            )}
          </View>
          {isRecording && (
            <TouchableOpacity onPress={handleDelete} style={styles.iconStyling}>
              {svgIcon.Delete}
            </TouchableOpacity>
          )}
        </View>
        {!isRecording && (
          <TouchableOpacity onPress={handleRecordPress}>
            {svgIcon.RecordIcon}
          </TouchableOpacity>
        )}
      </View>
      {isRecording && (
        <TouchableOpacity
          // disabled={!isPaused}
          onPress={() => {
            console.log('Send pressed');
            onStopRecord();
          }}
          style={styles.containerStyle(true)}>
          {svgIcon.SendMsg}
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  textInputStyle: {
    minHeight: 38,
    maxHeight: 90,
    textAlignVertical: 'center',
    textAlign: 'left',
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Regular,
    paddingHorizontal: 0,
  },
  viewStyle: {
    width: '68%',
    backgroundColor: PFColors.Gray.LightMist,
    borderRadius: 100,
    paddingHorizontal: 6,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    left: -6,
    marginTop: 4,
  },
  recordingText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Medium,
    marginLeft: 4,
  },
  iconStyling: {
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  iconView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  innerLeftView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerStyle: (disable: boolean) => ({
    justifyContent: 'center',
    height: 44,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: PFColors.Blue.Dark,
    borderRadius: 44,
    width: 44,
    opacity: disable ? 1 : 0.4,
  }),
});

export {RenderRecordComposer};

// const onStartRecord = async () => {
//   const hasPermission = await checkMicrophonePermissions();
//   if (!hasPermission) {
//     showAlert(
//       'Permission Denied',
//       'Microphone access is required to record audio.',
//     );
//     return;
//   }

//   console.log('Starting recording...');
//   const path = getAudioFilePath();
//   console.log('File path:', path);
//   recordingPath.current = path;

//   try {
//     await audioRecorderPlayer.startRecorder(path);
//     console.log('Recording started at:', path);
//     audioRecorderPlayer.addRecordBackListener(e => {
//       const time = formatTime(e.currentPosition);
//       setRecordTime(time);
//     });
//     setIsRecording(true);
//   } catch (error) {
//     console.error('Failed to start recording:', error);
//     showAlert('Error', 'Failed to start recording. Please try again.');
//     setIsRecording(false);
//   }
// };
