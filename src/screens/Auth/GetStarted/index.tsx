import { ImageBackground, StatusBar, Text, View } from 'react-native';
import React from 'react';
import styles from './styles';
import { appImages } from '../../../assets/images';
import { AppButton } from '../../../components';
import { Routes } from '../../../shared/exporter';
import { CommonActions, useNavigation } from '@react-navigation/native';

const GetStarted = () => {
  const navigation = useNavigation()
  const renderItem = () => {
    return (
      <ImageBackground style={styles.imageStyles} source={appImages.appIntroFour}>
        <View style={styles.textContainer}>
          <Text style={styles.titleTextStyle}>Hiking and Off-Road Navigation</Text>
          <Text style={styles.infoTextStyle}>PathFinder isn’t just for professionals in the oil and gas industry. Outdoor enthusiasts will love our Hiking and Off-Road Navigation features.</Text>
          <View style={styles.dummyContainer} />
          <AppButton title='Get Started'
            handleClick={() => {

              // navigation.dispatch(
              //   CommonActions.reset({
              //     index: 0,
              //     routes: [{ name: Routes.ContinueAs }]
              //   })
              // )
              navigation.replace(Routes.ContinueAs)
            }}
          />
        </View>
      </ImageBackground>
    )
  }

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

export default GetStarted;
