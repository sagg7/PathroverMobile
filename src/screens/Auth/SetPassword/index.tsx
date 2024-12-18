import { View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import styles from './styles';
import { AppButton, AppHeader, AppInput, AppLoader, MainWrapper } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import { Routes, UNEXPECTED_ERROR, isIOS, removeNonNumbers, resetPasswordVal, showAlert, signupPasswordObj, useKeyboardListener } from '../../../shared/exporter';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSignUpMutation } from '../../../redux/auth/authApiSlice';

const SetPassword = ({ }) => {
  const route = useRoute()
  const { values } = route?.params
  const { email, phone, firstName, lastName } = values
  const [signup, { isLoading }] = useSignUpMutation()
  const navigation = useNavigation()
  const keyboardVisible = useKeyboardListener()
  const ref = useRef()

  const handleContinueBtn = async (val: any) => {
    const obj = {
      user: {
        ...(email && { email: email }),
        ...(phone && { phone_number: removeNonNumbers(phone) }),
        first_name: firstName,
        last_name: lastName,
        password: val.password
      }
    }

    const resp = await signup(obj);
    if (resp?.data) {
      navigation.replace(Routes.AccountCreationSuccess)
    } else {
      showAlert("Error", resp?.error?.data?.errors[0] || UNEXPECTED_ERROR)
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
              innerRef={ref}
              enableReinitialize
              initialValues={signupPasswordObj}
              validationSchema={resetPasswordVal}
              onSubmit={(values, { resetForm }) => {
                handleContinueBtn(values)
              }
              }>
              {({ handleChange, handleSubmit, values, errors, touched }) => {

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
                        buttonStyle={styles.btnContainer(keyboardVisible)} />
                    </View>
                  </View>
                );
              }}
            </Formik>

          </View>
        </View>
        {isLoading &&
          <AppLoader />
        }

      </KeyboardAwareScrollView>
    </MainWrapper >
  );
};

export default SetPassword;
