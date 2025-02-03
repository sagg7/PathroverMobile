import React from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';

// Custom render function for images in GiftedChat
const RenderMessageImage = props => {
  const {currentMessage} = props;

  console.log(
    '[RenderMessageImage:currentMessage.attachments]',
    currentMessage.sourceURL,
  );

  if (currentMessage.sourceURL) {
    return (
      <View style={styles.imageContainer}>
        {currentMessage.sourceURL.map((attachment, index) => (
          <Image
            key={index}
            source={{uri: attachment.sourceURL}}
            style={styles.imageStyle}
            resizeMode="cover"
          />
        ))}
      </View>
    );
  }
  return (
    <View>
      <Text>Image here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    padding: 5,
  },
  imageStyle: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
});

export default {RenderMessageImage};
