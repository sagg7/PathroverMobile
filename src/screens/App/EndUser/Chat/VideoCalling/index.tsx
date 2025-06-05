import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AudioAinsMode,
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  EarMonitoringFilterType,
  IRtcEngine,
  IRtcEngineEventHandler,
  RtcSurfaceView,
  RtcTextureView,
  VideoViewSetupMode,
} from 'react-native-agora';
import { useSelector } from 'react-redux';
import { appIcons } from '../../../../../assets/icons';
import {
  useCreateCallMutation,
  useLazyGetAgoraTokenQuery,
  useUpdateCallMutation,
} from '../../../../../redux/chat/chatApiSlice';
import { PFColors } from '../../../../../shared/exporter';
import styles from './styles';
import { AGORA_KEY, REQ_LIST_SOCKET_URL } from '../../../../../shared/utils/constant';
import { formatTime } from '../../../../../helpers/getFormatTime';
import proximity, { SubscriptionRef } from 'rn-proximity-sensor';
import uuid from 'react-native-uuid';
import { useActionCable } from '../../../../../hooks/socket/useActionCable';
import { useChannel } from '../../../../../hooks/socket/useChannel';
import { clearAllCallNotifications } from '../../../../../hooks/NotificationHook';

const APP_ID = AGORA_KEY;

const { height, width } = Dimensions.get('window');

const VideoCalling = () => {
  const { params } = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const startTimeRef = useRef(null); // Ref to store the start time
  const timerIntervalRef = useRef(null); // Ref to store the interval IDstatus
  const sensorSubscriptionRef = useRef<SubscriptionRef | null>(null);
  const agoraEngineRef = useRef<IRtcEngine>(); // IRtcEngine instance
  const eventHandler = useRef<IRtcEngineEventHandler>();

  const { loginUser, accessToken } = useSelector(state => state.auth);
  const token = accessToken?.replace('Bearer ', '');
  const { actionCable } = useActionCable(REQ_LIST_SOCKET_URL, token);
  const { subscribe, unsubscribe } = useChannel(actionCable);

  const [controls, setControls] = useState({
    // engine: null,
    call_data: {},
    isMute: false,
    isNear: false,
    status: null,
    elapsedTime: 0,
    remoteUsers: [],
    isSpeakerOn: false,
    isJoined: false,
    remoteUserCamera: false,
    renderByTextureView: true,
    joinChannelSuccess: false,
    setupMode: VideoViewSetupMode.VideoViewSetupReplace,
  });

  const [fetchAgoraToken] = useLazyGetAgoraTokenQuery(undefined);
  const [createCall, { data, isLoading }] = useCreateCallMutation();
  const [updateCall] = useUpdateCallMutation();

  const setupSDKEngine = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;

      agoraEngine.initialize({ appId: APP_ID });

      agoraEngine.enableAudio();
      agoraEngine.enableVideo();
      // agoraEngine.muteLocalVideoStream(false);
      agoraEngine.enableAudioVolumeIndication(200, 3, true);
      agoraEngine.setAINSMode(true, AudioAinsMode.AinsModeBalanced);
    } catch (error) {
      //
    }
  }

  const setupEventHandler = () => {
    eventHandler.current = {
      onJoinChannelSuccess: () => {
        setControls(prev => ({ ...prev, joinChannelSuccess: true, isJoined: true }));
      },
      onUserJoined: (_connection: RtcConnection, remoteUid: number) => {
        setControls(prev => ({
          ...prev,
          remoteUsers: [...prev.remoteUsers, remoteUid],
        }));
        startTimer();
      },
      onUserOffline: (_connection: RtcConnection, remoteUid: number) => {
        stopTimer();
        setControls(prev => ({
          ...prev,
          remoteUsers: prev.remoteUsers.filter(uid => uid !== remoteUid),
        }));

        if (controls.remoteUsers.length === 0) {
          setTimeout(() => {
            onPressLeave();
          }, 1500)
        }
      },
      onConnectionStateChanged: (
        _connection: RtcConnection,
        state,
        _reason,
      ) => {
        if (state === 1 || state === 5) {
          stopTimer();
        }
      },
      onUserMuteVideo: (connection, remoteUser, muted) => {
        setControls(prev => ({ ...prev, remoteUserCamera: muted }));
      },
      onAudioRoutingChanged: (routing) => {
      },
      onLocalAudioStats: (connection, stats) => {
      },
      onRemoteAudioStats: (connection, stats) => {
      },
      onLocalAudioStateChanged: (connection, state, reason) => {
        if (state === 3) {
          agoraEngineRef.current?.enableLocalAudio(true);
          agoraEngineRef.current?.muteLocalAudioStream(false);
        }
      },
      onRemoteAudioStateChanged: (connection, remoteUid, state, reason) => {
        if (state === 4) {
          agoraEngineRef.current?.enableAudio();
        }
      },
      onError: (err, msg) => {
        // ;

      },
    };
    agoraEngineRef.current?.registerEventHandler(eventHandler.current);
  };

  const cleanupAgoraEngine = () => {
    return () => {
      agoraEngineRef?.current?.unregisterEventHandler(eventHandler.current!);
      agoraEngineRef?.current?.release();
    };
  };

  useEffect(() => {
    const initRtcEngine = async () => {
      await setupSDKEngine();
      setupEventHandler();
      setTimeout(() => {
        joinChannel();
      }
        , 1000);
    };

    if (isFocused) {
      setControls(prev => ({ ...prev, renderByTextureView: true, elapsedTime: 0 }));
      cleanupAgoraEngine()
      initRtcEngine();
    }

    return () => {
      cleanupAgoraEngine();
      clearInterval(timerIntervalRef.current);
    };
  }, []);

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

  useEffect(() => {
    const handleSubscribe = async () => {
      try {
        if (controls.call_data?.call_log?.id) {
          subscribe(
            {
              channel: 'CallChannel',
              user_call_id: params?.channel ? params?.id : controls.call_data?.call_log?.id,
              channel_key: `call_channel_${params?.channel ? params?.id : controls.call_data?.call_log?.id}`,
            },
            {
              received: res => {
                setControls(prev => ({ ...prev, status: res?.status }));
                checkCallStatus(res);
              },
              connected: () => {
                // setIsConnected(true);
              },
            },
          );
        }
      } catch (err) {
        //
      }
    };

    handleSubscribe();

    return () => {
      unsubscribe();
    };
  }, [controls.call_data]); // Added checkCallStatus to dependencies

  useEffect(() => {
    if (controls.status === 'ringing' && isFocused) {

      const timeoutId = setTimeout(() => {
        if (controls.remoteUsers?.length === 0 && controls.call_data) {
          console.error("No one joined in 3 mins, ending call...");
          updateCallStatus('not_attended');
        }
        // }, 85000);
      }, 60000);

      return () => clearTimeout(timeoutId);
    }
  }, [controls.status]);

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

  const fetchToken = async (CHANNEL_NAME) => {
    try {
      const res = await fetchAgoraToken(CHANNEL_NAME);
      const token = res?.data?.data?.token;
      return token;
    } catch (error) {
      //
    }
  };

  const joinChannel = async () => {
    if (controls.isJoined) {
      return;
    }

    const CHANNEL_NAME = params?.channel ? params?.channel : `video_call_${loginUser?.id}_${uuid.v4()}`;

    if (!params?.channel) {
      callInitiated(CHANNEL_NAME);
    }

    const token = await fetchToken(CHANNEL_NAME);

    agoraEngineRef?.current?.startPreview();

    agoraEngineRef?.current?.joinChannel(token, CHANNEL_NAME, 0, {
      // clientRoleType: params?.channel
      //   ? ClientRoleType.ClientRoleAudience
      //   : ClientRoleType.ClientRoleBroadcaster,
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      // channelProfile: ChannelProfileType.ChannelProfileCommunication,
      publishCameraTrack: true,
      publishMicrophoneTrack: true,
      autoSubscribeAudio: true,
      autoSubscribeVideo: true,
    });
    // engine.joinChannel(TOKEN, CHANNEL_NAME, 0, {
    //   clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    // });
    setControls(prev => ({ ...prev, isJoined: true }));

    agoraEngineRef.current?.enableAudio();
    agoraEngineRef.current?.enableLocalAudio(true);
    agoraEngineRef.current?.enableLocalVideo(true);
    agoraEngineRef.current?.muteLocalAudioStream(false);
    agoraEngineRef.current?.muteLocalVideoStream(false);
    // agoraEngineRef.current?.enableInEarMonitoring(true, EarMonitoringFilterType.EarMonitoringFilterNone);
    agoraEngineRef?.current?.enableInstantMediaRendering();

  };

  const onPressFlip = () => {
    // if (!agoraEngineRef?.current) {
    //   return;
    // }
    agoraEngineRef?.current?.switchCamera();
  };

  const onPressCamera = () => {
    // if (!agoraEngineRef?.current) {
    //   return;
    // }
    const hasPreview = !controls.renderByTextureView;
    setControls(prev => ({ ...prev, renderByTextureView: hasPreview }));
    agoraEngineRef?.current?.enableLocalVideo(hasPreview);
    agoraEngineRef?.current?.muteLocalVideoStream(!hasPreview);
  };

  const onPressMute = () => {
    // if (!agoraEngineRef?.current) {
    //   return;
    // }
    const hasMuted = !controls.isMute;
    setControls(prev => ({ ...prev, isMute: hasMuted }));
    agoraEngineRef?.current?.muteLocalAudioStream(hasMuted);
  };

  const onPressSpeaker = () => {
    const newSpeakerState = !controls.isSpeakerOn;
    setControls(prev => ({ ...prev, isSpeakerOn: newSpeakerState }));
    agoraEngineRef?.current?.setEnableSpeakerphone(newSpeakerState);
  };

  const callInitiated = async (channelName: string) => {
    try {
      const obj = {
        call: {
          call_type: 'video_call',
          call_mode: 'group_call',
          channel_name: channelName,
          receiver_id: params?.user?.id,
        },
      };

      const res = await createCall(obj);

      if (res?.data) {
        setControls(prev => ({ ...prev, call_data: res?.data, status: 'ringing' }));
      }
    } catch (error) {
      //
    }
  };

  const updateCallStatus = async (status) => {
    try {
      const check = params?.channel ? params?.id : data?.call_log?.id ?? controls?.call_data?.call_log?.id;
      if (check) {
        const obj = {
          status: controls.status === 'ringing' ? status : 'ended',
          id: check,
          receiver_id: params?.user?.id,
        };

        await updateCall(obj);
      }
    } catch (error) {
      //
    }
  };

  const checkCallStatus = async (item) => {
    try {
      if (item?.status === 'declined' || item?.status === 'ended' || item?.status === 'not_attended' || item?.status === 'missed_call') {
        cleanupAgoraEngine();
        agoraEngineRef?.current?.leaveChannel();

        setControls(prev => ({
          ...prev, joinChannelSuccess: false,
          remoteUsers: [],
        }));
        navigation.pop();
        // navigation.goBack();
        clearAllCallNotifications()
      }
    } catch (error) {
      //
    }
  }

  const onPressLeave = () => {
    try {
      updateCallStatus('ended');

      agoraEngineRef.current?.stopPreview();
      cleanupAgoraEngine()
      agoraEngineRef?.current?.leaveChannel();
      agoraEngineRef.current = null;

      setControls(prev => ({
        ...prev, isJoined: false, joinChannelSuccess: false,
        remoteUsers: []
      }));
      navigation.pop();
    } catch (error) {
      //
    }
  };

  const iconsView = () => {
    return (
      <View style={styles.callButtonView} pointerEvents={controls.isNear ? 'none' : 'auto'} >
        <TouchableOpacity style={styles.iconDetails} onPress={onPressSpeaker}>
          <View style={styles.iconBackGround(controls.isSpeakerOn)}>
            <Image
              source={
                controls.isSpeakerOn ? appIcons.speakerOn : appIcons.speakerOff
              }
              style={styles.iconStyle}
            />
          </View>
          <Text style={styles.iconTextStyle}>Speaker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconDetails} onPress={onPressMute}>
          <View style={styles.iconBackGround(!controls.isMute)}>
            <Image
              source={controls.isMute ? appIcons.muted : appIcons.mute}
              style={styles.iconStyle}
            />
          </View>
          <Text style={styles.iconTextStyle}>Mute</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconDetails} onPress={onPressFlip}>
          <View style={styles.iconBackGround(true)}>
            <Image source={appIcons.flipCamera} style={styles.iconStyle} />
          </View>
          <Text style={styles.iconTextStyle}>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconDetails} onPress={onPressCamera}>
          <View style={styles.iconBackGround(controls.renderByTextureView)}>
            <Image
              source={
                controls.renderByTextureView
                  ? appIcons.showVideo
                  : appIcons.hideVideo
              }
              style={styles.iconStyle}
            />
          </View>
          <Text style={styles.iconTextStyle}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconDetails} disabled={params?.channel ? false : isLoading} onPress={() => {
          onPressLeave()
          // if (!params?.channel) {
          //   !isLoading && onPressLeave()
          // } else {
          //   onPressLeave()
          // }
        }
        }>
          <View style={styles.iconBackGroundRed}>
            <Image source={appIcons.endCall} style={styles.callIconStyle} />
          </View>
          <Text style={styles.iconTextStyle}>End</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderVideo = (user: { uid: number }) => {
    const cameraHeight =
      controls.remoteUsers?.length > 0 ? (height - 130) / 2 : height;
    const showUserCamera =
      user?.uid === 0
        ? controls.renderByTextureView
        : !controls.remoteUserCamera;
    return showUserCamera ? (
      <RtcSurfaceView
        style={{
          width: width - 10,
          height: cameraHeight,
        }}
        canvas={{ uid: user?.uid, setupMode: controls.setupMode }}
      />
    ) : Platform.OS === 'android' ? (
      <RtcTextureView
        style={{ width: width, height: cameraHeight }}
        canvas={{ uid: user?.uid, setupMode: controls.setupMode }}
      />
    ) : (
      <View
        style={{
          width: width - 10,
          height: cameraHeight,
          backgroundColor: PFColors.Standard.GrayBlack,
        }}
      />
    );
  };

  return (
    <View style={styles.cameraView}>
      {controls.joinChannelSuccess && (
        <View style={{ height: height - 115 }}>
          {/* Remote video streams */}
          <View style={styles.containerView}>
            {controls.remoteUsers?.map(uid => renderVideo({ uid }))}
            <View style={styles.userNameTextView}>
              <Text style={styles.userName}>
                {params?.user?.callerName ||
                  `${params?.user?.first_name || ''} ${params?.user?.last_name || ''}`.trim() ||
                  'User'}
              </Text>
            </View>
          </View>

          {/* Local video stream */}
          <View style={styles.containerView}>{renderVideo({ uid: 0 })}</View>
          <View style={styles.timerTextView}>
            <Text style={styles.counterText}>
              {formatTime(controls.elapsedTime)}
            </Text>
          </View>
        </View>
      )}
      <View style={styles.iconContainer}>{iconsView()}</View>
    </View>
  );
};

export default VideoCalling;
