import { ImageBackground, StatusBar, View } from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import { appImages } from '../../../assets/images';
import { AppButton, AuthBottomSheet } from '../../../components';
import { useNavigation } from '@react-navigation/native';
import { AuthSheetLoginObj, AuthSheetSignupObj, Routes } from '../../../shared/exporter';

const ContinueAs = ({ }) => {
  const navigation = useNavigation()
  const [showSheet, setShowSheet] = useState(false)
  const [data, setData] = useState({})

  const handleBtn = (isLogin: boolean) => {
    if (isLogin) {
      setData(AuthSheetLoginObj)
    } else {
      setData(AuthSheetSignupObj)
    }
    setTimeout(() => {
      setShowSheet(true)
    }, 500);
  }

  const handleNavigationBtn = (isEmail: boolean) => {
    setShowSheet(false)
    if (data?.isLogin) {
      navigation.navigate(Routes.LoginScreen, { isEmail: isEmail })
    } else {
      navigation.navigate(Routes.SignupScreen, { isEmail: isEmail })
    }

  }


  const renderItem = () => (
    <ImageBackground style={styles.imageStyles} source={appImages.continueAs}>
      <View style={styles.textContainer}>

        <AppButton title='Login' buttonStyle={styles.loginBtn} isSmall={"48%"} handleClick={() => handleBtn(true)} />
        <AppButton title='Sign up' isSmall={"48%"} handleClick={() => handleBtn(false)} />

      </View>
      {showSheet &&
        <AuthBottomSheet
          isModalVisible={showSheet}
          headerTitle={data?.headerTitle}
          emailTitle={data?.btnEmailText}
          phoneTitle={data?.btnPhoneText}
          handleClickEmail={() => handleNavigationBtn(true)}
          handleClickPhone={() => handleNavigationBtn(false)}
          onPressClose={() => setShowSheet(false)}

        />
      }
    </ImageBackground>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
      />
      {renderItem()}
    </View>

  );
};

export default ContinueAs;
