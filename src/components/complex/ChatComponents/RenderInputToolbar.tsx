import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { RenderComposer } from './RenderComposer';
import RenderActions from './RenderActions';
import { RenderSend } from './RenderSend';
import { PFColors, scale } from '../../../shared/exporter';
import { RenderRecordComposer } from './RenderRecordComposer';

const RenderInputToolbar = (props, onPress, isRecord, isRecording, setIsRecording, onSend) => {
  return (
    <View style={styles.mainContainer}>
      <RenderActions {...props} isRecord={isRecord} />
      {isRecord ? (
        <RenderRecordComposer
          props={props}
          onSend={onSend}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      ) : (
        <RenderComposer {...props} />
      )}
      {!isRecording && <RenderSend {...props} />}
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
    shadowColor: PFColors.Standard.Black,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 8,
    justifyContent: 'space-between',
    width: '100%',
    ...Platform.select({
      android: {
        paddingBottom: 6,
        shadowOffset: {
          width: 0,
          height: -10,
        },
      },
      ios: {
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
    }),
  },
});

export { RenderInputToolbar };
