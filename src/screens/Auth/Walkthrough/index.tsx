import { ImageBackground, StatusBar, Text, View } from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import AppIntroSlider from 'react-native-app-intro-slider';
import { APP_INTRO_SLIDES } from '../../../shared/utils/constant';
import { svgIcon } from '../../../assets/svg';
import { useDispatch } from 'react-redux';
import { setIswalkthrough } from '../../../redux/auth/authSlice';


const Walkthrough = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(null)
  const dispatch = useDispatch()

  const renderItem = ({ item }: { item: (typeof APP_INTRO_SLIDES)[0] }) => (
    <ImageBackground style={styles.imageStyles} source={item.image}>
      <View style={styles.textContainer}>
        <Text style={styles.titleTextStyle}>{item?.title}</Text>
        <Text style={styles.infoTextStyle}>{item?.info}</Text>
      </View>
    </ImageBackground>
  );

  const onDone = () => {
    dispatch(setIswalkthrough());
    // navigation.navigate(Routes.AuthStack);
    console.log("working done");
    // navigation.navigate("GetStarted")

  };

  const renderNextButton = () => (

    <View style={styles.nextContainer}>{svgIcon.Forward}</View>
  );

  const renderSkipButton = () => (
    <View style={styles.skipContainer}>
      <Text style={styles.skipTextStyle}>Skip</Text>
    </View>
  );

  const keyExtractor = (item: object | any) => item?.key;
  const handleSlide = (index) => {
  }


  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
      />
      <AppIntroSlider
        data={APP_INTRO_SLIDES}
        showSkipButton={true}
        onSkip={onDone}
        onDone={onDone}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        renderDoneButton={renderNextButton}
        renderSkipButton={renderSkipButton}
        renderNextButton={renderNextButton}
        dotStyle={styles.inActiveDotStyle}
        activeDotStyle={styles.activeDotStyle}
        onSlideChange={handleSlide}

      />
    </View>

  );
};

export default Walkthrough;
