import React from 'react';
import {View, StyleSheet} from 'react-native';
import Video from 'react-native-video';

const VideoMessage = ({currentMessage, position}) => {
  const {message_attachment} = currentMessage;

  if (message_attachment) {
    return (
      <View style={styles.videoContainer}>
        <Video
          source={{uri: message_attachment?.url}}
          style={styles.video}
          controls={true}
          paused={true}
          repeat={false}
          muted={false}
          resizeMode="cover"
          fullscreen
        />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  videoContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
  },
  video: {
    width: 200,
    height: 250,
    // flexGrow: 1,
  },
});

export default VideoMessage;
