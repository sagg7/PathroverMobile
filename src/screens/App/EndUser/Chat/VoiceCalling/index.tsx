import React, {useEffect, useRef, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
// import uuid from 'react-native-uuid';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  IRtcEngineEventHandler,
  RtcConnection,
} from 'react-native-agora';
import {useSelector} from 'react-redux';
import {
  useCreateCallMutation,
  useLazyGetAgoraTokenQuery,
  useUpdateCallMutation,
} from '../../../../../redux/chat/chatApiSlice';
import CallScreen from '../CallScreen';
import {AGORA_KEY} from '../../../../../shared/utils/constant';

const appId = AGORA_KEY;

const VoiceCalling = () => {
  const {params} = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const agoraEngineRef = useRef<IRtcEngine>(); // IRtcEngine instance
  const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [isMuted, setIsMuted] = useState(false); // Set mute status
  const [isSpeakerOn, setIsSpeakerOn] = useState(false); // Set speaker status
  const [channel, setChannel] = useState('');
  const eventHandler = useRef<IRtcEngineEventHandler>(); // Implement callback functions

  // Calculate call time
  const [elapsedTime, setElapsedTime] = useState(0); // State to store elapsed time
  const startTimeRef = useRef(null); // Ref to store the start time
  const timerIntervalRef = useRef(null); // Ref to store the interval ID

  // APIs
  const [fetchAgoraToken, {isLoading}] = useLazyGetAgoraTokenQuery(undefined);
  const [createCall, {data}] = useCreateCallMutation();
  const [updateCall] = useUpdateCallMutation();

  const {loginUser} = useSelector((state: any) => state?.auth);

  // Function to start the timer
  const startTimer = () => {
    startTimeRef.current = Date.now(); // Record the start time
    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      setElapsedTime(now - startTimeRef.current); // Update elapsed time
    }, 1000); // Update every second
  };

  // Function to format time in hh:mm:ss
  const formatTime = milliseconds => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Pad with leading zeros
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(seconds).padStart(2, '0')}`;
  };

  // Function to stop the timer
  const stopTimer = () => {
    clearInterval(timerIntervalRef.current); // Stop the interval
    // setElapsedTime(0); // Reset elapsed time
  };

  // Store State

  useEffect(() => {
    const init = async () => {
      await setupVoiceSDKEngine();
      setupEventHandler();
      join();
    };
    if (isFocused) {
      setElapsedTime(0);
      init();
    }
    return () => {
      cleanupAgoraEngine(); // Ensure this is synchronous
    };
  }, [isFocused]); // Empty dependency array ensures it runs only once

  const setupEventHandler = () => {
    eventHandler.current = {
      onJoinChannelSuccess: () => {
        setIsJoined(true);
      },
      onUserJoined: (_connection: RtcConnection, uid: number) => {
        setRemoteUid(uid);
        startTimer();
      },
      onUserOffline: (_connection: RtcConnection, uid: number) => {
        setRemoteUid(uid);
        stopTimer();
        setTimeout(() => {
          leave();
        }, 1500);
      },
      onRejoinChannelSuccess: (_connection: RtcConnection, elapsed) => {
        //
      },
      onConnectionStateChanged: (_connection: RtcConnection, state, reason) => {
        if (state === 1 || state === 5) {
          stopTimer();
        }
      },
      onLeaveChannel: (_connection: RtcConnection, stats) => {
        //
      },
      onUserStateChanged: (_connection: RtcConnection, remoteUid, state) => {
        //
      },
    };
    agoraEngineRef.current?.registerEventHandler(eventHandler.current);
  };

  const setupVoiceSDKEngine = async () => {
    try {
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      agoraEngine.initialize({appId: appId});
      agoraEngine.setChannelProfile(
        ChannelProfileType.ChannelProfileCommunication,
      );
      agoraEngine.setClientRole(
        params?.channel
          ? ClientRoleType.ClientRoleAudience
          : ClientRoleType.ClientRoleBroadcaster,
      );
    } catch (e) {
      //
    }
  };

  const callInitiated = async (channelName: string) => {
    try {
      const obj = {
        call: {
          call_type: 'audio_call',
          call_mode: 'private_call',
          channel_name: channelName,
          receiver_id: params?.user?.id,
        },
      };

      await createCall(obj);
    } catch (error) {
      //
    }
  };

  const updateCallStatus = async () => {
    try {
      const obj = {
        status: 'ended',
        id: data?.call_log?.id,
      };

      await updateCall(obj);
    } catch (error) {
      //
    }
  };

  const join = async () => {
    if (isJoined) {
      return;
    }
    const channelName = params?.channel ? params?.channel : 'call_501222'; // Added user id to track specific user calls
    //   : `call_${loginUser?.id}_${uuid.v4()}`; // Added user id to track specific user calls
    setChannel(channelName);
    if (!params?.channel) {
      callInitiated(channelName);
    }

    const res = await fetchAgoraToken(channelName);
    const token = res?.data?.data?.token;
    try {
      // Join the channel as a broadcaster
      agoraEngineRef.current?.joinChannel(token, channelName, 0, {
        // Set channel profile to live broadcast
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
        // Set user role to broadcaster
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        // Publish audio collected by the microphone
        publishMicrophoneTrack: true,
        // Automatically subscribe to all audio streams
        autoSubscribeAudio: true,
      });
      setIsJoined(true);
      agoraEngineRef.current?.enableLocalAudio(true);
    } catch (e) {
      //
    }
  };

  // Define the leave method called after clicking the leave channel button
  const leave = () => {
    try {
      // Call leaveChannel method to leave the channel
      agoraEngineRef.current?.leaveChannel();

      setRemoteUid(0);
      setIsJoined(false);
      updateCallStatus();
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  const cleanupAgoraEngine = () => {
    return () => {
      agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
      agoraEngineRef.current?.release();
    };
  };

  // const increaseVolume = () => {
  //   if (volume !== 100) {
  //     setVolume(volume + 5);
  //   }
  //   agoraEngineRef.current?.adjustRecordingSignalVolume(volume);
  // };

  // const decreaseVolume = () => {
  //   if (volume !== 0) {
  //     setVolume(volume - 5);
  //   }
  //   agoraEngineRef.current?.adjustRecordingSignalVolume(volume);
  // };

  // Toggle publishing the local audio stream
  const mute = () => {
    const hasMuted = !isMuted;
    setIsMuted(hasMuted);
    agoraEngineRef.current?.muteLocalAudioStream(hasMuted);
  };

  // Toggle subscribing to the audio stream of the remote user
  const muteRemoteUser = () => {
    const hasMuted = !isMuted;
    setIsMuted(hasMuted);
    agoraEngineRef.current?.muteRemoteAudioStream(remoteUid, hasMuted);
  };

  // Toggle Speaker Volume
  const toggleSpeaker = () => {
    const newSpeakerState = !isSpeakerOn;
    agoraEngineRef.current?.setEnableSpeakerphone(newSpeakerState);
    setIsSpeakerOn(newSpeakerState);
  };

  return (
    <CallScreen
      onPressLeave={() => leave()}
      isMute={isMuted}
      isSpeakerOn={isSpeakerOn}
      timer={formatTime(elapsedTime)}
      onPressMute={() => mute()}
      onPressSpeaker={() => toggleSpeaker()}
      user={params?.user}
    />
  );
};

const getPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};

export default VoiceCalling;
