import * as React from 'react';
import {Text, View, StyleSheet, TextInput} from 'react-native';
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
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 12,
    justifyContent: 'space-between',
  },
  textStyle: {
    width: '90%',
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
});
