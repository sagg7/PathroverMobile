import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { WP, PFColors, isIOS, PFFonts, PFFontSize } from '../../../shared/exporter';
import { svgIcon } from '../../../assets/svg';

interface UploaderInputProps {
  placeholder?: string;
  value?: string;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;

}

const UploaderInput: React.FC<UploaderInputProps> = ({
  placeholder,
  value,
  onPress,
  containerStyle,
  inputStyle
}) => {
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
      inputRange: [0, 1],
      outputRange: [isIOS() ? 17 : 10, isIOS() ? 4 : 1],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 10],
    }),
    color: PFColors.Gray.DarkGray,
    paddingHorizontal: WP('1'),
    fontFamily: PFFonts.Foundation.Regular,
    backgroundColor: PFColors.Gray.WhisperGray,
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={() => {
          setFocused(true);
          onPress();
        }}>
        <Animated.Text style={labelStyle}>
          {placeholder}
        </Animated.Text>
        <Text style={[styles.valueStyle, inputStyle]}>
          {value || ''}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
        >
          {svgIcon.Calendar}
        </TouchableOpacity>
      </TouchableOpacity>


    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WP('95'),
    height: WP('14'),
    alignItems: 'center',
    borderRadius: WP('2'),
    flexDirection: 'row',
    marginTop: WP('4'),
    paddingHorizontal: WP('4'),
    justifyContent: 'space-between',
    backgroundColor: PFColors.Gray.WhisperGray,
    alignSelf: "center",

  },
  valueStyle: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.Regular,
    paddingTop: 5
  },
  errorTxtStyle: {
    marginVertical: WP('1'),
    color: PFColors.Red.ErrorColor,
    alignSelf: 'flex-start',
  },
});

export { UploaderInput };
