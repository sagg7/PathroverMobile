import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleProp,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextStyle,
} from 'react-native';
import {
  WP,
  GLColors,
  PFColors,
  isIOS,
  PFFonts,
  PFFontSize,
} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';

interface AppInputProps {
  placeholder?: string;
  value?: string;
  onChangeText: (text: string) => void;
  leftIcon?: any;
  editable?: boolean;
  errorMessage?: string | any;
  touched?: any;
  maxLength?: number;
  multiline?: boolean;
  container?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  secureTextEntry?: boolean;
  onEndEditing?: () => void;
  onSubmitEditing?: () => void;
  rightIconPress?: () => void;
  keyboardType?: string | any;
  autoCapitalize?: string | any;
  rightIcon?: any;
  icon?: any;
  textAlignVertical?: string | any;
  countryPicker?: any;
  countryInput?: boolean;
  onSelect?: () => void;
  placeholderFontFamily?: string;
  placeholderBackgroundColor?: string;
}

const AppInput: React.FC<AppInputProps> = ({
  placeholder,
  value,
  onChangeText,
  editable,
  errorMessage,
  touched,
  maxLength,
  multiline,
  secureTextEntry,
  onEndEditing,
  onSubmitEditing,
  keyboardType,
  autoCapitalize,
  rightIcon,
  inputStyle,
  icon,
  textAlignVertical,
  inputContainerStyle,
  rightIconPress,
  placeholderFontFamily,
  placeholderBackgroundColor,
}) => {
  const [showPass, setShowPass] = useState(secureTextEntry);
  const [focused, setFocused] = useState(false);

  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: focused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused, value]);

  const labelStyle = {
    position: 'absolute',
    left: WP('3'),
    top: animatedIsFocused.interpolate({
      inputRange: [0, 2],
      outputRange: [isIOS() ? 17 : 10, isIOS() ? -8 : -8],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 10],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [PFColors.Gray.DarkGray, PFColors.Gray.DarkGray],
    }),
    paddingHorizontal: WP('1'),
    fontFamily: placeholderFontFamily ?? PFFonts.Foundation.Regular,
    backgroundColor: placeholderBackgroundColor ?? PFColors.Gray.WhisperGray,
  };

  return (
    <>
      <View
        style={[
          styles.inputContainerView(touched && errorMessage, focused),
          inputContainerStyle,
        ]}>
        <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>
        <TextInput
          value={value}
          editable={editable}
          onChangeText={onChangeText}
          style={[styles.inputContainerStyle(rightIcon), inputStyle]}
          maxLength={maxLength}
          multiline={multiline}
          secureTextEntry={showPass}
          onEndEditing={onEndEditing}
          onSubmitEditing={onSubmitEditing}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          textAlignVertical={textAlignVertical}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => (icon ? rightIconPress() : setShowPass(!showPass))}>
          {rightIcon &&
            focused &&
            (icon ? icon : showPass ? svgIcon.EyeIconOf : svgIcon.EyeIconOn)}
        </TouchableOpacity>
      </View>
      {touched && errorMessage && (
        <Text style={styles.errorTxtStyle}>{errorMessage}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainerView: (isError: boolean, focused: boolean) => ({
    width: '100%',
    borderWidth: 1,
    height: WP('14'),
    alignItems: 'center',
    borderRadius: WP('2'),
    flexDirection: 'row',
    marginTop: WP('4'),
    paddingHorizontal: WP('4'),
    justifyContent: 'space-between',
    borderColor: isError
      ? PFColors.Red.ErrorColor
      : focused
      ? PFColors.Blue.Dark
      : PFColors.Gray.SoftGray,
    backgroundColor: PFColors.Gray.WhisperGray,
    alignSelf: 'center',
  }),

  inputContainerStyle: (rightIcon: any) => ({
    height: '100%',
    color: PFColors.Standard.Black,
    width: rightIcon ? '90%' : '100%',
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.Regular,
  }),
  errorTxtStyle: {
    marginVertical: WP('1'),
    color: PFColors.Red.ErrorColor,
    alignSelf: 'flex-start',
  },
});

export {AppInput};
