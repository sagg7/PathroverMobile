import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {AppButton, AppHeader, MainWrapper} from '../../../../../components';
import {
  UNEXPECTED_ERROR,
  showAlert,
  useKeyboardListener,
} from '../../../../../shared/exporter';
import styles from './styles';
import {
  useAddPhoneNumberMutation,
  useOtpVerificationMutation,
} from '../../../../../redux/chat/chatApiSlice';
import {useDispatch, useSelector} from 'react-redux';
import {setLoginUser} from '../../../../../redux/auth/authSlice';

const VerifyNumber = () => {
  const {params} = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const keyboardVisible = useKeyboardListener();
  const {loginUser} = useSelector(state => state.auth);

  const CELL_COUNT = 4;

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});

  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(59);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [addPhoneNumber] = useAddPhoneNumberMutation();
  const [otpVerification, {isError, error, isLoading}] =
    useOtpVerificationMutation();

  const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (error) {
      showAlert(
        'Error',
        error?.data?.error ||
          error?.data?.success ||
          'Unable to process request. Please try again!.',
      );
    }
  }, [isError]);
  useEffect(() => {
    if (value?.length > 3) onPressVerify();
  }, [value]);

  useEffect(() => {
    let interval = null;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev > 0) {
            return prev - 1;
          }
          if (interval) {
            clearInterval(interval);
          }
          setIsResendDisabled(false);
          return 0;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isResendDisabled]);

  const onPressVerify = async () => {
    try {
      const obj = {
        user: {
          otp: value,
        },
      };
      const res = await otpVerification(obj);
      if (res?.data) {
        dispatch(setLoginUser({...loginUser, verified: true}));
        navigation.navigate('Chat');
      }
    } catch (e) {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  const onPressResend = async () => {
    if (!isResendDisabled) {
      setTimer(59);
      setIsResendDisabled(true);
      const res = await addPhoneNumber(params);
      console.log('res', res?.data);

      Alert.alert(
        'OTP',
        `Remember your otp ${res?.data?.otp ? res?.data?.otp : ''}`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('VerifyNumber', params);
            },
          },
        ],
      );
    }
  };

  return (
    <MainWrapper>
      <AppHeader title="Path Rover" />
      <View style={styles.container}>
        <Text style={styles.desc}>
          Please check your phone .We send you the {'\n'}verification code.
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
            editable={!isLoading}
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
        <TouchableOpacity
          style={styles.timerView}
          disabled={isResendDisabled}
          onPress={() => onPressResend()}>
          <Text style={styles.resendText}>
            Resend code {!isResendDisabled ? '' : 'in '}
          </Text>
          {isResendDisabled && (
            <Text style={styles.timerText}>{`0:${timer
              .toString()
              .padStart(2, '0')}`}</Text>
          )}
        </TouchableOpacity>
        {/* <View style={styles.divider}>
          <AppButton
            title="Continue"
            handleClick={onPressVerify}
            isLoading={isLoading}
            disabled={isLoading}
            // buttonStyle={styles.btnContainer(keyboardVisible)}
          />
        </View> */}
      </View>
      {/* {isLoading && <AppLoader />} */}
    </MainWrapper>
  );
};

export default VerifyNumber;
