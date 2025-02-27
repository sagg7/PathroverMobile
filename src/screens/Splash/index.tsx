import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Image, StatusBar, View} from 'react-native';
import {appImages} from '../../assets/images';
import styles from './styles';

const Splash = ({}) => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('AppStack');
    }, 4000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'transparent'} translucent={true} />
      <Image source={appImages.Splash} style={styles.imageStyle} />
    </View>
  );
};

export default Splash;
