import {View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import styles from './styles';
import {AppButton, AppHeader, AppInput, MainWrapper} from '../../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {
  Routes,
  createValidationSchema,
  formatPhoneNumber,
  isIOS,
  signupInitialObject,
  useKeyboardListener,
} from '../../../shared/exporter';
import {useNavigation, useRoute} from '@react-navigation/native';
import { CountryCodeInput } from '../../../components/complex/CountryCodeInput';

const SignupScreen = ({}) => {
  const keyboardVisible = useKeyboardListener();
  const navigation = useNavigation();
  const route = useRoute();
  const {isEmail} = route?.params;
  const formik = useRef();
  const [initialValues, setinitialValues] = useState(signupInitialObject);
  useEffect(() => {
    setinitialValues(signupInitialObject);
  }, []);

  const handleContinueBtn = values => {
    navigation.navigate(Routes.SetPassword, {values: values});
  };

  return (
    <MainWrapper>
      <AppHeader
        title="Signup"
        subtitle="Create New Account"
        desc={`Enter your name and ${isEmail ? 'email' : 'phone number'}`}
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
              innerRef={formik}
              initialValues={initialValues}
              enableReinitialize
              validationSchema={createValidationSchema(isEmail)}
              onSubmit={(values, {resetForm}) => {
                handleContinueBtn(values);
                // resetForm();
              }}>
              {({
                handleChange,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => {
                return (
                  <View style={{alignSelf: 'center'}}>
                    <AppInput
                      placeholder="First Name"
                      value={values.firstName}
                      onChangeText={handleChange('firstName')}
                      touched={touched.firstName}
                      errorMessage={errors.firstName}
                    />
                    <AppInput
                      placeholder="Last Name"
                      value={values.lastName}
                      onChangeText={handleChange('lastName')}
                      touched={touched.lastName}
                      errorMessage={errors.lastName}
                    />
                    {isEmail ? (
                      <AppInput
                        placeholder="Email"
                        value={values.email}
                        onChangeText={handleChange('email')}
                        touched={touched.email}
                        errorMessage={errors.email}
                      />
                    ) : (
                      <CountryCodeInput
                        placeholder="Phone No"
                        value={values.phone}
                        phoneCountryCode={values.countryCode}
                        onChangeText={text => {
                          setFieldValue('phone', text);
                          // Trigger validation
                          if (values.callingCode && values.countryCode) {
                            formik.current?.validateField('phone');
                          }
                        }}
                        touched={touched.phone}
                        errorMessage={errors.phone}
                        keyboardType="numeric"
                        onSelectCode={country => {
                          setFieldValue('callingCode', country?.callingCode[0]);
                          setFieldValue('countryCode', country?.cca2);

                          if (values.callingCode && values.countryCode) {
                            formik.current?.validateField('phone');
                          }
                        }}
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
    </MainWrapper>
  );
};

export default SignupScreen;
