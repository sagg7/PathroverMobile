import {View, Text, Pressable, ScrollView} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  AppButton,
  AppHeader,
  MainWrapper,
  OptionSelectorSheet,
} from '../../../../../components';
import {styles} from './Styles';
import {
  PickupTruck,
  SemiTruckData,
  TrailerLoadingCapacity,
  VehicleTypes,
} from '../../../../../shared/utils/constant';
import {scale} from '../../../../../shared/theme/responsive';
import VehicleDetailCard from '../VehicleDetailCard';
import {svgIcon} from '../../../../../assets/svg';
import {PFColors, Routes} from '../../../../../shared/exporter';
import SelectRoute from '../SelectRoute';
import CargoDescriptionCard from '../CargoDescriptionCard';
import RecipientDetailCard from '../RecipientDetail';
import CargoSheet from '../../../../../components/complex/CargoSheet';
import RecipentSheet from '../../../../../components/complex/RecipenntSheet';

const VehicleRequest = ({navigation}: any) => {
  const [selectedVehicle, setSelectedVehicle] = useState(VehicleTypes[0]);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState(null);
  const [selectedRouteDetails, setSelectedRouteDetails] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Choose Route');
  const [cargoDescriptionDetails, setCargoDescriptionDetails] =
    useState<null | {image: any; description: any}>(null);
  const [recipentDetails, setRecipentDetails] = useState<null | {
    name: string;
    phone: string;
  }>(null);
  const [vehicleData, setVehicleData] = useState(PickupTruck);
  const sheetRef = useRef(null);
  const cargoSheetRef = useRef(null);
  const recipentSheetRef = useRef(null);

  const onPressVehicle = (item: any) => () => {
    setSelectedVehicle(item);
    if (item.key === 1) {
      setVehicleData(PickupTruck);
    } else if (item.key === 2) {
      setVehicleData(SemiTruckData);
    } else if (item.key === 3) {
      setVehicleData(TrailerLoadingCapacity);
    }
  };

  const handlePressWeight = i => {
    let temp = vehicleData?.map(val => {
      if (i.id === val.id) {
        const obj = {
          ...val,
          isWeightSelected: true,
        };
        setSelectedVehicleDetails(obj);
        return obj;
      } else {
        let obj = {
          ...val,
          isWeightSelected: false,
        };
        setSelectedVehicleDetails(obj);
        return obj;
      }
    });
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
          setSelectedVehicleDetails(obj);
          return obj;
        }
        return item;
      }),
    );
  };

  const openSheet = () => {
    sheetRef?.current.open();
  };

  const handleClearBtn = () => {
    setSelectedVehicleDetails(null);
    let reSetVehicleData = vehicleData.map((item: any) => {
      if (item.isWeightSelected) {
        item.isWeightSelected = false;
      }
      item.model.forEach(
        (modelItem: any) => (modelItem.isModelSelected = false),
      );
      return item;
    });

    setVehicleData(reSetVehicleData);
  };
  const onPressSelectRouteCard = () => {
    if (selectedOption === 'Choose Route') {
      navigation.navigate(Routes.CustomizeRoute, {
        selectedRouteDetails: selectedRouteDetails,
        setSelectedRouteDetails: setSelectedRouteDetails,
      });
    } else {
      navigation.navigate('Locations');
    }
  };

  const onPressCargoCard = () => {
    cargoSheetRef?.current.open();
  };

  const onPressRecipentCard = () => {
    recipentSheetRef?.current.open();
  };

  const handleClearDetails = (type: string) => () => {
    if (type === 'route') {
      setSelectedRouteDetails(null);
    } else if (type === 'cargo') {
      setCargoDescriptionDetails(null);
    } else if (type === 'recipent') {
      setRecipentDetails(null);
    }
  };

const handleCreateRequest=()=>{
  navigation.navigate(Routes.VehiclesOffer)
}

  return (
    <MainWrapper>
      <AppHeader leftIcon={false} title="Request Vehicle" />
      <ScrollView contentContainerStyle={styles.bodyContainer}>
        <Text style={styles.commonHeading}>Request Vehicle</Text>
        <View style={styles.vehiclesContainer}>
          {VehicleTypes.map((item, index) => (
            <VehicleCard
              key={item.key}
              item={item}
              index={index}
              onPress={onPressVehicle(item)}
              selectedVehicle={selectedVehicle}
            />
          ))}
        </View>
        <VehicleDetailCard
          style={styles.cardStyle}
          selectedVehicleDetails={selectedVehicleDetails}
          onPressCard={openSheet}
          onPressClear={handleClearBtn}
        />

        <View style={styles.radioBtnContainer}>
          <View style={styles.radioBtn}>
            <Pressable onPress={() => setSelectedOption('Choose Route')}>
              {selectedOption === 'Choose Route'
                ? svgIcon.RadioButtonBlue
                : svgIcon.RadioInactive}
            </Pressable>
            <Text style={styles.radioBtnText}>Choose Route</Text>
          </View>

          <View style={styles.radioBtnInactive}>
            <Pressable onPress={() => setSelectedOption('Choose Location')}>
              {selectedOption === 'Choose Location'
                ? svgIcon.RadioButtonBlue
                : svgIcon.RadioInactive}
            </Pressable>
            <Text style={styles.radioBtnText}>Choose Location</Text>
          </View>
        </View>

        <Text style={styles.commonHeading}>{selectedOption}</Text>
        <SelectRoute
          selectedRouteDetails={selectedRouteDetails}
          style={styles.routeCardStyle}
          title={selectedOption === 'Choose Location' ? 'Location' : 'Route'}
          onPressCard={onPressSelectRouteCard}
          onPressClear={handleClearDetails('route')}
        />
        <CargoDescriptionCard
          style={styles.cargoCardStyle}
          onPressCard={onPressCargoCard}
          CargoDescriptionDetails={cargoDescriptionDetails}
          onPressClear={handleClearDetails('cargo')}
        />
        <RecipientDetailCard
          style={styles.recipentCardStyle}
          recipientDetail={recipentDetails}
          onPressCard={onPressRecipentCard}
          onPressClear={handleClearDetails('recipent')}
        />
      </ScrollView>
        <AppButton title="Create Request" buttonStyle={styles.btn} handleClick={handleCreateRequest} />
      <OptionSelectorSheet
        ref={sheetRef}
        data={vehicleData}
        onPressWeight={handlePressWeight}
        onPressModel={handlePressModel}
      />
      <CargoSheet
        ref={cargoSheetRef}
        cargoDescriptionDetails={cargoDescriptionDetails}
        setCargoDescriptionDetails={setCargoDescriptionDetails}
      />
      <RecipentSheet
        ref={recipentSheetRef}
        recipentDetails={recipentDetails}
        setrecipentDetails={setRecipentDetails}
      />
    </MainWrapper>
  );
};

const VehicleCard = ({
  item,
  index,
  onPress,
  selectedVehicle,
}: {
  item: any;
  index: number;
  onPress: () => void;
  selectedVehicle: any;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.vehicleView,
        index !== 0 && index !== VehicleTypes.length - 1
          ? {marginHorizontal: scale(10)}
          : null,
        selectedVehicle?.key === item?.key
          ? {borderColor: PFColors.Blue.Dark}
          : null,
      ]}>
      {item.icon}
      <Text style={styles.vehicleName}>{item.title}</Text>
    </Pressable>
  );
};
export default VehicleRequest;
