import React from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {appIcons} from '../../../../../assets/icons';
import {appImages} from '../../../../../assets/images';
import {svgIcon} from '../../../../../assets/svg';
import {MainWrapper} from '../../../../../components';
import styles from './styles';

interface CallScreenProps {
  onPressLeave: () => void;
  isMute: boolean;
  isNear: boolean;
  isSpeakerOn: boolean;
  timer: string;
  onPressSpeaker: () => void;
  onPressMute: () => void;
  user: object;
}

const CallScreen = ({
  onPressLeave,
  isMute,
  isSpeakerOn,
  timer,
  onPressSpeaker,
  onPressMute,
  user,
  isNear,
}: CallScreenProps) => {
  const iconsView = () => {
    return (
      <View style={styles.callButtonView} pointerEvents={isNear ? 'none' : 'auto'}>
        <TouchableOpacity style={styles.iconDetails} onPress={onPressSpeaker}>
          <View style={styles.iconBackGround(isSpeakerOn)}>
            <Image
              source={isSpeakerOn ? appIcons.speakerOn : appIcons.speakerOff}
              style={styles.iconStyle}
            />
          </View>
          <Text style={styles.iiconTextStyle}>Speaker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconDetails} onPress={onPressMute}>
          <View style={styles.iconBackGround(!isMute)}>
            <Image
              source={isMute ? appIcons.muted : appIcons.mute}
              style={styles.iconStyle}
            />
          </View>
          <Text style={styles.iiconTextStyle}>Mute</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconDetails} onPress={onPressLeave}>
          <View style={styles.iconBackGroundRed}>
            <Image source={appIcons.endCall} style={styles.callIconStyle} />
          </View>
          <Text style={styles.iiconTextStyle}>End</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <MainWrapper>
      <ImageBackground
        source={user?.avatar ? {uri: user?.avatar} : appImages.userPlaceholder}
        style={styles.callerBackGround}>
        {/* <TouchableOpacity onPress={onPressLeave} style={styles.backIconStyle}>
          {svgIcon.BackArrow}
        </TouchableOpacity> */}
        <View style={styles.userConatiner}>
          <Text style={styles.callerNameTextStyle}>
            {user?.first_name ?? 'User'} {user?.last_name ?? ''}
          </Text>
            <Text style={styles.callTime}>{timer}</Text>
        </View>
        {/* <Image
          source={appImages.appIntroFour}
          style={styles.singleCallerImage}
        /> */}
        <View style={styles.callerAction}>
          <View style={styles.iconContainer}>{iconsView()}</View>
        </View>
      </ImageBackground>
    </MainWrapper>
  );
};

export default CallScreen;
