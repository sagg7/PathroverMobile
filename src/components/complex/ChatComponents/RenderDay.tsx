import React from 'react';
import {StyleSheet} from 'react-native';
import {Day} from 'react-native-gifted-chat';
import {PFFonts} from '../../../shared/exporter';

const RenderDay = props => {
  return <Day {...props} textStyle={styles.textStyle} />;
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: PFFonts.Foundation.Regular,
  },
});

export {RenderDay};
