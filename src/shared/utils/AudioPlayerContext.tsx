// AudioPlayerContext.tsx
import React, { createContext, useContext, useRef, useState } from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioPlayer = new AudioRecorderPlayer();
audioPlayer.setSubscriptionDuration(0.09);

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState({
    url: null,
    isPlaying: false,
    duration: 0,
  });
  const trackStates = useRef({}); // Stores state for all tracks
  const playbackListener = useRef(null);

  // Clean up when component unmounts
  React.useEffect(() => {
    return () => {
      if (playbackListener.current) {
        audioPlayer.removePlayBackListener(playbackListener.current);
      }
      audioPlayer.stopPlayer();
    };
  }, []);

  const stopAudio = async () => {
    try {
      if (playbackListener.current) {
        audioPlayer.removePlayBackListener(playbackListener.current);
        playbackListener.current = null;
      }
      await audioPlayer.stopPlayer();
      setCurrentTrack(prev => ({ ...prev, isPlaying: false }));
    } catch (err) {
      console.warn('Error stopping audio:', err);
    }
  };

  const pauseAudio = async () => {
    try {
      const position = await audioPlayer.pausePlayer();
      if (currentTrack.url) {
        trackStates.current[currentTrack.url] = {
          ...trackStates.current[currentTrack.url],
          position,
          isPlaying: false,
        };
      }
      setCurrentTrack(prev => ({ ...prev, isPlaying: false }));
    } catch (err) {
      console.warn('Error pausing audio:', err);
    }
  };

  const playAudio = async (url, onProgress, onComplete) => {
    // If clicking on the same audio that's currently playing, pause it
    if (currentTrack.url === url && currentTrack.isPlaying) {
      await pauseAudio();
      return;
    }

    // If clicking on the same audio that's paused, resume it
    if (currentTrack.url === url && !currentTrack.isPlaying) {
      await resumeAudio(url, onProgress, onComplete);
      return;
    }

    // If switching to a different audio
    if (currentTrack.url && currentTrack.url !== url) {
      await stopAudio();
    }

    try {
      // Start the player
      await audioPlayer.startPlayer(url);
      await audioPlayer.setVolume(1.0);

      // Check if we have a saved position for this track
      const savedState = trackStates.current[url] || {};
      const seekPosition = savedState.position || 0;

      if (seekPosition > 0) {
        await audioPlayer.seekToPlayer(seekPosition);
      }

      // Update current track
      setCurrentTrack({
        url,
        isPlaying: true,
        duration: savedState.duration || 0,
      });

      // Store the initial state
      if (!trackStates.current[url]) {
        trackStates.current[url] = {
          position: 0,
          isPlaying: true,
          duration: 0,
        };
      }

      // Remove any existing listener
      if (playbackListener.current) {
        audioPlayer.removePlayBackListener(playbackListener.current);
      }

      // Add new playback listener
      playbackListener.current = audioPlayer.addPlayBackListener(e => {
        // Update the track's current position
        if (url === currentTrack.url) {
          trackStates.current[url] = {
            ...trackStates.current[url],
            position: e.currentPosition,
            duration: e.duration,
          };
        }

        onProgress(e);

        if (e.currentPosition >= e.duration) {
          // Reset position when track completes
          trackStates.current[url] = {
            ...trackStates.current[url],
            position: 0,
            isPlaying: false,
          };
          stopAudio();
          onComplete();
        }
      });
    } catch (err) {
      console.warn('Error playing audio:', err);
    }
  };

  const resumeAudio = async (url, onProgress, onComplete) => {
    try {
      const savedState = trackStates.current[url] || {};
      const seekPosition = savedState.position || 0;

      await audioPlayer.resumePlayer();
      
      if (seekPosition > 0) {
        await audioPlayer.seekToPlayer(seekPosition);
      }

      setCurrentTrack({
        url,
        isPlaying: true,
        duration: savedState.duration || 0,
      });

      // Remove any existing listener
      if (playbackListener.current) {
        audioPlayer.removePlayBackListener(playbackListener.current);
      }

      // Add new playback listener
      playbackListener.current = audioPlayer.addPlayBackListener(e => {
        // Update the track's current position
        trackStates.current[url] = {
          ...trackStates.current[url],
          position: e.currentPosition,
          duration: e.duration,
        };

        onProgress(e);

        if (e.currentPosition >= e.duration) {
          // Reset position when track completes
          trackStates.current[url] = {
            ...trackStates.current[url],
            position: 0,
            isPlaying: false,
          };
          stopAudio();
          onComplete();
        }
      });
    } catch (err) {
      console.warn('Error resuming audio:', err);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        playAudio,
        pauseAudio,
        stopAudio,
        isPlaying: currentTrack.isPlaying,
        currentPlayingUrl: currentTrack.url,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);

// // AudioPlayerContext.tsx
// import React, {createContext, useContext, useRef, useState} from 'react';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// const audioPlayer = new AudioRecorderPlayer();
// audioPlayer.setSubscriptionDuration(0.09);

// const AudioPlayerContext = createContext();

// export const AudioPlayerProvider = ({children}) => {
//   const [currentPlayingUrl, setCurrentPlayingUrl] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [pausedPosition, setPausedPosition] = useState(0);
//   const playbackListener = useRef<any>(null);

//   const stopAudio = async () => {
//     try {
//       await audioPlayer.stopPlayer();
//       audioPlayer.removePlayBackListener();
//       setIsPlaying(false);
//       setCurrentPlayingUrl(null);
//       setPausedPosition(0);
//     } catch (err) {
//       console.warn('Error stopping audio:', err);
//     }
//   };

//   const pauseAudio = async () => {
//     try {
//       const pos = await audioPlayer.pausePlayer();
//       setPausedPosition(pos); // Ensure pausedPosition is updated when paused
//       setIsPlaying(false);
//     } catch (err) {
//       console.warn('Error pausing audio:', err);
//     }
//   };

//   const resumeAudio = async (onProgress, onComplete) => {
//     try {
//       if (pausedPosition > 0) {
//         await audioPlayer.seekToPlayer(pausedPosition); // Seek first before resuming
//       }
//       await audioPlayer.resumePlayer(); // Now resume the audio
//       setIsPlaying(true);

//       playbackListener.current = audioPlayer.addPlayBackListener(e => {
//         onProgress(e);
//         if (e.currentPosition >= e.duration) {
//           stopAudio();
//           onComplete();
//         }
//       });
//     } catch (err) {
//       console.warn('Error resuming audio:', err);
//     }
//   };

//   const playAudio = async (url, onProgress, onComplete) => {
//     // If clicking on the same audio and it's paused, resume
//     if (currentPlayingUrl === url && pausedPosition > 0) {
//       await resumeAudio(onProgress, onComplete);
//       return;
//     }

//     // Otherwise stop any audio and start fresh
//     if (currentPlayingUrl && currentPlayingUrl !== url) {
//       await stopAudio();
//     }

//     try {
//       await audioPlayer.startPlayer(url);
//       await audioPlayer.setVolume(1.0);
//       setCurrentPlayingUrl(url);
//       setIsPlaying(true);
//       setPausedPosition(0);

//       playbackListener.current = audioPlayer.addPlayBackListener(e => {
//         onProgress(e);
//         if (e.currentPosition >= e.duration) {
//           stopAudio();
//           onComplete();
//         }
//       });

//       if (pausedPosition > 0) {
//         await audioPlayer.seekToPlayer(pausedPosition);
//       }
//     } catch (err) {
//       console.warn('Error playing audio:', err);
//     }
//   };

//   return (
//     <AudioPlayerContext.Provider
//       value={{
//         playAudio,
//         pauseAudio,
//         stopAudio,
//         isPlaying,
//         currentPlayingUrl,
//       }}>
//       {children}
//     </AudioPlayerContext.Provider>
//   );
// };

// export const useAudioPlayer = () => useContext(AudioPlayerContext);
