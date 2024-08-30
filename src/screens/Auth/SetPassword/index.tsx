import { View } from 'react-native';
import React from 'react';
import styles from './styles';
import { AppButton, AppHeader, AppInput, MainWrapper } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import { createValidationSchema, isIOS, resetPasswordVal, signupInitialObject, signupPasswordObj, useKeyboardListener } from '../../../shared/exporter';

const SetPassword = ({ }) => {
  const keyboardVisible = useKeyboardListener()

  return (
    <MainWrapper>
      <AppHeader title="Set Password" />
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
              initialValues={signupPasswordObj}
              validationSchema={resetPasswordVal}
              onSubmit={values => {
                // Handle login submission
              }}>
              {({ handleChange, handleSubmit, values, errors, touched, isValid, dirty }) => (
                <View style={{ alignSelf: 'center' }}>

                  <AppInput
                    placeholder="Password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    touched={touched.password}
                    errorMessage={errors.password}
                  />
                  <AppInput
                    placeholder="Re-enter Password"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    touched={touched.confirmPassword}
                    errorMessage={errors.confirmPassword}

                  />
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

export default SetPassword;
