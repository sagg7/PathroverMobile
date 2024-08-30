import { Alert, Text, View } from 'react-native';
import React, { useRef } from 'react';
import styles from './styles';
import { AppButton, AppHeader, AppInput, MainWrapper } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import { useRoute } from '@react-navigation/native';
import { forgotPassValidation, forgotPasswordInitialObject, useKeyboardListener, isIOS, formatPhoneNumber } from '../../../shared/exporter';

const ForgotPassword = ({ }) => {
  const keyboardVisible = useKeyboardListener()
  const route = useRoute()
  const { isEmail } = route?.params

  return (
    <MainWrapper>
      <AppHeader title="Forgot Password"
        subtitle='Forgot Password'
        desc='Enter your email address to recover your password'
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
        <View >
          <View style={styles.formikContainer}>
            <Formik
              initialValues={forgotPasswordInitialObject}
              validationSchema={forgotPassValidation(isEmail)}
              onSubmit={values => {
                // Handle login submission
              }}>
              {({ handleChange, handleSubmit, values, errors, touched, isValid, dirty, setFieldValue }) => (
                <View style={{ alignSelf: 'center' }}>
                  {isEmail ?
                    <AppInput
                      placeholder="Email"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      touched={touched.email}
                      errorMessage={errors.email}
                    />
                    :
                    <AppInput
                      placeholder="Phone No"
                      value={values.phone}
                      onChangeText={(text) => {
                        const formatted = formatPhoneNumber(text);
                        setFieldValue('phone', formatted);
                      }}
                      touched={touched.phone}
                      errorMessage={errors.phone}

                    />
                  }

                  <View style={styles.divider} >
                    <AppButton title="Continue" handleClick={handleSubmit}
                      // disabled={!(dirty && isValid)}
                      buttonStyle={styles.btnContainer(keyboardVisible)} />
                  </View>
                </View>
              )}
            </Formik>

          </View>
        </View>
      </KeyboardAwareScrollView>
    </MainWrapper>
  );
};

export default ForgotPassword;
