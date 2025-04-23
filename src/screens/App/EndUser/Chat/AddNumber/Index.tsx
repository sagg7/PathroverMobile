import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import parsePhoneNumberFromString from 'libphonenumber-js';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import {
  AppButton,
  AppHeader,
  MainWrapper
} from '../../../../../components';
import { CountryCodeInput } from '../../../../../components/complex/CountryCodeInput';
import NumberVerifyModal from '../../../../../components/complex/NumberVerifyModal';
import { useAddPhoneNumberMutation } from '../../../../../redux/chat/chatApiSlice';
import {
  showAlert,
  useKeyboardListener
} from '../../../../../shared/exporter';
import { AddNumberValidation } from '../../../../../shared/utils/validations';
import styles from './styles';

const AddNumber = () => {
  const formikRef = useRef(null);
  const navigation = useNavigation();
  const keyboardVisible = useKeyboardListener();
  const { loginUser } = useSelector(state => state.auth);

  const [addPhoneNumber, { error, isError, isLoading }] =
    useAddPhoneNumberMutation();

  const [isVisible, setIsVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({
    phone: '',
    callingCode:  '1',
    countryCode: 'US',
  });

  useEffect(() => {
    if (error) {
      setIsVisible(false);
      showAlert(
        'Error',
        error?.data?.error || 'Unable to process request. Please try again!.',
      );
    }
  }, [isError]);

  useEffect(() => {
    if (loginUser?.phone_number) {
      const parsedNumber = parsePhoneNumberFromString('+' + loginUser?.phone_number);
      if (parsedNumber) {
        setInitialValues({
          phone: parsedNumber.nationalNumber,
          callingCode: parsedNumber.country ? parsedNumber.countryCallingCode : '1',
          countryCode: parsedNumber.country?.toString()?? 'US',
        });
      } else {
        setInitialValues({
          phone: loginUser?.phone_number,
          callingCode: loginUser?.country_code,
          countryCode: 'US',
        });
      }
    }
  }, [loginUser]);

  const handleContinueBtn = () => {
    setIsVisible(true);
  };

  const onPressContinue = async (values: object) => {
    try {
      const data = {
        phone_number: values?.callingCode?.includes('+') ? `${values?.callingCode}${values?.phone}` : `+${values?.callingCode}${values?.phone}`,
      };
      const res = await addPhoneNumber(data);

      if (res?.data) {
        setIsVisible(false);
        navigation.navigate('VerifyNumber', data);
      } else {
        showAlert('Error', res?.error?.data?.error);
      }
    } catch (error) {
      //
    }
  };

  return (
    <MainWrapper>
      <AppHeader
        title="Add Phone Number"
        clickBackIcon={() => navigation.pop()}
      />
      <KeyboardAwareScrollView
        enableOnAndroid
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        enableAutomaticScroll
        keyboardShouldPersistTaps={'handled'}>
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={initialValues}
          validateOnChange={true}
          validateOnBlur={true}
          validationSchema={AddNumberValidation}
          onSubmit={handleContinueBtn}>
          {({ handleSubmit, values, errors, touched, setFieldValue, setFieldError, handleBlur }) => (
            <View style={styles.container}>
              <Text style={styles.titleStyle}>Verify Your Phone number</Text>
              <Text style={styles.subTitleStyle}>Enter your phone number</Text>

              <CountryCodeInput
                placeholder="Phone No"
                value={values.phone}
                phoneCountryCode={values.countryCode}
                onChangeText={text => {
                  // const formatted = formatPhoneNumber(text);
                  setFieldValue('phone', text);
                  // Trigger validation
                  if (values.callingCode && values.countryCode) {
                    formikRef.current?.validateField('phone');
                  }
                }}
                touched={touched.phone}
                errorMessage={errors.phone}
                keyboardType="numeric"
                onSelectCode={country => {
                  setFieldValue('callingCode', country?.callingCode[0]);
                  setFieldValue('countryCode', country?.cca2);

                  if (values.callingCode && values.countryCode) {
                    formikRef.current?.validateField('phone');
                  }
                }}
              />
              <View style={styles.divider(keyboardVisible)}>
                <AppButton
                  title="Next"
                  handleClick={handleSubmit}
                  buttonStyle={styles.btnContainer(keyboardVisible)}
                />
              </View>

              {isVisible && (
                <NumberVerifyModal
                  isVisible={isVisible}
                  setIsVisible={() => setIsVisible(false)}
                  number={values?.callingCode?.includes('+') ? `${values?.callingCode}${values?.phone}` : `+${values?.callingCode}${values?.phone}`}
                  onPressEdit={() => setIsVisible(false)}
                  onPressContinue={() => onPressContinue(values)}
                  isLoading={isLoading}
                />
              )}
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </MainWrapper>
  );
};

export default AddNumber;
