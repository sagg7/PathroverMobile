import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {WP, PFColors, PFFontSize, PFFonts} from '../../../shared/exporter';

interface AppButtonProps {
  icon?: any;
  title: string;
  textStyle?: any;
  isEmpty?: boolean;
  buttonStyle?: any;
  disabled?: boolean;
  handleClick?: () => void;
  isSmall?: string;
  isLoading?: boolean;
}

function AppButton({
  icon,
  title,
  disabled,
  textStyle,
  buttonStyle,
  handleClick,
  isSmall,
  isLoading,
}: AppButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.7}
      onPress={handleClick}
      style={[styles.buttonContainer(disabled, isSmall), buttonStyle]}>
      {icon ? icon : null}
      {isLoading ? (
        <ActivityIndicator size={'small'} color={PFColors.Standard.White} />
      ) : (
        <Text style={[styles.typeTextStyle(icon), textStyle]}>{title}</Text>
      )}
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
    backgroundColor: isDisabled
      ? PFColors.Standard.Disable
      : PFColors.Blue.Dark,
  }),
  typeTextStyle: icon => ({
    color: PFColors.Standard.White,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
    paddingLeft: icon ? 10 : 0,
  }),
});

export {AppButton};
