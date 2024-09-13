import { Text, View } from 'react-native';
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
import {
  loginInitialObj,
  loginValidation,
} from '../../../shared/utils/validations';
import {
  Routes,
  UNEXPECTED_ERROR,
  formatPhoneNumber,
  isIOS,
  showAlert,
  useKeyboardListener,
} from '../../../shared/exporter';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLoginMutation } from '../../../redux/auth/authApiSlice';
import { useDispatch } from 'react-redux';
import { setLoginUser } from '../../../redux/auth/authSlice';

const LoginScreen = ({ }) => {
  let isValidForm = true;
  const keyboardVisible = useKeyboardListener();
  const [login, { data, isLoading }] = useLoginMutation();
  const dispatch = useDispatch()
  const route = useRoute();
  const navigation = useNavigation();
  const { isEmail } = route?.params;

  const handleContinueBtn = async (val: any) => {
    const { email, phone, password } = val;
    const obj = {
      user: {
        ...(email && { email: email }),
        ...(phone && { phone_number: phone }),
        password: password,
      },
    };

    const resp = await login(obj);
    dispatch(setLoginUser(resp?.data?.user))

    if (resp?.data) {
      navigation.replace('Home')
    } else {
      showAlert('Error', resp?.error?.data?.errors[0] || UNEXPECTED_ERROR);
    }
  };

  return (
    <MainWrapper>
      <AppHeader
        title="Login"
        subtitle="Login"
        desc="Enter your email and password"
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
              initialValues={loginInitialObj}
              validationSchema={loginValidation(isEmail)}
              onSubmit={values => {
                handleContinueBtn(values);
              }}>
              {({
                handleChange,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
                dirty,
                setFieldValue,
              }) => {
                if (isValidForm) {
                  isValid = false;
                  isValidForm = false;
                }
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
                      />
                    )}
                    <AppInput
                      placeholder="Password"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      touched={touched.password}
                      errorMessage={errors.password}
                      rightIcon
                      secureTextEntry
                      onSubmitEditing={() => console.log("ok")
                      }

                    />
                    <Text
                      onPress={() =>
                        navigation.navigate(Routes.ForgotPassword, {
                          isEmail: isEmail,
                        })
                      }
                      style={styles.forgotText}>
                      Forgot Password?
                    </Text>
                    <View style={styles.divider}>
                      <AppButton
                        title="Login"
                        handleClick={handleSubmit}
                        disabled={!isValid}
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

export default LoginScreen;
