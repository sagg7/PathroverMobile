import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RenderComposer} from './RenderComposer';
import RenderActions from './RenderActions';
import {RenderSend} from './RenderSend';
import {PFColors, scale} from '../../../shared/exporter';
import {RenderRecordComposer} from './RenderRecordComposer';

const RenderInputToolbar = (props, onPress, isRecord) => {
  return (
    <View style={styles.mainContainer}>
      <RenderActions {...props} />
      {isRecord ? (
        <RenderRecordComposer {...props} />
      ) : (
        <RenderComposer {...props} />
      )}
      <RenderSend {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    minHeight: 60,
    maxHeight: 120,
    flexDirection: 'row',
    paddingHorizontal: scale(6),
    paddingVertical: scale(4),
    backgroundColor: PFColors.Standard.White,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    shadowColor: PFColors.Gray.DarkGray,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'space-between',
    width: '100%',
  },
});

export {RenderInputToolbar};
