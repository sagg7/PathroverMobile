import {View, ScrollView, Text, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {
  AppButton,
  ImageFileUploader,
  MainWrapper,
  MiniProgressBar,
} from '../../../../components';
import styles from './styles';
import {IMAGE_OPTIONS, Routes, showAlert} from '../../../../shared/exporter';
import {launchImageLibrary} from 'react-native-image-picker';
import {svgIcon} from '../../../../assets/svg';
import {setDriverProfile} from '../../../../redux/driver/driverSlice';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const VehicleRegistration = () => {
  const [frontSide, setFrontSide] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const uploadFromGallery = async () => {
    const result = await launchImageLibrary(IMAGE_OPTIONS);
    setFrontSide(result?.assets[0]);
  };

  const RenderDocList = ({onPressDelete}) => {
    return (
      <View style={styles.rowStyles}>
        <Image style={styles.fileIcon} source={frontSide} />
        <Text numberOfLines={1} style={styles.filename}>
          File name
        </Text>
        <TouchableOpacity onPress={onPressDelete}>
          {svgIcon.Delete}
        </TouchableOpacity>
      </View>
    );
  };

  const handleNextBtn = () => {
    if (frontSide) {
      dispatch(setDriverProfile(frontSide));
      navigation.navigate(Routes.CompanyDetail);
    } else {
      showAlert(
        'Alert',
        'Please upload vehicle registration document to continue.',
      );
    }
  };

  return (
    <MainWrapper>
      <ScrollView>
        <MiniProgressBar
          currentStep={6}
          heading={'Vehicle Registration\nDocument'}
          desciption="Write details about feature D here. Write details about feature D here. Write details about feature D here."
          onPressSkip={() => console.log('working')}
        />
        <ImageFileUploader
          title="Upload File"
          onPressDel={() => setFrontSide(null)}
          onPressPlaceholder={() => uploadFromGallery(true)}
        />
        {frontSide && (
          <RenderDocList onPressDelete={() => setFrontSide(null)} />
        )}
        <AppButton
          title="Next"
          buttonStyle={styles.buttonStyle}
          handleClick={() => handleNextBtn()}
        />
        <View style={styles.height} />
      </ScrollView>
    </MainWrapper>
  );
};

export default VehicleRegistration;
