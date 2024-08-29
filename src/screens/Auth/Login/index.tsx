import { View } from 'react-native';
import React from 'react';
import styles from './styles';
import { AppButton, AppHeader, AppInput, MainWrapper } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import { loginInitialObj, loginValidation } from '../../../shared/utils/validations';
import { isIOS } from '../../../shared/exporter';
import useKeyboardListener from '../../../hooks/keyboard';

const LoginScreen = ({ }) => {
  const keyboardVisible = useKeyboardListener()

  return (
    <MainWrapper>
      <AppHeader title="Login" subtitle="Login" desc="Enter your email and password" />
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
              initialValues={loginInitialObj}
              validationSchema={loginValidation}
              onSubmit={values => {
                // Handle login submission
              }}>
              {({ handleChange, handleSubmit, values, errors, touched, isValid, dirty }) => (
                <View style={{ alignSelf: 'center' }}>
                  <AppInput
                    placeholder="Email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    touched={touched.email}
                    errorMessage={errors.email}

                  />
                  <AppInput
                    placeholder="Password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    touched={touched.password}
                    errorMessage={errors.password}
                    rightIcon
                    secureTextEntry
                  />
                  <View style={styles.divider} >
                    <AppButton title="Login" handleClick={handleSubmit} disabled={!(dirty && isValid)} buttonStyle={styles.btnContainer(keyboardVisible)} />
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

export default LoginScreen;
