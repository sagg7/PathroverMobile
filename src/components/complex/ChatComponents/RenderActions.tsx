import React, {useState} from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {pickSingle, types} from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {svgIcon} from '../../../assets/svg';
import {showAlert} from '../../../shared/exporter';
import MediaModal from './MediaModal';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

const RenderActions = props => {
  const [isVisible, setIsVisible] = useState(false);

  const checkCameraPermissions = async () => {
    setIsVisible(false);

    const cameraPermission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;

    const permissionStatus = await check(cameraPermission);

    if (permissionStatus === RESULTS.GRANTED) {
      return true;
    } else {
      const requestStatus = await request(cameraPermission);
      if (requestStatus === RESULTS.GRANTED) {
        return true;
      } else {
        showAlert(
          'Permission Denied',
          'Camera access is required to take photos.',
        );
        return false;
      }
    }
  };

  const handleGallery = () => {
    setIsVisible(false);
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        mediaType: 'photo',
        maxFiles: 2,
      })
        .then(image => {
          const message = {
            _id: Math.random().toString(36).substring(7),
            text: '',
            createdAt: new Date(),
            user: {
              _id: props.user._id,
              name: props.user.name,
            },
            attachment: image,
          };

          props.onSend([message]);
        })
        .catch(error => {
          console.log('Error picking image: ', error);
        });
    }, 500);
  };

  const handleCamera = async () => {
    setIsVisible(false);
    const permission = await checkCameraPermissions();
    if (permission) {
      setTimeout(() => {
        const options = {
          mediaType: 'photo',
          quality: 0.8,
          includeBase64: false,
        };

        launchCamera(options, response => {
          if (response.didCancel) {
            console.log('User cancelled image capture');
          } else if (response.errorCode) {
            console.log('Camera Error: ', response.errorMessage);
          } else if (response.assets && response.assets.length > 0) {
            const imageAsset = response.assets[0];

            const message = {
              _id: Math?.random()?.toString(36)?.substring(7),
              text: '',
              createdAt: new Date(),
              user: {
                _id: props.user._id,
                name: props.user.name,
              },
              attachment: imageAsset,
            };

            props.onSend([message]);
            console.log('Captured image URI: ', imageAsset.uri);
          }
        });
      }, 500);
    }
  };

  const handleVideo = () => {
    setIsVisible(false);
    setTimeout(() => {
      const options = {
        mediaType: 'video',
        videoQuality: 'high',
        durationLimit: 60,
        includeBase64: false,
      };

      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled video picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const videoUri = response.assets && response.assets[0];

          if (response?.assets?.[0] && response?.assets?.[0]?.duration && response?.assets?.[0]?.duration > 60) {
            alert('Please select a video less than 1 minute.');
            return;
          }

          const message = {
            _id: Math.random().toString(36).substring(7),
            text: '',
            createdAt: new Date(),
            user: {
              _id: props.user._id,
            },
            attachment: response?.assets[0],
          };

          props.onSend([message]);
          console.log('Selected video URI: ', videoUri);
        }
      });
    }, 500);
  };

  const handleFile = async () => {
    setIsVisible(false);
    setTimeout(async () => {
      await pickSingle({
        allowMultiSelection: false,
        type: [
          types.pdf,
          types.doc,
          types.docx,
          types.plainText,
          types.ppt,
          types.pptx,
          types.xls,
          types.xlsx,
          types.csv,
          types.json,
          // types.zip,
        ],
      })
        .then(file => {
          console.log('Selected file: ', file);

          if(file?.size > 10485760) {
            alert('Please select a file less than 10 MB.');
            return;
          }
          
          const message = {
            _id: Math?.random()?.toString(36)?.substring(7),
            text: '',
            createdAt: new Date(),
            user: {
              _id: props?.user?._id,
              name: props?.user?.name,
            },
            attachment: file,
          };

          props.onSend([message]);
        })
        .catch(error => {
          console.log('Error picking file: ', error);
        });
    }, 500);
  };

  return (
    <>
      {props?.isRecord && (
        <TouchableOpacity
          style={styles.buttonStyle(isVisible)}
          onPress={() => {
            if (props?.isRecord) {
              setIsVisible(true);
            } else {
              handleGallery();
            }
          }}>
          {svgIcon.AddButton}
        </TouchableOpacity>
      )}
      {isVisible && (
        <MediaModal
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          onPressImage={handleGallery}
          onPressCamera={handleCamera}
          onPressVideo={handleVideo}
          onPressFile={handleFile}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    left: -15,
    height: 44,
    width: 44,
  },
  buttonStyle: isVisible => ({
    transform: [{rotate: isVisible ? '90deg' : '0deg'}],
  }),
});

export default RenderActions;
