import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import {svgIcon} from '../../../../../assets/svg';
import {useNavigation} from '@react-navigation/native';
import {WP} from '../../../../../shared/exporter';

const VideoPlayer = ({route}) => {
  const {source} = route?.params;
  const navigation = useNavigation();
  console.log(source);

  return (
    <View style={styles.videoContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          zIndex: 1,
          top: WP('30'),
          left: 30,
          transform: [{scaleX: -1}],
        }}>
        {svgIcon.Forward}
      </TouchableOpacity>
      <Video
        source={{uri: source}}
        style={styles.video}
        controls={true}
        paused={true}
        repeat={false}
        muted={false}
        resizeMode="contain"
        fullscreen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default VideoPlayer;
