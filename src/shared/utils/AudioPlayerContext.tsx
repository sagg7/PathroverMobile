// AudioPlayerContext.tsx
import React, {createContext, useContext, useRef, useState} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioPlayer = new AudioRecorderPlayer();
audioPlayer.setSubscriptionDuration(0.09);

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({children}) => {
  const [currentPlayingUrl, setCurrentPlayingUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pausedPosition, setPausedPosition] = useState(0);
  const playbackListener = useRef<any>(null);

  const stopAudio = async () => {
    try {
      await audioPlayer.stopPlayer();
      audioPlayer.removePlayBackListener();
      setIsPlaying(false);
      setCurrentPlayingUrl(null);
      setPausedPosition(0);
    } catch (err) {
      console.warn('Error stopping audio:', err);
    }
  };

  const pauseAudio = async () => {
    try {
      const pos = await audioPlayer.pausePlayer();
      setPausedPosition(pos); // Ensure pausedPosition is updated when paused
      setIsPlaying(false);
    } catch (err) {
      console.warn('Error pausing audio:', err);
    }
  };

  const resumeAudio = async (onProgress, onComplete) => {
    try {
      if (pausedPosition > 0) {
        await audioPlayer.seekToPlayer(pausedPosition); // Seek first before resuming
      }
      await audioPlayer.resumePlayer(); // Now resume the audio
      setIsPlaying(true);

      playbackListener.current = audioPlayer.addPlayBackListener(e => {
        onProgress(e);
        if (e.currentPosition >= e.duration) {
          stopAudio();
          onComplete();
        }
      });
    } catch (err) {
      console.warn('Error resuming audio:', err);
    }
  };

  const playAudio = async (url, onProgress, onComplete) => {
    // If clicking on the same audio and it's paused, resume
    if (currentPlayingUrl === url && pausedPosition > 0) {
      await resumeAudio(onProgress, onComplete);
      return;
    }

    // Otherwise stop any audio and start fresh
    if (currentPlayingUrl && currentPlayingUrl !== url) {
      await stopAudio();
    }

    try {
      await audioPlayer.startPlayer(url);
      await audioPlayer.setVolume(1.0);
      setCurrentPlayingUrl(url);
      setIsPlaying(true);
      setPausedPosition(0);

      playbackListener.current = audioPlayer.addPlayBackListener(e => {
        onProgress(e);
        if (e.currentPosition >= e.duration) {
          stopAudio();
          onComplete();
        }
      });

      if (pausedPosition > 0) {
        await audioPlayer.seekToPlayer(pausedPosition);
      }
    } catch (err) {
      console.warn('Error playing audio:', err);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        playAudio,
        pauseAudio,
        stopAudio,
        isPlaying,
        currentPlayingUrl,
      }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
