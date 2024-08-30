import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  AppHeader,
  MainWrapper,
} from '../../../components';
import styles from './styles';
import {
  Routes, showAlert,
} from '../../../shared/exporter';
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
// import {
//   useForgotPasswordMutation,
//   useForgotUsernameMutation,
//   useVerifyOtpEmailMutation,
//   useVerifyOtpNumMutation,
// } from '../../../redux/auth/authApiSlice';

const VerifyOtpScreen = ({ route }) => {
  const [value, setValue] = useState('');
  const CELL_COUNT = 4;
  const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [seconds, setSeconds] = useState(30);
  // const { isEmail } = route?.params; || false

  useEffect(() => {
    if (value.length > 3) {
      // onPressVerify();
    }
  }, [value]);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [seconds]);



  const onPressVerify = async () => {
    if (value === '') {
      showAlert('Alert', 'Please enter code.');
    } else {
      try {
        const data = new FormData();
        data.append(isNumber ? 'phone_no' : 'email', userValue);
        data.append('otp', value);
        console.log('Value', data);
        const resp = isNumber
          ? await verifyOtpNum(data)
          : await verifyOtpEmail(data);

        if (resp?.data) {
          const routeName = isPassword
            ? Routes.ResetPassword
            : Routes.ResetUsername;
          navigation.navigate(routeName, {
            value: userValue,
          });
        } else {
          showAlert('Error', resp?.error?.data?.message);
        }
      } catch (e) {
        showAlert('Error', UNEXPECTED_ERROR);
      }
    }
  };

  return (
    <MainWrapper>
      <AppHeader title='Path Finder' />
      <Text style={styles.desc}>Please check your email. We send you the{'\n'}verification code.</Text>

      <View style={styles.otpView}>
        <CodeField
          secureTextEntry={true}
          ref={ref}
          value={value}
          {...codeFieldProps}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.otpInputBox}
          editable
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              style={[styles.cell(symbol), isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              <Text style={styles.txtStyle}>
                {symbol || (isFocused ? '' : '-')}
              </Text>
            </View>
          )}
        />
      </View>

    </MainWrapper>
  );
};

export default VerifyOtpScreen;
