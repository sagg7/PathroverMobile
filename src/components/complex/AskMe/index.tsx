import React from 'react';
import {Platform, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFonts, PFFontSize, scale} from '../../../shared/exporter';

interface AskMeProps {
  placeholder?: string;
  onPress?: () => void;
  value: string;
  onChangeText: (txt: string) => void;
}

function AskMe({placeholder, onPress, value, onChangeText}: AskMeProps) {
  return (
    <TouchableOpacity style={styles.main}>
      {svgIcon.Meta}
      <TextInput
        value={value}
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor={PFColors.Blue.Dark}
      />
      <TouchableOpacity onPress={onPress}>{svgIcon.SendMeta}</TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: PFColors.Gray.LightMist,
    borderRadius: 12,
    marginHorizontal: scale(12),
    marginVertical: scale(6),
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(10),
    ...Platform.select({
      android: {
        paddingVertical: 3,
      },
      ios: {
        paddingVertical: 12,
      },
    }),
  },
  input: {
    width: '80%',
    color: PFColors.Blue.Dark,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.Medium,
  },
});

export {AskMe};
