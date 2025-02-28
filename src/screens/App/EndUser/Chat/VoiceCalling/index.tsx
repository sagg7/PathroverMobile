import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, PermissionsAndroid, Platform} from 'react-native';
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
import { formatTime } from '../../../../../helpers/getFormatTime';
import proximity, { SubscriptionRef } from 'rn-proximity-sensor';

const appId = AGORA_KEY;

const VoiceCalling = () => {
  const {params} = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const agoraEngineRef = useRef<IRtcEngine>(); // IRtcEngine instance
  const eventHandler = useRef<IRtcEngineEventHandler>();
  const sensorSubscriptionRef = useRef<SubscriptionRef | null>(null);
  const startTimeRef = useRef(null); // Ref to store the start time
  const timerIntervalRef = useRef(null); // Ref to store the interval ID

  const [controls, setControls] = useState({
    isJoined: false,
    remoteUid: 0,
    isMuted: false,
    isSpeakerOn: false,
    channel: '',
    elapsedTime: 0,
    isNear: false,
  });

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
      setControls(prev => ({...prev, elapsedTime: now - startTimeRef.current}));
    }, 1000); // Update every second
  };

  // Function to stop the timer
  const stopTimer = () => {
    clearInterval(timerIntervalRef.current); // Stop the interval
  };

  useEffect(() => {
    const init = async () => {
      await setupVoiceSDKEngine();
      setupEventHandler();
      join();
    };
    if (isFocused) {
      setControls(prev => ({...prev, elapsedTime: 0}));
      init();
    }
    return () => {
      cleanupAgoraEngine(); // Ensure this is synchronous
    };
  }, [isFocused]); // Empty dependency array ensures it runs only once

  useEffect(() => {
    const backAction = () => {
       return true; // Block the back button
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);
  
  useEffect(() => {
    sensorSubscriptionRef.current = proximity.subscribe((values) => {
          if (values.distance > 4) {
            setControls(prev => ({...prev, isNear: false}))
            
          } else {
            setControls(prev => ({...prev, isNear: true}))
          }
    });

    return () => {
      if (sensorSubscriptionRef.current) {
        sensorSubscriptionRef.current.unsubscribe();
        sensorSubscriptionRef.current = null;
      }
    };
    }, []);

  const setupEventHandler = () => {
    eventHandler.current = {
      onJoinChannelSuccess: () => {
        setControls(prev => ({...prev, isJoined: true}));
      },
      onUserJoined: (_connection: RtcConnection, uid: number) => {
        setControls(prev => ({...prev, remoteUid: uid}));
        startTimer();
      },
      onUserOffline: (_connection: RtcConnection, uid: number) => {
        setControls(prev => ({...prev, remoteUid: uid}));
        stopTimer();
        setTimeout(() => {
          leave();
        }, 1500);
      },
      onConnectionStateChanged: (_connection: RtcConnection, state, reason) => {
        if (state === 1 || state === 5) {
          stopTimer();
        }
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
    if (controls.isJoined) {
      return;
    }
    const channelName = params?.channel ? params?.channel : 'call_501222'; // Added user id to track specific user calls
    //   : `call_${loginUser?.id}_${uuid.v4()}`; // Added user id to track specific user calls
    setControls(prev => ({...prev, channel: channelName}));
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
      setControls(prev => ({...prev, isJoined: true}));
      agoraEngineRef.current?.enableLocalAudio(true);
    } catch (e) {
      //
    }
  };

  const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();

      setControls(prev => ({...prev, remoteUid: 0, isJoined: false}));
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
    const hasMuted = !controls.isMuted;
    setControls(prev => ({...prev, isMuted: hasMuted}));
    agoraEngineRef.current?.muteLocalAudioStream(hasMuted);
  };

  // Toggle Speaker Volume
  const toggleSpeaker = () => {
    const newSpeakerState = !controls.isSpeakerOn;
    agoraEngineRef.current?.setEnableSpeakerphone(newSpeakerState);
    setControls(prev => ({...prev, isSpeakerOn: newSpeakerState}));
  };

  return (
    <CallScreen
      onPressLeave={() => leave()}
      isMute={controls.isMuted}
      isSpeakerOn={controls.isSpeakerOn}
      timer={formatTime(controls.elapsedTime)}
      onPressMute={() => mute()}
      onPressSpeaker={() => toggleSpeaker()}
      user={params?.user}
      isNear={controls.isNear}
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
