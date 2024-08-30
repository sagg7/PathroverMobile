import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  WP,
  PFColors,
  PFFontSize,
  PFFonts,
} from '../../../shared/exporter';

interface AppButtonProps {
  icon?: any;
  title: string;
  textStyle?: any;
  isEmpty?: boolean;
  buttonStyle?: any;
  disabled?: boolean;
  handleClick?: () => void;
  isSmall?: string
}

function AppButton({
  icon,
  title,
  disabled,
  textStyle,
  buttonStyle,
  handleClick,
  isEmpty = true,
  isSmall
}: AppButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.7}
      onPress={handleClick}
      style={[styles.buttonContainer(disabled, isSmall), buttonStyle]}>
      {icon ? icon : <View style={styles.emptyViewStyle} />}
      <Text style={[styles.typeTextStyle, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: (isDisabled: boolean, isSmall: string) => ({
    width: isSmall ? isSmall : '100%',
    height: WP('12'),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: WP('10'),
    paddingHorizontal: WP('5'),
    justifyContent: 'center',
    backgroundColor: isDisabled ? PFColors.Standard.Disable : PFColors.Blue.Dark,
  }),
  typeTextStyle: {
    color: PFColors.Standard.White,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
    paddingHorizontal: 10
  },
  emptyViewStyle: {
    width: WP('7'),
    height: WP('7'),
  },
});

export { AppButton };
