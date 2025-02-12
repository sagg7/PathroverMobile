import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  AppButton,
  AppHeader,
  AppInput,
  MainWrapper,
} from '../../../../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {AddNumberValidation} from '../../../../../shared/utils/validations';
import styles from './styles';
import {
  formatPhoneNumber,
  removeNonNumbers,
  showAlert,
  useKeyboardListener,
} from '../../../../../shared/exporter';
import {Alert, Text, View} from 'react-native';
import NumberVerifyModal from '../../../../../components/complex/NumberVerifyModal';
import {useAddPhoneNumberMutation} from '../../../../../redux/chat/chatApiSlice';
import {useSelector} from 'react-redux';

const AddNumber = () => {
  const navigation = useNavigation();
  const keyboardVisible = useKeyboardListener();
  const {loginUser} = useSelector(state => state.auth);

  const [addPhoneNumber, {error, isError, isLoading}] =
    useAddPhoneNumberMutation();

  const [isVisible, setIsVisible] = useState(false);

  //TODO: REVERT FOR COMMENTED
  useEffect(() => {
    if (error) {
      setIsVisible(false);
      showAlert(
        'Error',
        error?.data?.error || 'Unable to process request. Please try again!.',
      );
    }
  }, [isError]);

  const handleContinueBtn = () => {
    setIsVisible(true);
  };

  const onPressContinue = async (values: object) => {
    try {
      const data = {
        phone_number: removeNonNumbers(values?.phone),
      };
      const res = await addPhoneNumber(data);

      // TODO: REVERT FOR COMMENTED
      if (res) {
        // if (res?.data) {
        console.log('==============res======================');
        console.log(res);
        console.log('====================================');
        setIsVisible(false);
        // Alert.alert('OTP', 'Remember your otp', [
        //   {
        //     text: 'OK',
        //     onPress: () => {
        //       navigation.navigate('VerifyNumber', data);
        //     },
        //   },
        // ]);
      }
    } catch (error) {
      //
    }
  };

  return (
    <MainWrapper>
      <AppHeader title="Meta AI" clickBackIcon={() => navigation.pop()} />
      <KeyboardAwareScrollView
        enableOnAndroid
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        enableAutomaticScroll
        keyboardShouldPersistTaps={'handled'}>
        <Formik
          enableReinitialize
          initialValues={{
            phone: formatPhoneNumber(loginUser?.phone_number) || '',
          }}
          validationSchema={AddNumberValidation}
          onSubmit={handleContinueBtn}>
          {({handleSubmit, values, errors, touched, setFieldValue}) => (
            <View style={styles.container}>
              <Text style={styles.titleStyle}>Verify Your Phone number</Text>
              <Text style={styles.subTitleStyle}>Enter your phone number</Text>
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
              <View style={styles.divider}>
                <AppButton
                  title="Next"
                  handleClick={handleSubmit}
                  buttonStyle={styles.btnContainer(keyboardVisible)}
                />
              </View>

              {isVisible && (
                <NumberVerifyModal
                  isVisible={isVisible}
                  setIsVisible={() => setIsVisible(false)}
                  number={values.phone}
                  onPressEdit={() => setIsVisible(false)}
                  onPressContinue={() => onPressContinue(values)}
                  isLoading={isLoading}
                />
              )}
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </MainWrapper>
  );
};

export default AddNumber;
