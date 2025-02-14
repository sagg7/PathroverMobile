import React from 'react';
import {StyleSheet} from 'react-native';
import {MessageText} from 'react-native-gifted-chat';
import {PFColors} from '../../../shared/exporter';

const RenderMessageText = props => (
  <MessageText
    {...props}
    textStyle={{
      left: styles.leftTextStyle,
      right: styles.rightTextStyle,
    }}
    customTextStyle={styles.customTextStyle}
  />
);

const styles = StyleSheet.create({
  leftTextStyle: {
    color: PFColors.Standard.Black,
  },
  rightTextStyle: {
    color: PFColors.Standard.White,
  },
  customTextStyle: {
    fontSize: 14,
  },
});

export {RenderMessageText};
