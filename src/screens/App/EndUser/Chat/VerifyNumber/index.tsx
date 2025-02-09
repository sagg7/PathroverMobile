import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
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

const VerifyNumber = () => {
  const {params} = useRoute();
  const navigation = useNavigation();
  const keyboardVisible = useKeyboardListener();

  const CELL_COUNT = 4;

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});

  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(59);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (value.length > 3) {
      onPressVerify();
    }
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
    } catch (e) {
      showAlert('Error', UNEXPECTED_ERROR);
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
        <TouchableOpacity
          style={styles.timerView}
          disabled={isResendDisabled}
          onPress={() => {
            if (!isResendDisabled) {
              setTimer(59);
              setIsResendDisabled(true);
            }
          }}>
          <Text style={styles.resendText}>
            Resend code {!isResendDisabled ? '' : 'in '}
          </Text>
          {isResendDisabled && (
            <Text style={styles.timerText}>{`0:${timer
              .toString()
              .padStart(2, '0')}`}</Text>
          )}
        </TouchableOpacity>
        <View style={styles.divider}>
          <AppButton
            title="Continue"
            handleClick={onPressVerify}
            buttonStyle={styles.btnContainer(keyboardVisible)}
          />
        </View>
      </View>
      {/* {isLoading && <AppLoader />} */}
    </MainWrapper>
  );
};

export default VerifyNumber;
