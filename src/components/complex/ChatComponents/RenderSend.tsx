import React from 'react';
import {StyleSheet} from 'react-native';
import {Send} from 'react-native-gifted-chat';
import {svgIcon} from '../../../assets/svg';
import {PFColors} from '../../../shared/exporter';

const RenderSend = props => {
  return (
    <Send
      {...props}
      disabled={!props.text}
      alwaysShowSend
      onSend={props.onSend}
      containerStyle={styles.containerStyle(!props.text)}>
      {svgIcon.SendMsg}
    </Send>
  );
};

const styles = StyleSheet.create({
  containerStyle: (disable: boolean) => ({
    justifyContent: 'center',
    height: 44,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 5,
    backgroundColor: PFColors.Blue.Dark,
    borderRadius: 44,
    width: 44,
    opacity: !disable ? 1 : 0.4,
  }),
  sendIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export {RenderSend};
