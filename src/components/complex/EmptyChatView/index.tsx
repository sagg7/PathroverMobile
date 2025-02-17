import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';
import {NoChat} from '../NoChat';

interface BorderTextProps {
  text: string;
  isIcon?: boolean;
}

interface EmptyChatViewProps {
  buttonText?: string;
  onPress: () => void;
}

const BorderText = ({text, isIcon = false}: BorderTextProps) => {
  return (
    <View style={styles.borderView}>
      {isIcon && <>{svgIcon.LockIcon}</>}
      <Text style={styles.borderText(isIcon)}>{text}</Text>
    </View>
  );
};

const EmptyChatView = ({
  onPress,
  buttonText = 'New Private Chat',
}: EmptyChatViewProps) => {
  return (
    <View style={styles.noAccountView}>
      <BorderText text={'Today'} />
      <BorderText
        text={
          'Messages and calls are secure & encrypted. Screenshots will be disabled during this chat.'
        }
        isIcon
      />
      <NoChat
        title={'No chats yet.'}
        buttonTitle={buttonText}
        subTitle={
          'Chat with contacts who have Path Rover app installed on their phone.'
        }
        onPress={onPress}
      />
    </View>
  );
};

export default EmptyChatView;

const styles = StyleSheet.create({
  borderText: (isIcon: boolean) => ({
    color: PFColors.Standard.TextBlack,
    fontSize: isIcon ? PFFontSize.FONT_SIZE_12 : PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Regular,
    marginLeft: isIcon ? 12 : 0,
  }),
  borderView: {
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: PFColors.Gray.TextBorder,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  noAccountView: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 16,
  },
});
