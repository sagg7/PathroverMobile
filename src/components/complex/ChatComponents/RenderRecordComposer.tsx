import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Composer} from 'react-native-gifted-chat';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';

const RenderRecordComposer = props => {
  return (
    <View style={styles.viewStyle}>
      <Composer {...props} textInputStyle={styles.textInputStyle} />
      <TouchableOpacity onPress={props?.onPress}>
        {svgIcon.RecordIcon}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  textInputStyle: {
    minHeight: 38,
    maxHeight: 90,
    textAlignVertical: 'center',
    textAlign: 'left',
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Gray.DarkGray,
    fontFamily: PFFonts.Foundation.Regular,
  },
  viewStyle: {
    width: '72%',
    backgroundColor: PFColors.Gray.LightMist,
    borderRadius: 100,
    paddingHorizontal: 6,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    left: -6,
    marginTop: 4,
  },
});

export {RenderRecordComposer};
