import * as React from 'react';
import {Text, View, StyleSheet, TextInput, Platform} from 'react-native';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';

interface ChatSearchProps {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
}

const ChatSearch = ({value, placeholder, onChangeText}: ChatSearchProps) => {
  return (
    <View style={styles.container}>
      {svgIcon.Search}
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={PFColors.Gray.DarkGray}
        onChangeText={onChangeText}
        style={styles.textStyle}
      />
    </View>
  );
};

export default ChatSearch;

const styles = StyleSheet.create({
  container: {
    backgroundColor: PFColors.Gray.WhisperGray,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 12,
    justifyContent: 'space-between',
    ...Platform.select({
      android: {
        paddingHorizontal: 12,
        paddingVertical: 4,
      },
      ios: {
        paddingHorizontal: 14,
        paddingVertical: 14,
      },
    }),
  },
  textStyle: {
    width: '90%',
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
});
