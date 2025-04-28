import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {AppHeader, AppLoader, MainWrapper} from '../../../components';
import {useVerifyOtpMutation} from '../../../redux/auth/authApiSlice';
import {Routes, UNEXPECTED_ERROR, showAlert} from '../../../shared/exporter';
import styles from './styles';

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
          ...(isEmail && {email: selectedValue?.toLowerCase()}),
          ...(!isEmail && {phone_number: selectedValue}),
          otp: value,
        },
      };

      const resp: any = await verifyOtp(obj);
      if (resp?.data?.message === 'OTP is correct.') {
        navigation.replace(Routes.ResetPassword, {
          value: selectedValue,
          isEmail: isEmail,
        });
      } else {
        showAlert('Error', resp?.error?.data?.success || UNEXPECTED_ERROR);
      }
    } catch (e) {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  return (
    <MainWrapper>
      <AppHeader title="PathRover" />
      <Text style={styles.desc}>
        {`Please check your ${
          isEmail ? 'email' : 'number'
        }. We send you the verification code.`}
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
