import React from 'react';
import {StyleSheet} from 'react-native';
import {Composer} from 'react-native-gifted-chat';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';

const RenderComposer = props => {
  return <Composer {...props} textInputStyle={styles.textInputStyle} />;
};

const styles = StyleSheet.create({
  textInputStyle: {
    minHeight: 44,
    maxHeight: 90,
    textAlignVertical: 'center',
    textAlign: 'left',
    fontSize: PFFontSize.FONT_SIZE_14,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '64%',
    backgroundColor: PFColors.Gray.LightMist,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Regular,
    left: -10,
  },
});

export {RenderComposer};
