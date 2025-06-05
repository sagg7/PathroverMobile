import React from 'react';
import {Text, View} from 'react-native';
import styles from './styles';
import {useSelector} from 'react-redux';
import Video from 'react-native-video';

const VideoScreen = () => {
  const {selectedCustomTrail} = useSelector(
    (state: any) => state?.endUser?.trailRoute,
  );

  return (
    <View style={styles.container}>
      {selectedCustomTrail?.video ? (
        <Video
          source={{uri: selectedCustomTrail?.video}}
          style={styles.video}
          controls={true}
          paused={true}
          repeat={false}
          muted={false}
          resizeMode="contain"
          // fullscreen
        />
      ) : (
        <Text style={styles.noFound}>No Video Found</Text>
      )}
    </View>
  );
};

export default VideoScreen;
