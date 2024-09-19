import { Image, StatusBar, View } from 'react-native';
import React, { useEffect } from 'react';
import styles from './styles';
import { appImages } from '../../assets/images';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Routes } from '../../shared/exporter';

const Splash = ({ }) => {
  const navigation = useNavigation()
  const isWalkthrough = useSelector(state => state?.auth?.isWalkthrough);
  const loginUser = useSelector(state => state?.auth?.loginUser);

  useEffect(() => {
    setTimeout(() => {
      if (loginUser) {
        if (loginUser?.role === "end_user" || loginUser?.role === "driver") {
          navigation.replace("Home")
        } else {
          navigation.replace("AuthStack")
        }
      } else if (isWalkthrough) {
        navigation.replace(Routes.GetStarted)
      } else {
        navigation.replace(Routes.Walkthrough)
      }
    }, 4000);

  }, [isWalkthrough])

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"transparent"} translucent={true} />
      <Image source={appImages.Splash} style={styles.imageStyle} />
    </View>

  );
};

export default Splash;
