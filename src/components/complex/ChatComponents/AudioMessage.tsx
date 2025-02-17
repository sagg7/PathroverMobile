import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioMessage = ({currentMessage, position}) => {
  const {message_attachment} = currentMessage;
  const isLeft = position === 'left';

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);

  const onStartPlay = async () => {
    const audioPath = message_attachment?.url;
    console.log('Audio Path:', audioPath); 
    if (!audioPath) {
      console.error('Audio path is missing');
      return;
    }

    try {
      await audioRecorderPlayer.startPlayer(audioPath);
      console.log('Audio playback started');
      audioRecorderPlayer.addPlayBackListener(e => {
        setCurrentPosition(e.currentPosition);
        setDuration(e.duration);
        if (e.currentPosition === e.duration) {
          setIsPlaying(false);
        }
      });
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error); 
    }
  };

  const onStopPlay = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
      console.log('Audio playback stopped'); 
    } catch (error) {
      console.error('Error stopping audio:', error); 
    }
  };

  const progress = (currentPosition / duration) * 100 || 0;

  return (
    <View style={styles.audioContainer(isLeft)}>
      {!isLeft && (
        <TouchableOpacity
          onPress={isPlaying ? onStopPlay : onStartPlay}
          style={styles.playButton}>
          {isPlaying ? svgIcon.StopIcon : svgIcon.RecordIcon}
        </TouchableOpacity>
      )}

      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer(isLeft)}>
          <View style={[styles.progressBar(isLeft), {width: `${progress}%`}]} />
        </View>
        <Text style={styles.audioDuration(isLeft)}>
          {audioRecorderPlayer.mmss(Math.floor(currentPosition / 1000))} /{' '}
          {audioRecorderPlayer.mmss(Math.floor(duration / 1000))}
        </Text>
      </View>
      {isLeft && (
        <TouchableOpacity
          onPress={isPlaying ? onStopPlay : onStartPlay}
          style={styles.playButtonLeft}>
          {isPlaying ? svgIcon.OrangeStopIcon : svgIcon.OrangeRecordIcon}
        </TouchableOpacity>
      )}
    </View>
  );
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
