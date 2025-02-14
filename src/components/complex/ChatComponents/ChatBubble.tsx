import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import moment from 'moment';
import Modal from 'react-native-modal';
import FitImage from 'react-native-fit-image';
import {PFColors, PFFonts, PFFontSize, scale} from '../../../shared/exporter';

const ChatBubble = ({props}) => {
  const {currentMessage, position} = props;
  const isLeft = position === 'left';

  const {content, created_at, image, message_attachment, text} = currentMessage;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const handleImagePress = image => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(!modalVisible);
  };

  const renderTextWithUrls = text => {
    const parts = text?.split(urlRegex);
    return parts?.map((part, index) =>
      urlRegex?.test(part) ? (
        <Text
          onPress={() => Linking.openURL(part)}
          style={[
            styles.url,
            ,
            isLeft ? styles.leftMessageText : styles.rightMessageText,
            {opacity: 0.8},
          ]}>
          {part}
        </Text>
      ) : (
        <Text
          key={index}
          style={[
            styles.messageText,
            isLeft ? styles.leftMessageText : styles.rightMessageText,
          ]}>
          {part}
        </Text>
      ),
    );
  };

  return (
    <View style={styles.main}>
      <Text style={[styles.time, isLeft ? styles.leftTime : styles.rightTime]}>
        {moment(created_at).format('hh:mm A')}
      </Text>

      <View
        style={[
          styles.bubbleContainer,
          isLeft ? styles.leftBubble : styles.rightBubble,
        ]}>
        {(image || message_attachment) && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleImagePress(message_attachment?.url)}>
            <Text style={styles.imageTime}>
              {moment(created_at).format('hh:mm a')}
            </Text>
            <FitImage
              indicatorColor={
                isLeft ? PFColors.Standard.Black : PFColors.Standard.White
              }
              indicatorSize={'small'}
              source={{uri: image?.sourceURL ?? message_attachment?.url}}
              style={{
                width: scale(90),
                height: scale(90),
                borderRadius: 3,
                overflow: 'hidden',
              }}
            />
          </TouchableOpacity>
        )}
        <View
          style={[
            styles.messageWrapper,
            content?.length > 30 || text?.length > 30
              ? styles.columnDirection
              : styles.rowDirection,
          ]}>
          {(content || text) && (
            <>
              <Text
                style={[
                  styles.messageText,
                  isLeft ? styles.leftMessageText : styles.rightMessageText,
                ]}>
                {renderTextWithUrls(content || text)}
              </Text>
              <View style={{width: 10}} />
            </>
          )}
        </View>
      </View>
      <Modal
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        transparent={true}
        isVisible={modalVisible}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
        style={styles.modalContainer}>
        <Image
          //   indicatorColor={config.colors.white}
          indicatorSize={'small'}
          source={{uri: selectedImage}}
          style={styles.fullImageStyle}
          resizeMode="contain"
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: '100%',
  },
  bubbleContainer: {
    maxWidth: '75%',
    marginVertical: 5,
    padding: 9,
    borderRadius: 8,
  },
  leftBubble: {
    alignSelf: 'flex-start',
    backgroundColor: PFColors.Orange.Soft,
  },
  rightBubble: {
    alignSelf: 'flex-end',
    backgroundColor: PFColors.Blue.Dark,
  },
  messageWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowDirection: {
    flexDirection: 'row',
  },
  columnDirection: {
    flexDirection: 'column',
  },
  messageText: {
    fontSize: PFFontSize.FONT_SIZE_10,
    fontFamily: PFFonts.Foundation.Regular,
    marginBottom: 3,
  },
  leftMessageText: {
    color: PFColors.Standard.Black,
  },
  rightMessageText: {
    color: PFColors.Standard.White,
  },
  time: {
    fontSize: PFFontSize.FONT_SIZE_8,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Medium,
  },
  imageTime: {
    fontSize: PFFontSize.FONT_SIZE_8,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Medium,
    position: 'absolute',
    zIndex: 1,
    right: 5,
    bottom: 5,
  },
  leftTime: {
    fontSize: PFFontSize.FONT_SIZE_8,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Medium,
  },
  rightTime: {
    fontSize: PFFontSize.FONT_SIZE_8,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Medium,
    alignSelf: 'flex-end',
  },
  modalContainer: {
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  fullScreenImage: {
    width: 80,
    height: 80,
  },
  fullImageStyle: {
    width: 300,
    height: 300,
  },
  url: {
    fontSize: PFFontSize.FONT_SIZE_10,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Medium,
    textDecorationLine: 'underline',
  },
});

export {ChatBubble};
