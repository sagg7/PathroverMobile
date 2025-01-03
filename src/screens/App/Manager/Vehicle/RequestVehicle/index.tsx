import {View, Text, Pressable, ScrollView} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  AppButton,
  AppHeader,
  AppLoader,
  MainWrapper,
  OptionSelectorSheet,
  CargoSheet,
  RecipentSheet,
} from '../../../../../components';
import {styles} from './Styles';
import {
  PickupTruck,
  SemiTruckData,
  showAlert,
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
import {useCreateManagerVehicleRequestMutation} from '../../../../../redux/manager/managerApiSlice';

const VehicleRequest = ({navigation}: any) => {
  const [selectedVehicle, setSelectedVehicle] = useState(VehicleTypes[0]);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState(null);
  const [selectedRouteDetails, setSelectedRouteDetails] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Choose Route');
  const [cargoDescriptionDetails, setCargoDescriptionDetails] =
    useState<null | {image: any; description: any}>(null);
  const [recipentDetails, setRecipentDetails] = useState<null | any>(null);
  const [vehicleData, setVehicleData] = useState(PickupTruck);
  const sheetRef = useRef(null);
  const cargoSheetRef = useRef(null);
  const [showCargoSheet, setShowCargoSheet] = useState(false);
  const [showRecipentSheet, setShowRecipentSheet] = useState(false);

  const recipentSheetRef = useRef(null);
  const [createManagerVehicleRequest, {isLoading}] =
    useCreateManagerVehicleRequestMutation();

  const onPressVehicle = (item: any) => () => {
    setSelectedVehicle(item);
    if (item.key === 1) {
      setVehicleData(PickupTruck);
    } else if (item.key === 2) {
      setVehicleData(SemiTruckData);
    } else if (item.key === 3) {
      setVehicleData(TrailerLoadingCapacity);
    }
    setSelectedVehicleDetails(null);
    setSelectedRouteDetails(null);
    setCargoDescriptionDetails(null);
    setRecipentDetails(null);
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
      item.model?.forEach(
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
      navigation.navigate('Locations', {
        selectedRouteDetails: selectedRouteDetails,
        setSelectedRouteDetails: setSelectedRouteDetails,
      });
    }
  };

  const onPressCargoCard = () => {
    setShowCargoSheet(true);
  };

  const onPressRecipentCard = () => {
    setShowRecipentSheet(true);
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

  const handleCreateRequest = async () => {
    const formData = new FormData();
    formData.append('ride_request[vehicle_type]', selectedVehicle?.title);
    formData.append(
      'ride_request[pickup_latitude]',
      selectedRouteDetails?.pickup_latitude,
    );
    formData.append(
      'ride_request[pickup_longitude]',
      selectedRouteDetails?.pickup_longitude,
    );
    formData.append(
      'ride_request[dropoff_latitude]',
      selectedRouteDetails?.dropoff_latitude,
    );
    formData.append(
      'ride_request[dropoff_longitude]',
      selectedRouteDetails?.dropoff_longitude,
    );
    formData.append('ride_request[cargo_images][]', {
      uri: cargoDescriptionDetails?.image.uri,
      type: cargoDescriptionDetails?.image?.type,
      name: cargoDescriptionDetails?.image.fileName,
    });
    formData.append(
      'ride_request[cargo_description]',
      cargoDescriptionDetails?.description,
    );
    formData.append('ride_request[recipient_name]', recipentDetails?.name);
    formData.append('ride_request[recipient_number]', recipentDetails?.phone);

    const res = await createManagerVehicleRequest(formData);
    if (res?.data) {
      showAlert('Alert', 'Ride Request has been created');
      setSelectedVehicle(VehicleTypes[0]);
      setSelectedVehicleDetails(null);
      setSelectedRouteDetails(null);
      setCargoDescriptionDetails(null);
      setRecipentDetails(null);
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
    } else {
      showAlert('Error', res?.error?.data?.errors[0]);
    }

    // navigation.navigate(Routes.VehiclesOffer);
  };

  const isDisable =
    !selectedVehicle ||
    !selectedVehicleDetails ||
    !selectedRouteDetails ||
    !cargoDescriptionDetails ||
    !recipentDetails;

  const switchOption = (val: string) => () => {
    setSelectedOption(val);
    setSelectedRouteDetails(null);
  };
  return (
    <MainWrapper>
      <AppHeader leftIcon={false} title="Request Vehicle" />
      <ScrollView contentContainerStyle={styles.bodyContainer}>
        <Text style={styles.commonHeading}>Request Vehicle</Text>
        <View style={styles.vehiclesContainer}>
          {VehicleTypes.map((item, index) => (
            <VehicleCard
              key={index}
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
        {console.log('selectedVehicleDetails', selectedVehicleDetails)}
        <View style={styles.radioBtnContainer}>
          <View style={styles.radioBtn}>
            <Pressable onPress={switchOption('Choose Route')}>
              {selectedOption === 'Choose Route'
                ? svgIcon.RadioButtonBlue
                : svgIcon.RadioInactive}
            </Pressable>
            <Text style={styles.radioBtnText}>Choose Route</Text>
          </View>

          <View style={styles.radioBtnInactive}>
            <Pressable onPress={switchOption('Choose Location')}>
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
      <AppButton
        title="Create Request"
        buttonStyle={styles.btn}
        handleClick={handleCreateRequest}
        disabled={isDisable}
      />
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
        showCargoSheet={showCargoSheet}
        setShowCargoSheet={setShowCargoSheet}
      />
      <RecipentSheet
        ref={recipentSheetRef}
        recipentDetails={recipentDetails}
        setrecipentDetails={setRecipentDetails}
        showRecipentSheet={showRecipentSheet}
        setShowRecipentSheet={setShowRecipentSheet}
      />
      {isLoading && <AppLoader />}
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
