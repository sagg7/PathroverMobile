import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
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
import {useSelector} from 'react-redux';
import {appIcons} from '../../../../../assets/icons';
import {
  useCreateCallMutation,
  useLazyGetAgoraTokenQuery,
  useUpdateCallMutation,
} from '../../../../../redux/chat/chatApiSlice';
import {PFColors} from '../../../../../shared/exporter';
import styles from './styles';
import {AGORA_KEY} from '../../../../../shared/utils/constant';

const APP_ID = AGORA_KEY;

const {height, width} = Dimensions.get('window');

const VideoCalling = () => {
  const {params} = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [joinChannelSuccess, setJoinChannelSuccess] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
  const [renderByTextureView, setRenderByTextureView] = useState(true);
  const [isMute, setIsMute] = useState(false); // Set mute status
  const [isSpeakerOn, setIsSpeakerOn] = useState(false); // Set speaker status
  const [remoteUserCamera, setRemoteUserCamera] = useState(false); // Set speaker status
  const [elapsedTime, setElapsedTime] = useState(0); // State to store elapsed time
  const startTimeRef = useRef(null); // Ref to store the start time
  const timerIntervalRef = useRef(null); // Ref to store the interval IDstatus

  const [setupMode, setSetupMode] = useState(
    VideoViewSetupMode.VideoViewSetupReplace,
  );
  const [engine, setEngine] = useState<any>(null);
  const [fetchAgoraToken, {isLoading}] = useLazyGetAgoraTokenQuery(undefined);
  const [createCall, {data}] = useCreateCallMutation();
  const [updateCall] = useUpdateCallMutation();

  const {loginUser} = useSelector((state: any) => state?.auth);

  const CHANNEL_NAME = params?.channel ? params?.channel : 'testChannel';

  useEffect(() => {
    const initRtcEngine = async () => {
      const agoraEngine = createAgoraRtcEngine();
      agoraEngine.initialize({appId: APP_ID});
      agoraEngine.registerEventHandler(eventHandler);
      agoraEngine.enableVideo();

      setRenderByTextureView(true);
      agoraEngine.enableLocalVideo(true);
      agoraEngine.muteLocalVideoStream(false);

      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
      }

      agoraEngine.startPreview();
      setEngine(agoraEngine);
      // joinChannel();
    };

    initRtcEngine();

    return () => {
      if (engine) {
        cleanupAgoraEngine();
      }
    };
  }, []);

  useEffect(() => {
    console.log('engine', engine);

    if (isFocused) {
      setElapsedTime(0);
    }
    if (isFocused && engine) {
      joinChannel();
    } else {
      // onPressLeave();
      cleanupAgoraEngine();
    }
  }, [isFocused, engine]);

  const eventHandler: IRtcEngineEventHandler = {
    onJoinChannelSuccess: () => {
      setJoinChannelSuccess(true);
    },
    onUserJoined: (connection, remoteUid) => {
      setRemoteUsers(prevUsers => [...prevUsers, remoteUid]);
      startTimer();
    },
    onUserOffline: (connection, remoteUid) => {
      stopTimer();
      setRemoteUsers(prevUsers => {
        const updatedUsers = prevUsers.filter(uid => uid !== remoteUid);

        if (updatedUsers.length === 0) {
          // onPressLeave();
        }

        return updatedUsers;
      });
    },
    onUserMuteVideo: (connection, remoteUser, muted) => {
      setRemoteUserCamera(muted);
    },
    onConnectionStateChanged: (connection, state) => {
      if (state === 1 || state === 5) {
        stopTimer();
      }
    },
  };

  const cleanupAgoraEngine = () => {
    return () => {
      engine.unregisterEventHandler(eventHandler);
      engine.release();
    };
  };

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

  const fetchToken = async () => {
    try {
      const res = await fetchAgoraToken(CHANNEL_NAME);
      const token = res?.data?.data?.token;
      return token;
    } catch (error) {
      //
    }
  };

  const joinChannel = async () => {
    if (!engine) {
      return;
    }

    if (!params?.channel) {
      callInitiated(CHANNEL_NAME);
    }
    const token = await fetchToken();

    engine.joinChannel(token, CHANNEL_NAME, 0, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
    // engine.joinChannel(TOKEN, CHANNEL_NAME, 0, {
    //   clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    // });
    engine.enableInstantMediaRendering();
  };

  const onPressFlip = () => {
    if (!engine) {
      return;
    }
    engine.switchCamera();
  };

  const onPressCamera = () => {
    if (!engine) {
      return;
    }
    const hasPreview = !renderByTextureView;
    setRenderByTextureView(hasPreview);
    engine.enableLocalVideo(hasPreview);
    engine.muteLocalVideoStream(!hasPreview);
  };

  const onPressMute = () => {
    if (!engine) {
      return;
    }
    const hasMuted = !isMute;
    setIsMute(hasMuted);
    engine?.muteLocalAudioStream(hasMuted);
  };

  const onPressSpeaker = () => {
    const newSpeakerState = !isSpeakerOn;
    setIsSpeakerOn(newSpeakerState);
    engine?.setEnableSpeakerphone(newSpeakerState);
  };

  const onPressLeave = () => {
    try {
      setJoinChannelSuccess(false);
      setRemoteUsers([]);

      if (engine) {
        engine.leaveChannel();
      }
      setEngine(null);
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

  const iconsView = () => {
    return (
      <View style={styles.callButtonView}>
        <TouchableOpacity style={styles.iconDetails} onPress={onPressSpeaker}>
          <View style={styles.iconBackGround(isSpeakerOn)}>
            <Image
              source={isSpeakerOn ? appIcons.speakerOn : appIcons.speakerOff}
              style={styles.iconStyle}
            />
          </View>
          <Text style={styles.iconTextStyle}>Speaker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconDetails} onPress={onPressMute}>
          <View style={styles.iconBackGround(!isMute)}>
            <Image
              source={isMute ? appIcons.muted : appIcons.mute}
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
          <View style={styles.iconBackGround(renderByTextureView)}>
            <Image
              source={
                renderByTextureView ? appIcons.showVideo : appIcons.hideVideo
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

  const renderVideo = (user: {uid: number}) => {
    const cameraHeight = remoteUsers?.length > 0 ? (height - 130) / 2 : height;
    const showUserCamera =
      user?.uid === 0 ? renderByTextureView : !remoteUserCamera;
    return showUserCamera ? (
      <RtcSurfaceView
        style={{
          width: width - 10,
          height: cameraHeight,
        }}
        canvas={{uid: user?.uid, setupMode}}
      />
    ) : Platform.OS === 'android' ? (
      <RtcTextureView
        style={{width: width, height: cameraHeight}}
        canvas={{uid: user?.uid, setupMode}}
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
      {joinChannelSuccess && (
        <View style={{height: height - 115}}>
          {/* Remote video streams */}
          <View style={styles.containerView}>
            {remoteUsers?.map(uid => renderVideo({uid}))}
            <Text style={styles.userName}>
              {params?.user?.first_name ?? 'User'}{' '}
              {params?.user?.last_name ?? ''}
            </Text>
          </View>

          {/* Local video stream */}
          <View style={styles.containerView}>{renderVideo({uid: 0})}</View>
          <Text style={styles.counterText}>{formatTime(elapsedTime)}</Text>
        </View>
      )}
      <View style={styles.iconContainer}>{iconsView()}</View>
    </View>
  );
};

export default VideoCalling;
