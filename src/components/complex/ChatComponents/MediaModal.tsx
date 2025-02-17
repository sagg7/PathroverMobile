import * as React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';

interface MediaModalProps {
  isVisible?: boolean;
  setIsVisible?: (visible: boolean) => void;
  onPressImage?: () => void;
  onPressFile?: () => void;
  onPressVideo?: () => void;
  onPressCamera?: () => void;
}

const MediaModal = ({
  isVisible,
  setIsVisible,
  onPressImage,
  onPressFile,
  onPressVideo,
  onPressCamera,
}: MediaModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      backdropColor={'transparent'}
      onBackdropPress={() => setIsVisible(false)}
      style={styles.modalStyle}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.iconStyle} onPress={onPressImage}>
          {svgIcon.ImageType}
          <Text style={styles.textStyle}>Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconStyle} onPress={onPressFile}>
          {svgIcon.FileType}
          <Text style={styles.textStyle}>File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconStyle} onPress={onPressVideo}>
          {svgIcon.VideoType}
          <Text style={styles.textStyle}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconStyle} onPress={onPressCamera}>
          {svgIcon.CameraType}
          <Text style={styles.textStyle}>Camera</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default MediaModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: PFColors.Standard.White,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: PFColors.Standard.Black,
    shadowRadius: 3,
    shadowOpacity: 0.15,
    elevation: 2,
    ...Platform.select({
      android: {
        shadowOffset: {
          width: 0,
          height: -10,
        },
      },
      ios: {
        shadowOffset: {
          width: 0,
          height: -3,
        },
      },
    }),
    paddingBottom: 40,
  },
  textStyle: {
    color: PFColors.Gray.LightGray,
    fontSize: PFFontSize.FONT_SIZE_12,
    fontFamily: PFFonts.Foundation.Medium,
    marginTop: 6,
  },
  iconStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStyle: {
    margin: 0,
    justifyContent: 'flex-end',
    ...Platform.select({
      android: {
        // marginBottom: 60,
      },
      ios: {
        // marginBottom: 90,
      },
    }),
  },
});
