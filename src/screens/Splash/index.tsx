import { Image, StatusBar, View } from 'react-native';
import React, { useEffect } from 'react';
import styles from './styles';
import { appImages } from '../../assets/images';
import { useNavigation } from '@react-navigation/native';

const Splash = ({ }) => {
  const navigation = useNavigation()
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('AuthStack')
    }, 1000);
  }, [])


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"transparent"} translucent={true} />
      <Image source={appImages.Splash} style={styles.imageStyle} />
    </View>

  );
};

export default Splash;
