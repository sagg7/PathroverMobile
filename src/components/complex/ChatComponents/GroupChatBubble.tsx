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
import {
  appImages,
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
} from '../../../shared/exporter';
import {identifyAttachmentTypeFromUrl} from '../../../helpers/getAttachmentType';
import AudioMessage from './AudioMessage';
import VideoMessage from './VideoMessage';
import FileMessage from './FileMessage';

const THRESHOLD = 60 * 1000;

const getShowTime = (currentMessage, nextMessage) => {
  if (!nextMessage) {
    return true;
  }

  if (currentMessage?.user?._id !== nextMessage?.user?._id) {
    return true;
  }

  const currentTime = new Date(currentMessage.created_at).getTime();
  const nextTime = new Date(nextMessage.created_at).getTime();

  return nextTime - currentTime > THRESHOLD;
};

const GroupChatBubble = ({props}) => {
  const {currentMessage, position, previousMessage, nextMessage} = props;
  const isLeft = position === 'left';
  const {content, created_at, image, message_attachment, text, user} =
    currentMessage;
  const {avatar, name} = user;
  const fileType =
    message_attachment &&
    identifyAttachmentTypeFromUrl(message_attachment?.url);

  // const showAvatar =
  //   !previousMessage ||
  //   currentMessage?.user?._id !== previousMessage?.user?._id;

  const showAvatar =
    !previousMessage ||
    currentMessage?.user?._id !== previousMessage?.user?._id ||
    !moment(currentMessage?.created_at).isSame(
      previousMessage?.created_at,
      'day',
    );

  const showTime = getShowTime(currentMessage, nextMessage);

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
      {showAvatar &&
        (isLeft ? (
          <View style={styles.userViewLeft}>
            <Image
              source={avatar ? {uri: avatar} : appImages.userPlaceholder}
              style={styles.userIconStyle}
            />
            <Text style={styles.userNameText}>{name}</Text>
          </View>
        ) : (
          <View style={styles.userViewRight}>
            <Text style={styles.userNameText}>{name}</Text>
            <Image
              source={avatar ? {uri: avatar} : appImages.userPlaceholder}
              style={styles.userIconStyle}
            />
          </View>
        ))}

      <View
        style={[
          styles.bubbleContainer,
          isLeft ? styles.leftBubble : styles.rightBubble,
        ]}>
        {(image || fileType === 'image') && (
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
        {fileType === 'audio' && (
          <AudioMessage currentMessage={currentMessage} position={position} />
        )}
        {fileType === 'video' && (
          <VideoMessage currentMessage={currentMessage} position={position} />
        )}
        {fileType === 'document' && (
          <FileMessage currentMessage={currentMessage} position={position} />
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
      {showTime && (
        <Text
          style={[styles.time, isLeft ? styles.leftTime : styles.rightTime]}>
          {moment(created_at).format('hh:mm A')}
        </Text>
      )}

      <Modal
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        isVisible={modalVisible}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
        style={styles.modalContainer}>
        <TouchableOpacity onPress={onClose} style={styles.imageStyle}>
          <Image
            source={{uri: selectedImage}}
            style={styles.fullImageStyle}
            resizeMode="contain"
          />
        </TouchableOpacity>
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
    marginVertical: 1,
    padding: 9,
    borderRadius: 8,
  },
  leftBubble: {
    alignSelf: 'flex-start',
    backgroundColor: PFColors.Orange.Soft,
    marginLeft: 25,
  },
  rightBubble: {
    alignSelf: 'flex-end',
    backgroundColor: PFColors.Blue.Dark,
    marginRight: 25,
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
    fontSize: PFFontSize.FONT_SIZE_12,
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
    marginHorizontal: 27,
    marginBottom: 3,
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
    width: '96%',
    flexGrow: 1,
    alignSelf: 'center',
  },
  imageStyle: {
    flex: 1,
    width: '100%',
  },
  url: {
    fontSize: PFFontSize.FONT_SIZE_10,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Medium,
    textDecorationLine: 'underline',
  },
  userIconStyle: {
    height: 22,
    width: 22,
    borderRadius: 22,
    backgroundColor: PFColors.Gray.LightMist,
  },
  userViewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  userViewRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  userNameText: {
    fontSize: PFFontSize.FONT_SIZE_10,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
    marginHorizontal: 6,
  },
});

export {GroupChatBubble};
