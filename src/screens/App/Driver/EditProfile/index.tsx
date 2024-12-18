import {Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
  EditInitialObject,
  EditProfileValidation,
} from '../../../../shared/utils/validations';
import {
  UNEXPECTED_ERROR,
  formatPhoneNumber,
  isIOS,
  removeNonNumbers,
  showAlert,
  useKeyboardListener,
} from '../../../../shared/exporter';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setLoginUser} from '../../../../redux/auth/authSlice';
import {useEdtProfileMutation} from '../../../../redux/driver/driverApiSlice';

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
      first_name && setFieldValue('firstName', first_name);
      last_name && setFieldValue('lastName', last_name);
      email && setFieldValue('email', email);
      phone_number && setFieldValue('phone', formatPhoneNumber(phone_number));
    }
  }, []);

  const handleContinueBtn = useCallback(
    async val => {
      const {email, phone, password, firstName, lastName} = val;
      const obj = {
        profile: {
          ...(email && {email: email}),
          ...(firstName && {first_name: firstName}),
          ...(lastName && {last_name: lastName}),
          ...(password && {password: password}),
          ...(phone && {phone_number: removeNonNumbers(phone)}),
        },
      };

      const resp = await editProfile(obj);
      dispatch(setLoginUser(resp?.data?.profile));

      if (resp?.data) {
        console.log('TITLE ALERT', values);

        showAlert('Alert', `Profile has been updated.`);
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
          <AppInput
            placeholder="Phone No"
            value={values.phone}
            onChangeText={text => {
              const formatted = formatPhoneNumber(text);
              setFieldValue('phone', formatted);
            }}
            touched={touched.phone}
            errorMessage={errors.phone}
            keyboardType="numeric"
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
