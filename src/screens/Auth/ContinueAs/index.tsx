import { ImageBackground, StatusBar, Text, View } from 'react-native';
import React from 'react';
import styles from './styles';
import { appImages } from '../../../assets/images';
import { AppButton } from '../../../components';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../../shared/exporter';

const ContinueAs = ({ }) => {
  const navigation = useNavigation()
  const renderItem = () => (
    <ImageBackground style={styles.imageStyles} source={appImages.continueAs}>
      <View style={styles.textContainer}>

        <AppButton title='Login' buttonStyle={styles.loginBtn} isSmall={"48%"} handleClick={() => navigation.navigate(Routes.LoginScreen)} />
        <AppButton title='Sign up' isSmall={"48%"} handleClick={() => navigation.navigate(Routes.LoginScreen)} />

      </View>
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
