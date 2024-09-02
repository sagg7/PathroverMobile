import { View } from 'react-native';
import React, { useRef } from 'react';
import styles from './styles';
import { AppButton, AppHeader, AppInput, MainWrapper } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import { Routes, createValidationSchema, formatPhoneNumber, isIOS, signupInitialObject, useKeyboardListener } from '../../../shared/exporter';
import { useNavigation, useRoute } from '@react-navigation/native';

const SignupScreen = ({ }) => {
  const keyboardVisible = useKeyboardListener()
  let isValidForm = true;
  const navigation = useNavigation()
  const route = useRoute()
  const { isEmail } = route?.params
  const formik = useRef()

  const handleContinueBtn = (values) => {
    navigation.navigate(Routes.SetPassword, { values: values })
  }

  return (
    <MainWrapper>
      <AppHeader title="Signup" subtitle="Create New Account" desc="Enter your name and email" />
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
              innerRef={formik}
              enableReinitialize
              initialValues={signupInitialObject}
              validationSchema={createValidationSchema(isEmail)}
              onSubmit={values => {
                handleContinueBtn(values)
              }}>
              {({ handleChange, handleSubmit, values, errors, touched, isValid, setFieldValue }) => {
                if (isValidForm) {
                  isValid = false;
                  isValidForm = false;
                }
                return (
                  <View style={{ alignSelf: 'center' }}>

                    <AppInput
                      placeholder="Full Name"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      touched={touched.name}
                      errorMessage={errors.name}
                    />
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
                        disabled={!isValid}
                        buttonStyle={styles.btnContainer(keyboardVisible)} />
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
