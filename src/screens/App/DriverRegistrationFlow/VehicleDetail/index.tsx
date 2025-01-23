import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  AppButton,
  ItemInfoCard,
  MainWrapper,
  MiniProgressBar,
  OptionSelectorSheet,
} from '../../../../components';
import styles from './styles';
import {
  IMAGE_OPTIONS,
  PickupTruck,
  Routes,
  SemiTruckData,
  TrailerLoadingCapacity,
  VehicleTypes,
  appIcons,
} from '../../../../shared/exporter';
import {launchImageLibrary} from 'react-native-image-picker';
import {TruckTypeList} from './TruckTypeLiist';
import {useDispatch} from 'react-redux';
import {setDriverProfile} from '../../../../redux/driver/driverSlice';
import {useNavigation} from '@react-navigation/native';

const VehicleDetail = () => {
  const [vehicleImage, setvehicleImage] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const sheetRef = useRef();
  var type: any = '';
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const uploadFromGallery = async () => {
    const result = await launchImageLibrary(IMAGE_OPTIONS);
    setvehicleImage(result?.assets[0]);
  };

  const handlePressWeight = i => {
    let temp = vehicleData?.map(val => {
      if (i.id === val.id) {
        const obj = {
          ...val,
          isWeightSelected: true,
        };
        setSelectedVehicle('obj');
        return obj;
      } else {
        return {
          ...val,
          isWeightSelected: false,
        };
      }
    });
    setSelectedVehicle(temp);
    setVehicleData(temp);
  };

  const handlePressModel = i => {
    setVehicleData(
      vehicleData.map(item => {
        if (item.isWeightSelected) {
          const obj = {
            ...item,
            model: item?.model.map(modelItem => ({
              ...modelItem,
              isModelSelected: modelItem?.id === i?.id,
            })),
          };
          setSelectedVehicle(obj);
          return obj;
        }
        return item;
      }),
    );
  };

  const handleTruckList = i => {
    const isChecked = vehicleData?.find(i => i.isWeightSelected);
    setSelectedTruck(i?.title);

    if (selectedKey === i.key && isChecked) {
      sheetRef.current.open();
    } else {
      if (i.key === 1) {
        setVehicleData(PickupTruck);
      } else if (i.key === 2) {
        setVehicleData(SemiTruckData);
      } else if (i.key === 3) {
        setVehicleData(TrailerLoadingCapacity);
      }
    }
    setSelectedKey(i.key);
    sheetRef.current.open();
  };
  const handleContinue = () => {
    const selectedVehicle = vehicleData?.find(i => i.isWeightSelected);
    const selectedModel = selectedVehicle?.model?.find(i => i.isModelSelected);
    const vehicleDetail = {
      weight: selectedVehicle,
      selectedTruck: selectedTruck,
      ...(selectedModel && {model: selectedModel}),
      vehiclePhoto: vehicleImage,
    };

    dispatch(setDriverProfile(vehicleDetail));
    navigation.navigate(Routes.VehicleRegistration);
  };

  const handleClearBtn = () => {
    setSelectedKey(null);
    setSelectedVehicle(null);
    setVehicleData(null);
  };

  return (
    <MainWrapper>
      <ScrollView>
        <MiniProgressBar
          currentStep={5}
          heading={'Do you want to make profit\nwith us?'}
          desciption="Choose a Vehicle"
        />
        {vehicleImage ? (
          <>
            <Image
              style={styles.profilePicture}
              source={vehicleImage}
              resizeMode="cover"
            />
            <Text onPress={() => uploadFromGallery()} style={styles.changeText}>
              Change
            </Text>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.profilePicContainer}
              onPress={() => uploadFromGallery()}>
              <Image
                style={styles.placeholder}
                source={appIcons.imagePlaceholder}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text style={styles.uploadText}>Upload Image</Text>
          </>
        )}
        <View style={styles.height} />
        {VehicleTypes.map(val => {
          return (
            <TruckTypeList
              item={val}
              onPressCard={() => handleTruckList(val)}
              key={val.id}
              selectedVehicle={selectedVehicle}
              selectedKey={selectedKey}
              onPressClear={() => handleClearBtn()}
            />
          );
        })}
        {/* <ItemInfoCard /> */}
        <OptionSelectorSheet
          ref={sheetRef}
          data={vehicleData}
          onPressWeight={handlePressWeight}
          onPressModel={handlePressModel}
        />
        <AppButton
          title="Next"
          buttonStyle={styles.buttonStyle}
          handleClick={() => handleContinue()}
        />
        <View style={styles.height} />
      </ScrollView>
    </MainWrapper>
  );
};

export default VehicleDetail;
