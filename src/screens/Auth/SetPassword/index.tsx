import { View } from 'react-native';
import React from 'react';
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
  const { email, phone, name } = values
  const [signup, { isLoading, }] = useSignUpMutation()
  let isValidForm = true;
  const navigation = useNavigation()
  const keyboardVisible = useKeyboardListener()

  const handleContinueBtn = async (val: any) => {
    const obj = {
      user: {
        ...(email && { email: email }),
        ...(phone && { phone_number: removeNonNumbers(phone) }),
        full_name: name,
        password: val.password
      }
    }

    const resp = await signup(obj);
    if (resp?.data) {
      navigation.navigate(Routes.AccountCreationSuccess)
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
        {isLoading &&
          <AppLoader />
        }

      </KeyboardAwareScrollView>
    </MainWrapper>
  );
};

export default SetPassword;
