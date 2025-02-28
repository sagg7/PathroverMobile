import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform} from 'react-native';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

const formatFileSize = size => {
  if (!size) {
    return '';
  }
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) +
    ' ' +
    ['B', 'KB', 'MB', 'GB', 'TB'][i]
  );
};

function getFileNameFromUrl(url) {
  if (!url) {
    return '';
  }
  const urlWithoutQuery = url?.split('?')[0];
  const segments = urlWithoutQuery?.split('/');
  return segments?.pop();
}

const FileMessage = ({currentMessage, position}) => {
  const {message_attachment} = currentMessage;
  const isLeft = position === 'left';

  const onPreview = () => {
    try {
      const getFileName = getFileNameFromUrl(message_attachment?.url);

      const localFile = `${RNFS.DocumentDirectoryPath}/${
        message_attachment?.file_name  || 'file.pdf'
        }`;
     
      const options = {
        fromUrl: message_attachment?.url,
        toFile: localFile,
      };
      RNFS.downloadFile(options).promise.then(() => {
        setTimeout(() => {
          FileViewer.open(localFile, {
            showOpenWithDialog: true,
            showAppsSuggestions: true,
          });
        }, 500);
      });
    } catch (error) {}
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPreview()}>
      {!isLeft && svgIcon.FileType}

      <View style={styles.details}>
        <Text style={styles.fileName(isLeft)}>
          {message_attachment?.file_name ||
            getFileNameFromUrl(message_attachment?.url) ||
            'File'}
        </Text>
      </View>
      {isLeft && svgIcon.FileType}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 4,
  },
  details: {
    marginHorizontal: 4,
    maxWidth: '80%',
  },
  fileName: (isLeft: boolean) => ({
    fontSize: PFFontSize.FONT_SIZE_10,
    color: isLeft ? PFColors.Orange.Dark : PFColors.Standard.White,
    fontFamily: PFFonts.Foundation.Medium,
  }),
});

export default FileMessage;
