import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, PermissionsAndroid, Platform } from 'react-native';
import uuid from 'react-native-uuid';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  IRtcEngineEventHandler,
  RtcConnection,
} from 'react-native-agora';
import { useSelector } from 'react-redux';
import {
  useCreateCallMutation,
  useLazyGetAgoraTokenQuery,
  useUpdateCallMutation,
} from '../../../../../redux/chat/chatApiSlice';
import CallScreen from '../CallScreen';
import { AGORA_KEY, REQ_LIST_SOCKET_URL } from '../../../../../shared/utils/constant';
import { formatTime } from '../../../../../helpers/getFormatTime';
import proximity, { SubscriptionRef } from 'rn-proximity-sensor';
import { useActionCable } from '../../../../../hooks/socket/useActionCable';
import { useChannel } from '../../../../../hooks/socket/useChannel';
import { clearAllCallNotifications } from '../../../../../hooks/NotificationHook';

const appId = AGORA_KEY;

const VoiceCalling = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { loginUser, accessToken } = useSelector(state => state.auth);
  const token = accessToken?.replace('Bearer ', '');
  const { actionCable } = useActionCable(REQ_LIST_SOCKET_URL, token);
  const { subscribe, unsubscribe } = useChannel(actionCable);

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
    call_data: {},
    status: null,
  });

  // APIs
  const [fetchAgoraToken] = useLazyGetAgoraTokenQuery(undefined);
  const [createCall, { data, isLoading }] = useCreateCallMutation();
  const [updateCall, { error }] = useUpdateCallMutation();


  // Function to start the timer
  const startTimer = () => {
    startTimeRef.current = Date.now(); // Record the start time
    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      setControls(prev => ({ ...prev, elapsedTime: now - startTimeRef.current }));
    }, 1000); // Update every second
  };

  // Function to stop the timer
  const stopTimer = () => {
    clearInterval(timerIntervalRef.current); // Stop the interval
  };

  useEffect(() => {
    const handleSubscribe = async () => {
      try {
        // console.log('data---------outside-->>>>>>>>>>>>>>', controls.call_data);
        if (controls.call_data?.call_log?.id) {
          // console.log('data----------->>>>>>>>>>>>>>', controls.call_data);
          // console.log('params----------->>>>>>>>>>>>>>',params);
          subscribe(
            {
              channel: 'CallChannel',
              user_call_id: params?.channel ? params?.id : controls.call_data?.call_log?.id,
              // channel_key: controls.call_data?.call_log?.id,
              channel_key: `call_channel_${params?.channel ? params?.id : controls.call_data?.call_log?.id}`,
            },
            {
              received: res => {

                // console.log('res----CallChannel------->>>>>>>>>>>>>>', res);

                setControls(prev => ({ ...prev, status: res?.status }));
                checkCallStatus(res);
              },
              connected: () => {
                // console.log('connected-------call---->>>>>>>>>>>>>>', controls.call_data?.call_log?.id);
                // setIsConnected(true);
              },
              rejected: () => {
                // console.log('rejected-------call---->>>>>>>>>>>>>>');
                // setIsConnected(false);
              }
            },
          );
        }
      } catch (err) {
        // console.log('err--------subscribe--->>>>>>>>>>>>>>', err);
      }
    };

    handleSubscribe();

    return () => {
      // try {
      //   if (subscription) {
      unsubscribe(); // Make sure unsubscribe is available in scope
      // unsubscribe(subscription); // Make sure unsubscribe is available in scope
      // }
      // } catch (err) {
      //   console.log('err--------unsubscribe--->>>>>>>>>>>>>>', err);
      // }
    };
  }, [controls.call_data]); // Added checkCallStatus to dependencies

  useEffect(() => {
    const init = async () => {
      await setupVoiceSDKEngine();
      setupEventHandler();
      join();
    };
    if (isFocused) {
      setControls(prev => ({ ...prev, elapsedTime: 0 }));
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
    if (controls.status === 'ringing' && isFocused) {
      const timeoutId = setTimeout(() => {
        // console.log('onJoinChannelSuccess---1-minute-timeout-------->>>>>>>>>>>>>>', controls.status);
        if (controls.remoteUid === 0 && controls.call_data) {
          updateCallStatus('not_attended');
        }
      }, 60000); // 60,000ms = 1 minute

      return () => clearTimeout(timeoutId); // Cleanup on unmount
    }

  }, [controls.status]);

  useEffect(() => {
    sensorSubscriptionRef.current = proximity.subscribe((values) => {
      if (values.distance > 4) {
        setControls(prev => ({ ...prev, isNear: false }))

      } else {
        setControls(prev => ({ ...prev, isNear: true }))
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
        // console.log('onJoinChannelSuccess----------->>>>>>>>>>>>>>');
        setControls(prev => ({ ...prev, isJoined: true }));
      },
      onUserJoined: (_connection: RtcConnection, uid: number) => {
        setControls(prev => ({ ...prev, remoteUid: uid }));
        startTimer();
      },
      onUserOffline: (_connection: RtcConnection, uid: number) => {
        setControls(prev => ({ ...prev, remoteUid: uid }));
        stopTimer();
        setTimeout(() => {
          leave();
        }, 1500);
      },
      onConnectionStateChanged: (_connection: RtcConnection, state, _reason) => {
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
      agoraEngine.initialize({ appId: appId });
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

  const checkCallStatus = async (item) => {
    if (item?.status === 'declined' || item?.status === 'ended' || item?.status === 'not_attended' || item?.status === 'missed_call') {
      // console.log('checkCallStatus item----------->>>>>>>>>>>>>>', item);
      // leave();
      agoraEngineRef.current?.leaveChannel();

      setControls(prev => ({ ...prev, remoteUid: 0, isJoined: false }));
      navigation.pop();
      // navigation.goBack();
      clearAllCallNotifications();
    }
  }

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

      console.log('call obj----------->>>>>>>>>>>>>>', obj);

      const res = await createCall(obj);
      if (res?.data) {
        setControls(prev => ({ ...prev, call_data: res?.data, status: 'ringing' }));
      }

      // console.log('call res----------->>>>>>>>>>>>>>', data);
    } catch (error) {
      setControls(prev => ({ ...prev, call_data: {} }));
      // console.log('call error----------->>>>>>>>>>>>>>', error);
    }
  };

  const updateCallStatus = async (status) => {
    // console.log('controls.call_data', controls.call_data);

    try {
      const check = params?.channel ? params?.id : data?.call_log?.id ?? controls?.call_data?.call_log?.id;
      // console.log('checkCallStatus check----------->>>>>>>>>>>>>>', check);

      if (check) {
        const obj = {
          status: controls.status === 'ringing' ? status : 'ended',
          id: check,
          receiver_id: params?.user?.id,
        };

        // console.log('updateCallStatus obj---voice calling-------->>>>>>>>>>>>>>', obj);

        await updateCall(obj);
      }
    } catch (error) {
      //
    }
  };

  const join = async () => {
    if (controls.isJoined) {
      return;
    }
    const channelName = params?.channel ? params?.channel : `call_${loginUser?.id}_${uuid.v4()}`;

    setControls(prev => ({ ...prev, channel: channelName }));
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
      setControls(prev => ({ ...prev, isJoined: true }));
      agoraEngineRef.current?.enableLocalAudio(true);
    } catch (e) {
      //
      // console.log('error----------->>>>>>>>>>>>>>', e);
    }
  };

  const leave = () => {
    try {
      updateCallStatus('ended');
      agoraEngineRef.current?.leaveChannel();
      setControls(prev => ({ ...prev, remoteUid: 0, isJoined: false }));

      navigation.pop();
      // navigation.goBack();
    } catch (e) {
      console.error(e);
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
    setControls(prev => ({ ...prev, isMuted: hasMuted }));
    agoraEngineRef.current?.muteLocalAudioStream(hasMuted);
  };

  // Toggle Speaker Volume
  const toggleSpeaker = () => {
    const newSpeakerState = !controls.isSpeakerOn;
    agoraEngineRef.current?.setEnableSpeakerphone(newSpeakerState);
    setControls(prev => ({ ...prev, isSpeakerOn: newSpeakerState }));
  };

  return (
    <CallScreen
      onPressLeave={() => {
        if (!params?.channel) {
          !isLoading && leave()
        } else {
          leave()
        }
      }}
      isMute={controls.isMuted}
      isSpeakerOn={controls.isSpeakerOn}
      timer={formatTime(controls.elapsedTime)}
      onPressMute={() => mute()}
      onPressSpeaker={() => toggleSpeaker()}
      user={params?.user}
      isNear={controls.isNear}
      leaveDisabled={params?.channel ? false : isLoading}
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
