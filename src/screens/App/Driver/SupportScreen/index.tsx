import {View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import styles from './styles';
import {
  AppButton,
  AppHeader,
  AppInput,
  AppLoader,
  MainWrapper,
} from '../../../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {
  supportInitialObj,
  supportValidation,
} from '../../../../shared/exporter';
import {UNEXPECTED_ERROR, isIOS, showAlert} from '../../../../shared/exporter';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useSupportContactMutation} from '../../../../redux/driver/driverApiSlice';

const SupportScreen = () => {
  const [supportContact, {isLoading}] = useSupportContactMutation();
  const navigation = useNavigation();
  const formikRef = useRef();
  const loginUser = useSelector(state => state?.auth?.loginUser);

  useEffect(() => {
    if (formikRef.current) {
      const {setFieldValue} = formikRef.current;
      const {last_name, first_name, phone_number, email} = loginUser;
      first_name && setFieldValue('firstName', first_name);
      last_name && setFieldValue('lastName', last_name);
      email && setFieldValue('email', email);
    }
  }, []);

  const handleContinueBtn = async (val: any) => {
    const {email, firstName, lastName, message} = val;
    const obj = {
      message: {
        email: email,
        first_name: firstName,
        last_name: lastName,
        message: message,
      },
    };
    const resp = await supportContact(obj);
    if (resp?.data) {
      showAlert('Alert', 'Your message has been sent.');
      navigation.goBack();
    } else {
      showAlert('Error', resp?.error?.data?.errors[0] || UNEXPECTED_ERROR);
    }
  };

  return (
    <MainWrapper>
      <AppHeader title={'Support'} />
      <KeyboardAwareScrollView
        enableAutomaticScroll={true}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewStyle,
          !isIOS() && styles.heightStyle,
        ]}>
        <View>
          <View style={styles.formikContainer}>
            <Formik
              innerRef={formikRef}
              enableReinitialize
              initialValues={supportInitialObj}
              validationSchema={supportValidation}
              onSubmit={handleContinueBtn}>
              {({handleChange, handleSubmit, values, errors, touched}) => (
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
                  <AppInput
                    placeholder="Email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    touched={touched.email}
                    errorMessage={errors.email}
                  />
                  <AppInput
                    placeholder="Message"
                    value={values.message}
                    onChangeText={handleChange('message')}
                    touched={touched.message}
                    errorMessage={errors.message}
                    inputContainerStyle={styles.inputStyle}
                    textAlignVertical="top"
                    multiline={true}
                  />

                  <View style={styles.divider}>
                    <AppButton title="Save" handleClick={handleSubmit} />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </KeyboardAwareScrollView>
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default SupportScreen;
