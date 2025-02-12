import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppHeader, AppLoader, MainWrapper} from '../../../components';
import styles from './styles';
import {
  Routes,
  UNEXPECTED_ERROR,
  removeNonNumbers,
  showAlert,
} from '../../../shared/exporter';
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useVerifyOtpMutation} from '../../../redux/auth/authApiSlice';
import {useNavigation, useRoute} from '@react-navigation/native';

const VerifyOtpScreen = ({}) => {
  const [value, setValue] = useState('');
  const [verifyOtp, {isLoading, data}] = useVerifyOtpMutation();
  const navigation = useNavigation();
  const CELL_COUNT = 4;
  const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const route = useRoute();
  const {isEmail, selectedValue} = route?.params;

  useEffect(() => {
    if (value.length > 3) {
      onPressVerify();
    }
  }, [value]);

  const onPressVerify = async () => {
    try {
      const obj = {
        user: {
          ...(isEmail && {email: selectedValue}),
          ...(!isEmail && {phone_number: removeNonNumbers(selectedValue)}),
          otp: value,
        },
      };

      const resp = await verifyOtp(obj);
      if (resp?.data) {
        navigation.replace(Routes.ResetPassword, {
          value: selectedValue,
          isEmail: isEmail,
        });
      } else {
        showAlert('Error', resp?.error?.data?.error || UNEXPECTED_ERROR);
      }
    } catch (e) {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  return (
    <MainWrapper>
      <AppHeader title="Path Rover" />
      <Text style={styles.desc}>
        Please check your email. We send you the{'\n'}verification code.
      </Text>

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
          renderCell={({index, symbol, isFocused}) => (
            <View
              key={index}
              style={[styles.cell(symbol), isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              <Text style={styles.txtStyle}>
                {symbol || (isFocused ? '' : '-')}
              </Text>
            </View>
          )}
        />
      </View>
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default VerifyOtpScreen;
