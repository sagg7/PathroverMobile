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
  ClientRoleType,
  createAgoraRtcEngine,
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

const APP_ID = AGORA_KEY;

const { height, width } = Dimensions.get('window');

const VideoCalling = () => {
  const { params } = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const startTimeRef = useRef(null); // Ref to store the start time
  const timerIntervalRef = useRef(null); // Ref to store the interval IDstatus
  const sensorSubscriptionRef = useRef<SubscriptionRef | null>(null);

  const [controls, setControls] = useState({
    engine: null,
    call_data: {},
    isMute: false,
    isNear: false,
    elapsedTime: 0,
    remoteUsers: [],
    isSpeakerOn: false,
    remoteUserCamera: false,
    renderByTextureView: true,
    joinChannelSuccess: false,
    setupMode: VideoViewSetupMode.VideoViewSetupReplace,
  });

  const [fetchAgoraToken, { isLoading }] = useLazyGetAgoraTokenQuery(undefined);
  const [createCall, { data }] = useCreateCallMutation();
  const [updateCall] = useUpdateCallMutation();

  const { loginUser, accessToken } = useSelector(state => state.auth);
  const token = accessToken?.replace('Bearer ', '');
  const { actionCable } = useActionCable(REQ_LIST_SOCKET_URL, token);
  const { subscribe, unsubscribe } = useChannel(actionCable);

  useEffect(() => {
    const initRtcEngine = async () => {
      const agoraEngine = createAgoraRtcEngine();
      agoraEngine.initialize({ appId: APP_ID });
      agoraEngine.registerEventHandler(eventHandler);
      agoraEngine.enableVideo();

      setControls(prev => ({ ...prev, renderByTextureView: true }));
      agoraEngine.enableLocalVideo(true);
      agoraEngine.muteLocalVideoStream(false);

      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
      }

      agoraEngine.startPreview();
      setControls(prev => ({ ...prev, engine: agoraEngine }));
      // joinChannel();
    };

    initRtcEngine();

    return () => {
      if (controls.engine) {
        cleanupAgoraEngine();
      }
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      // setElapsedTime(0);
      setControls(prev => ({ ...prev, elapsedTime: 0 }));
    }
    if (isFocused && controls.engine) {
      joinChannel();
    } else {
      // onPressLeave();
      cleanupAgoraEngine();
    }
  }, [isFocused, controls.engine]);

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
                checkCallStatus(res);
              },
              connected: () => {
                // console.log('connected-------call---->>>>>>>>>>>>>>', controls.call_data?.call_log?.id);
                // setIsConnected(true);
              },
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


  const eventHandler: IRtcEngineEventHandler = {
    onJoinChannelSuccess: () => {
      setControls(prev => ({ ...prev, joinChannelSuccess: true }));
    },
    onUserJoined: (connection, remoteUid) => {
      setControls(prev => ({
        ...prev,
        remoteUsers: [...prev.remoteUsers, remoteUid],
      }));
      startTimer();
    },
    onUserOffline: (connection, remoteUid) => {
      stopTimer();
      setControls(prev => ({
        ...prev,
        remoteUsers: prev.remoteUsers.filter(uid => uid !== remoteUid),
      }));

      if (controls.remoteUsers.length === 0) {
        onPressLeave();
      }
    },
    onUserMuteVideo: (connection, remoteUser, muted) => {
      setControls(prev => ({ ...prev, remoteUserCamera: muted }));
    },
    onConnectionStateChanged: (connection, state) => {
      if (state === 1 || state === 5) {
        stopTimer();
      }
    },
  };

  const cleanupAgoraEngine = () => {
    return () => {
      controls.engine.unregisterEventHandler(eventHandler);
      controls.engine.release();
    };
  };

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

  useEffect(() => {
    if (controls.joinChannelSuccess && isFocused) {
      setTimeout(() => {
        // console.log('onJoinChannelSuccess---setTimeout-------->>>>>>>>>>>>>>');
        if (controls.remoteUsers?.length === 0 && controls.call_data) {  // Check ref instead of state
          // console.error("No one joined in 3 mins, ending call...");
          // alert("No one joined in 3 mins, ending call...");
          updateCallStatus('not_attended');
          controls.engine.leaveChannel();
          // leave();
        }
        // }, 10000); 
      }, 5000);
      // }, 60000);
    }

  }, [controls.joinChannelSuccess, controls.call_data]);

  const joinChannel = async () => {
    const CHANNEL_NAME = params?.channel ? params?.channel : `video_call_${loginUser?.id}_${uuid.v4()}`;

    if (!controls.engine) {
      return;
    }

    if (!params?.channel) {
      callInitiated(CHANNEL_NAME);
    }

    const token = await fetchToken(CHANNEL_NAME);

    controls.engine.joinChannel(token, CHANNEL_NAME, 0, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
    // engine.joinChannel(TOKEN, CHANNEL_NAME, 0, {
    //   clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    // });
    controls.engine.enableInstantMediaRendering();
  };

  const onPressFlip = () => {
    if (!controls.engine) {
      return;
    }
    controls.engine.switchCamera();
  };

  const onPressCamera = () => {
    if (!controls.engine) {
      return;
    }
    const hasPreview = !controls.renderByTextureView;
    setControls(prev => ({ ...prev, renderByTextureView: hasPreview }));
    controls.engine.enableLocalVideo(hasPreview);
    controls.engine.muteLocalVideoStream(!hasPreview);
  };

  const onPressMute = () => {
    if (!controls.engine) {
      return;
    }
    const hasMuted = !controls.isMute;
    setControls(prev => ({ ...prev, isMute: hasMuted }));
    controls.engine?.muteLocalAudioStream(hasMuted);
  };

  const onPressSpeaker = () => {
    const newSpeakerState = !controls.isSpeakerOn;
    setControls(prev => ({ ...prev, isSpeakerOn: newSpeakerState }));
    controls.engine?.setEnableSpeakerphone(newSpeakerState);
  };

  const onPressLeave = () => {
    try {
      setControls(prev => ({
        ...prev,
        joinChannelSuccess: false,
        remoteUsers: [],
      }));

      if (controls.engine) {
        controls.engine.leaveChannel();
      }
      setControls(prev => ({ ...prev, engine: null }));
      updateCallStatus();

      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } catch (error) {
      //
    }
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
        setControls(prev => ({ ...prev, call_data: res?.data }));
      }
    } catch (error) {
      //
    }
  };

  const updateCallStatus = async (status) => {
    try {
      const obj = {
        status: status ?? 'ended',
        id: params?.channel ? params?.id : data?.call_log?.id ?? controls?.call_data?.call_log?.id,
      };

      await updateCall(obj);
    } catch (error) {
      //
    }
  };

  const checkCallStatus = async (item) => {
    try {
      console.log('checkCallStatus--------->>>>>>>>>>>>>>', item);

      if (item?.status === 'declined') {
        controls.engine.leaveChannel();
      }
    } catch (error) {
      console.log('checkCallStatus error--------->>>>>>>>>>>>>>', error);

    }
  }

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
        <TouchableOpacity style={styles.iconDetails} onPress={onPressLeave}>
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
