import React, { useEffect, useRef, useState } from 'react';
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
import { svgIcon } from '../../../assets/svg';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal'


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
  keyboardType?: string | any;
  autoCapitalize?: string | any;
  textAlignVertical?: string | any;
  countryPicker?: any;
  countryInput?: boolean;
  onSelectCode?: (country: object) => void;
  placeholderFontFamily?: string;
  placeholderBackgroundColor?: string;
  phoneCountryCode?: string;
}

const CountryCodeInput: React.FC<AppInputProps> = ({
  placeholder,
  value,
  onChangeText,
  editable,
  errorMessage,
  touched,
  maxLength,
  multiline,
  onEndEditing,
  onSelectCode,
  onSubmitEditing,
  keyboardType,
  autoCapitalize,
  inputStyle,
  textAlignVertical,
  inputContainerStyle,
  placeholderFontFamily,
  placeholderBackgroundColor,
  phoneCountryCode,
}) => {
  const [focused, setFocused] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>('US')
  const [country, setCountry] = useState<Country>()

  useEffect(() => {
    if (phoneCountryCode) {
      setCountryCode(phoneCountryCode);
    }
  }
  , [phoneCountryCode]);


  const onSelect = (country: Country) => {
    console.log('Country selected:', country);

    setCountryCode(country.cca2)
    setCountry(country)
    onSelectCode(country);
  }

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
      outputRange: [0, 2],
      // outputRange: [isIOS() ? 17 : 10, isIOS() ? -8 : -8],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 10],
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
        <View style={styles.containerView}>
          <CountryPicker
            {...{
              countryCode,
              withFilter: true,
              withFlag: true,
              withCountryNameButton: false,
              withAlphaFilter: false,
              withCallingCode: true,
              withEmoji: true,
              onSelect,
              withCallingCodeButton: true,
            }}
            visible={false}
          />
          <TextInput
            value={value}
            editable={editable}
            onChangeText={onChangeText}
            style={[styles.inputContainerStyle(), inputStyle]}
            maxLength={maxLength}
            multiline={multiline}
            onEndEditing={onEndEditing}
            onSubmitEditing={onSubmitEditing}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            textAlignVertical={textAlignVertical}
          />
        </View>
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

  inputContainerStyle: () => ({
    height: '100%',
    color: PFColors.Standard.Black,
    width: '75%',
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.Regular,

  }),
  errorTxtStyle: {
    marginVertical: WP('1'),
    color: PFColors.Red.ErrorColor,
    alignSelf: 'flex-start',
  },
  containerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  }
});

export { CountryCodeInput };
