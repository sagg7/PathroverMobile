import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, StyleSheet, Image } from 'react-native';
import { WP, PFColors, PFFonts, PFFontSize, } from '../../../shared/exporter';
import { svgIcon } from '../../../assets/svg';

interface ImageFileUploaderProps {
  onPressPlaceholder: () => void;
  onPressDel: () => void;
  selectedPicture?: any
  title?: string
  showDel?: boolean
}

const ImageFileUploader: React.FC<ImageFileUploaderProps> = ({
  onPressPlaceholder,
  onPressDel,
  selectedPicture,
  title,
  showDel = true
}) => {

  return (
    <>
      <View>
        {!selectedPicture ?
          <>
            <TouchableOpacity style={styles.container} onPress={onPressPlaceholder}>
              {svgIcon.UploaderPlaceHolder}
            </TouchableOpacity>
            <Text style={styles.uploadText}>{title}</Text>
          </>
          :
          <>
            <Image source={selectedPicture} style={styles.identityPicture} resizeMode='cover' />
            {showDel &&
              <TouchableOpacity style={styles.deleteView} onPress={onPressDel}>
                {svgIcon.Delete}
              </TouchableOpacity>
            }
          </>
        }
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WP('90'),
    height: WP('35'),
    alignSelf: "center",
    backgroundColor: PFColors.Gray.WhisperGray,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: PFColors.Blue.Dark,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  identityPicture: {
    width: WP('86'),
    height: WP('44'),
    alignSelf: "center",
    borderRadius: 10,

  },
  deleteView: {
    backgroundColor: PFColors.Standard.White,
    width: WP('9'),
    height: WP('9'),
    borderRadius: 8,
    position: "absolute",
    right: WP('10'),
    top: WP('2'),
    justifyContent: "center",
    alignItems: "center"
  },
  uploadText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_14,
    position: "absolute",
    top: WP('30'),
    left: '54%',
    transform: [
      { translateX: -50 },
      { translateY: -50 },
    ],
    textAlign: 'center',
  }

});

export { ImageFileUploader };
