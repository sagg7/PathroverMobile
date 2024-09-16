import { View } from 'react-native';
import React from 'react';
import styles from './styles';
import {
  AppButton,
  AppHeader,
  AppInput,
  AppLoader,
  MainWrapper,
} from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  forgotPassValidation,
  forgotPasswordInitialObject,
  useKeyboardListener,
  isIOS,
  formatPhoneNumber,
  showAlert,
  UNEXPECTED_ERROR,
  Routes,
  LOGIN_TYPE_TEXT,
} from '../../../shared/exporter';
import { useForgotPasswordMutation } from '../../../redux/auth/authApiSlice';

const ForgotPassword = ({ }) => {
  const keyboardVisible = useKeyboardListener();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const route = useRoute();
  const { isEmail } = route?.params;
  const navigation = useNavigation();

  const handleContinueBtn = async (val: any) => {
    const { email, phone } = val;
    const obj = {
      user: {
        ...(email && { email: email }),
        ...(phone && { phone_number: phone }),
      },
    };

    const resp = await forgotPassword(obj);
    if (resp?.data) {
      navigation.navigate(Routes.VerifyOtp, {
        selectedValue: isEmail ? email : phone,
        isEmail: isEmail,
      });
    } else {
      showAlert('Error', resp?.error?.data?.errors[0] || UNEXPECTED_ERROR);
    }
  };

  const text = isEmail ? LOGIN_TYPE_TEXT.EMAIL : LOGIN_TYPE_TEXT.PHONE;
  return (
    <MainWrapper>
      <AppHeader
        title="Forgot Password"
        subtitle="Forgot Password"
        desc={`Enter your ${text} to recover your password`}
      />
      <KeyboardAwareScrollView
        enableAutomaticScroll={true}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewStyle,
          !isIOS() && styles.heightStyle,
        ]}>
        <View>
          <View style={styles.formikContainer}>
            <Formik
              initialValues={forgotPasswordInitialObject}
              validationSchema={forgotPassValidation(isEmail)}
              validateOnMount={true}
              onSubmit={values => handleContinueBtn(values)}>
              {({
                handleChange,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => {

                return (
                  <View style={{ alignSelf: 'center' }}>
                    {isEmail ? (
                      <AppInput
                        placeholder="Email"
                        value={values.email}
                        onChangeText={handleChange('email')}
                        touched={touched.email}
                        errorMessage={errors.email}

                      />
                    ) : (
                      <AppInput
                        placeholder="Phone No"
                        value={values.phone}
                        onChangeText={text => {
                          const formatted = formatPhoneNumber(text);
                          setFieldValue('phone', formatted);
                        }}
                        touched={touched.phone}
                        errorMessage={errors.phone}
                        keyboardType={"numeric"}
                      />
                    )}

                    <View style={styles.divider}>
                      <AppButton
                        title="Continue"
                        handleClick={handleSubmit}
                        buttonStyle={styles.btnContainer(keyboardVisible)}
                      />
                    </View>
                  </View>
                );
              }}
            </Formik>
          </View>
        </View>
      </KeyboardAwareScrollView>
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default ForgotPassword;
