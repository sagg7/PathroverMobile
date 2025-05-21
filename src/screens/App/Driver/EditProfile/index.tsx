import {useNavigation, useRoute} from '@react-navigation/native';
import {Formik} from 'formik';
import parsePhoneNumberFromString from 'libphonenumber-js';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppButton,
  AppHeader,
  AppInput,
  AppLoader,
  MainWrapper,
} from '../../../../components';
import {CountryCodeInput} from '../../../../components/complex/CountryCodeInput';
import {setLoginUser} from '../../../../redux/auth/authSlice';
import {useEdtProfileMutation} from '../../../../redux/driver/driverApiSlice';
import {
  UNEXPECTED_ERROR,
  isIOS,
  showAlert,
  useKeyboardListener,
} from '../../../../shared/exporter';
import {
  EditInitialObject,
  EditProfileValidation,
} from '../../../../shared/utils/validations';
import styles from './styles';

const EditProfile = () => {
  const keyboardVisible = useKeyboardListener();
  const [editProfile, {data, isLoading}] = useEdtProfileMutation();
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const {key} = route?.params;
  const formikRef = useRef();
  const loginUser = useSelector(state => state?.auth?.loginUser);
  const [values, setValues] = useState({title: '', desc: ''});

  useEffect(() => {
    if (formikRef.current) {
      const {setFieldValue} = formikRef.current;
      const {last_name, first_name, phone_number, email} = loginUser;
      if (loginUser?.phone_number) {
        const parsedNumber = parsePhoneNumberFromString(
          loginUser?.phone_number?.includes('+')
            ? loginUser?.phone_number
            : '+' + loginUser?.phone_number,
        );
        if (parsedNumber) {
          setFieldValue(
            'countryCode',
            parsedNumber.country?.toString() ?? 'US',
          );
          setFieldValue(
            'callingCode',
            parsedNumber.country ? parsedNumber.countryCallingCode : '1',
          );
          phone_number && setFieldValue('phone', parsedNumber.nationalNumber);
        } else {
          setFieldValue('countryCode', 'US');
          setFieldValue('callingCode', loginUser?.country_code);
          phone_number && setFieldValue('phone', loginUser?.phone_number);
        }
      }
      first_name && setFieldValue('firstName', first_name);
      last_name && setFieldValue('lastName', last_name);
      email && setFieldValue('email', email);
    }
  }, []);

  const handleContinueBtn = useCallback(
    async val => {
      const {email, phone, password, firstName, lastName} = val;
      const obj = {
        profile: {
          ...(email && {email: email?.toLowerCase()}),
          ...(firstName && {first_name: firstName}),
          ...(lastName && {last_name: lastName}),
          ...(password && {password: password}),
          ...(phone && {
            phone_number: val?.callingCode?.includes('+')
              ? `${val?.callingCode}${phone}`
              : `+${val?.callingCode}${phone}`,
          }),
        },
      };

      const resp = await editProfile(obj);

      if (resp?.data) {
        showAlert('Alert', `Profile has been updated.`);
        const res = resp?.data?.profile;
        dispatch(
          setLoginUser({
            ...res,
            is_subscribed: true,
          }),
        );
        navigation.goBack();
      } else {
        showAlert('Error', resp?.error?.data?.errors[0] || UNEXPECTED_ERROR);
      }
    },
    [dispatch, navigation],
  );

  const renderFormFields = (
    key,
    values,
    handleChange,
    touched,
    errors,
    setFieldValue,
  ) => {
    switch (key) {
      case 0:
        return (
          <>
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
          </>
        );
      case 1:
        return (
          <AppInput
            placeholder="Email"
            value={values.email}
            onChangeText={handleChange('email')}
            touched={touched.email}
            errorMessage={errors.email}
          />
        );
      case 3:
        return (
          <CountryCodeInput
            placeholder="Phone No"
            value={values.phone}
            phoneCountryCode={values.countryCode}
            onChangeText={text => {
              setFieldValue('phone', text);
              // Trigger validation
              if (values.callingCode && values.countryCode) {
                formikRef.current?.validateField('phone');
              }
            }}
            touched={touched.phone}
            errorMessage={errors.phone}
            keyboardType="numeric"
            onSelectCode={country => {
              setFieldValue('callingCode', country?.callingCode[0]);
              setFieldValue('countryCode', country?.cca2);

              if (values.callingCode && values.countryCode) {
                formikRef.current?.validateField('phone');
              }
            }}
          />
        );
      case 2:
        return (
          <>
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
          </>
        );
      default:
        return null;
    }
  };
  useEffect(() => {
    switch (key) {
      case 0:
        setValues({title: 'Name', desc: 'Change Name'});
        break;
      case 1:
        setValues({title: 'Email', desc: 'Change Email'});
        break;
      case 2:
        setValues({title: 'Password', desc: 'Change Password'});
        break;
      case 3:
        setValues({title: 'Phone', desc: 'Change Phone Number'});
        break;
      default:
        setValues({title: '', desc: ''});
    }
  }, [key]);
  return (
    <MainWrapper>
      <AppHeader title={values.title} />
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
            <Text style={styles.forgotText}>{values.desc}</Text>
            <Formik
              innerRef={formikRef}
              enableReinitialize
              initialValues={EditInitialObject}
              validationSchema={EditProfileValidation(key)}
              onSubmit={handleContinueBtn}>
              {({
                handleChange,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <View style={{alignSelf: 'center'}}>
                  {renderFormFields(
                    key,
                    values,
                    handleChange,
                    touched,
                    errors,
                    setFieldValue,
                  )}
                  <View style={styles.divider}>
                    <AppButton
                      title="Save"
                      handleClick={handleSubmit}
                      buttonStyle={styles.btnContainer(keyboardVisible)}
                    />
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

export default EditProfile;
