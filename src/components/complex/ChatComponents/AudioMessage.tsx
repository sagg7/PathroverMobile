import React, {useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';
import {useAudioPlayer} from '../../../shared/utils/AudioPlayerContext';

const AudioMessage = ({currentMessage, position}) => {
  const {message_attachment} = currentMessage;
  const isLeft = position === 'left';
  const audioPath =
    Platform.OS === 'android'
      ? message_attachment?.url?.replace('.m4a', '.mp3')
      : message_attachment?.url;

  const [duration, setDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);

  const {playAudio, pauseAudio, isPlaying, currentPlayingUrl} =
    useAudioPlayer();
  const isThisPlaying = isPlaying && currentPlayingUrl === audioPath;

  const handlePlayPause = () => {
    if (isThisPlaying) {
      pauseAudio(); // Pause instead of stop
    } else {
      playAudio(
        audioPath,
        e => {
          setCurrentPosition(e.currentPosition);
          setDuration(e.duration);
        },
        () => {
          setCurrentPosition(0);
        },
      );
    }
  };

  const progress = (currentPosition / duration) * 100 || 0;

  return (
    <View style={styles.audioContainer(isLeft)}>
      {!isLeft && (
        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
          {isThisPlaying ? svgIcon.StopIcon : svgIcon.RecordIcon}
        </TouchableOpacity>
      )}

      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer(isLeft)}>
          <View style={[styles.progressBar(isLeft), {width: `${progress}%`}]} />
        </View>
        <Text style={styles.audioDuration(isLeft)}>
          {formatTime(currentPosition)} / {formatTime(duration)}
        </Text>
      </View>

      {isLeft && (
        <TouchableOpacity
          onPress={handlePlayPause}
          style={styles.playButtonLeft}>
          {isThisPlaying ? svgIcon.OrangeStopIcon : svgIcon.OrangeRecordIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const formatTime = (millis: number) => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
  audioContainer: (isLeft: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: PFColors.Standard.White,
    borderRadius: 15,
    width: '80%',
    justifyContent: 'center',
  }),
  playButton: {
    backgroundColor: PFColors.Blue.SoftGlacier,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  playButtonLeft: {
    backgroundColor: PFColors.Orange.Soft,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 14,
  },
  progressBarContainer: (isLeft: boolean) => ({
    height: 4,
    backgroundColor: isLeft ? PFColors.Orange.Light : PFColors.Blue.SoftSkyBlue,
    borderRadius: 2,
    overflow: 'hidden',
  }),
  progressBar: (isLeft: boolean) => ({
    height: '100%',
    backgroundColor: isLeft ? PFColors.Orange.Dark : PFColors.Blue.Dark,
    borderRadius: 2,
  }),
  audioDuration: (isLeft: boolean) => ({
    color: isLeft ? PFColors.Orange.Dark : PFColors.Blue.Dark,
    fontSize: PFFontSize.FONT_SIZE_8,
    fontFamily: PFFonts.Foundation.Medium,
    marginTop: 4,
    alignSelf: isLeft ? 'flex-start' : 'flex-end',
  }),
});

export default AudioMessage;
