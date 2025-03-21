import {Alert, ImageBackground, StatusBar, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {appImages} from '../../../assets/images';
import {AppButton, AuthBottomSheet} from '../../../components';
import {useNavigation} from '@react-navigation/native';
import {
  AuthSheetLoginObj,
  AuthSheetSignupObj,
  Routes,
  showAlert,
  UNEXPECTED_ERROR,
} from '../../../shared/exporter';
import {useAppleSignIn} from '../../../hooks/useAppleSignIn';
import {useGoogleSignIn} from '../../../hooks/useGoogleLogin';
import {useDispatch} from 'react-redux';
import {useSociallLoginMutation} from '../../../redux/auth/authApiSlice';
import {setLoginUser} from '../../../redux/auth/authSlice';
import {useFacebookSignIn} from '../../../hooks/useFacebookSignIn';

const ContinueAs = ({}) => {
  const navigation: any = useNavigation();
  const [showSheet, setShowSheet] = useState(false);
  const [data, setData] = useState<any>({});
  const [appleToken, setAppleToken] = useState<string | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [facebookToken, setFacebookToken] = useState<string | null>(null);

  const {signInWithApple} = useAppleSignIn(setAppleToken);
  const {signInWithGoogle} = useGoogleSignIn(setGoogleToken);
  const {signInWithFacebook} = useFacebookSignIn(setFacebookToken);
  const [socialLogin, {isLoading}] = useSociallLoginMutation();
  const dispatch = useDispatch();

  const handleBtn = (isLogin: boolean) => {
    if (isLogin) {
      setData(AuthSheetLoginObj);
    } else {
      setData(AuthSheetSignupObj);
    }
    setTimeout(() => {
      setShowSheet(true);
    }, 500);
  };

  useEffect(() => {
    if (appleToken) {
      handleSocialLogin('apple', appleToken);
    }
  }, [appleToken]);
  useEffect(() => {
    if (googleToken) {
      handleSocialLogin('google', googleToken);
    }
  }, [googleToken]);
  useEffect(() => {
    if (facebookToken) {
      handleSocialLogin('facebook', facebookToken);
    }
  }, [facebookToken]);

  const handleSocialLogin = async (provider: string, token: string) => {
    const data = new FormData();
    data.append('provider', provider);
    data.append('token', token);

    const resp = await socialLogin(data);
    console.log('resp', resp);

    const res = resp?.data?.user;
    dispatch(setLoginUser(res));

    if (res) {
      setShowSheet(false);
      navigation.replace('AppStack');
    } else {
      showAlert('Error', resp?.error?.data?.errors || UNEXPECTED_ERROR);
    }
  };

  const handleNavigationBtn = (isEmail: boolean) => {
    setShowSheet(false);
    setTimeout(() => {
      if (data?.isLogin) {
        navigation.navigate(Routes.LoginScreen, {isEmail: isEmail});
      } else {
        navigation.navigate(Routes.SignupScreen, {isEmail: isEmail});
      }
    }, 500);
  };

  const renderItem = () => (
    <ImageBackground style={styles.imageStyles} source={appImages.continueAs}>
      <View style={styles.textContainer}>
        <AppButton
          title="Login"
          buttonStyle={styles.loginBtn}
          isSmall={'48%'}
          handleClick={() => handleBtn(true)}
        />
        <AppButton
          title="Sign up"
          isSmall={'48%'}
          handleClick={() => handleBtn(false)}
        />
      </View>
      {showSheet && (
        <AuthBottomSheet
          isModalVisible={showSheet}
          headerTitle={data?.headerTitle}
          emailTitle={data?.btnEmailText}
          phoneTitle={data?.btnPhoneText}
          handleClickEmail={() => handleNavigationBtn(true)}
          handleClickPhone={() => handleNavigationBtn(false)}
          onPressClose={() => setShowSheet(false)}
          onPressGoogle={() => signInWithGoogle()}
          onPressApple={() => signInWithApple()}
          onPressFacebook={() => signInWithFacebook()}
        />
      )}
    </ImageBackground>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      {renderItem()}
    </View>
  );
};

export default ContinueAs;
