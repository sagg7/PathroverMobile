import { View } from 'react-native';
import React from 'react';
import styles from './styles';
import { AppButton, AppHeader, AppInput, AppLoader, MainWrapper } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import { Routes, UNEXPECTED_ERROR, isIOS, resetPasswordVal, showAlert, signupPasswordObj, useKeyboardListener } from '../../../shared/exporter';
import { useResetPasswordMutation } from '../../../redux/auth/authApiSlice';
import { useNavigation, useRoute } from '@react-navigation/native';

const ResetPassword = ({ }) => {
  const keyboardVisible = useKeyboardListener()
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const route = useRoute()
  const { value, isEmail } = route?.params
  const navigation = useNavigation()
  let isValidForm = true;

  const handleContinueBtn = async (val: any) => {
    const { email, phone } = val
    const obj = {
      user: {
        ...(isEmail && { email: value }),
        ...(!isEmail && { phone_number: value }),
        password: val.password
      }
    }

    const resp = await resetPassword(obj);
    if (resp?.data) {
      navigation.replace(Routes.AccountCreationSuccess)

    } else {
      showAlert("Error", resp?.error?.data?.error || UNEXPECTED_ERROR)

    }
  }


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
              onSubmit={values =>
                handleContinueBtn(values)
              }>
              {({ handleChange, handleSubmit, values, errors, touched, isValid, dirty }) => {
                if (isValidForm) {
                  isValid = false;
                  isValidForm = false;
                }
                return (
                  <View style={{ alignSelf: 'center' }}>

                    <AppInput
                      placeholder="Password"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      touched={touched.password}
                      errorMessage={errors.password}
                      rightIcon
                      secureTextEntry
                    />
                    <AppInput
                      placeholder="Re-enter Password"
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      touched={touched.confirmPassword}
                      errorMessage={errors.confirmPassword}
                      rightIcon
                      secureTextEntry

                    />
                    <View style={styles.divider} >
                      <AppButton title="Continue" handleClick={handleSubmit}
                        disabled={!isValid}
                        buttonStyle={styles.btnContainer(keyboardVisible)} />
                    </View>
                  </View>
                );
              }}
            </Formik>

          </View>
        </View>
        {isLoading && <AppLoader />}
      </KeyboardAwareScrollView>
    </MainWrapper>
  );
};

export default ResetPassword;
