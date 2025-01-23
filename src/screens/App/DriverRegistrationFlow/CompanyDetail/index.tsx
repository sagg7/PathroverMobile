import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  AppButton,
  AppInput,
  AppLoader,
  ImageFileUploader,
  MainWrapper,
  MiniProgressBar,
  OptionSelectorSheet,
} from '../../../../components';
import styles from './styles';
import {
  CompanyTypes,
  IMAGE_OPTIONS,
  Routes,
  showAlert,
} from '../../../../shared/exporter';
import {launchImageLibrary} from 'react-native-image-picker';
import {svgIcon} from '../../../../assets/svg';
import {useDispatch, useSelector} from 'react-redux';
import {useCreateDriverProfileMutation} from '../../../../redux/driver/driverApiSlice';
import {useNavigation} from '@react-navigation/native';
import {setLoginUser} from '../../../../redux/auth/authSlice';

const CompanyDetail = () => {
  const [frontSide, setFrontSide] = useState(null);
  const sheetRef = useRef();
  const [companyType, setCompanyType] = useState(CompanyTypes);
  const [createDriverProfile, {error, isLoading}] =
    useCreateDriverProfileMutation();
  const loginUser = useSelector(state => state?.auth?.loginUser);
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const [companyForm, setCompanyForm] = useState({
    detail: '',
    name: '',
    location: '',
    employeDetail: '',
  });
  const {detail, name, location, employeDetail} = companyForm;
  let isEmpty = !detail || !name || !location || !employeDetail || !frontSide;
  const driverData = useSelector(state => state?.driver?.driverProfile);

  const uploadFromGallery = async (isFront: boolean) => {
    const result = await launchImageLibrary(IMAGE_OPTIONS);
    setFrontSide(result?.assets[0]);
  };

  const handleCompanyType = i => {
    let temp = companyType?.map(val => {
      if (i.id === val.id) {
        const obj = {
          ...val,
          isSelected: true,
        };
        return obj;
      } else {
        return {
          ...val,
          isSelected: false,
        };
      }
    });
    setCompanyType(temp);
  };

  const handleSubmit = async (isSkip: boolean) => {
    if (isSkip) {
      if (isEmpty) {
        showAlert('Alert', 'Please fill required data to proceed further.');
        return;
      }
    }

    const data = new FormData();
    data.append('profile[date_of_birth]', driverData?.dob);
    data.append('profile[role]', 'driver');
    driverData?.Identity?.forEach(element => {
      data.append('profile[id_card]', {
        uri: element.uri,
        type: element?.type,
        name: element.fileName,
      });
    });
    driverData?.licence &&
      data.append('profile[driving_license_front_side]', {
        uri: driverData?.licence?.[0].uri,
        type: driverData?.licence?.[0]?.type,
        name: driverData?.licence?.[0].fileName,
      });
    driverData?.licence &&
      data.append('profile[driving_license_back_side]', {
        uri: driverData?.licence?.[1].uri,
        type: driverData?.licence?.[1]?.type,
        name: driverData?.licence?.[1].fileName,
      });
    driverData?.medicalDocument &&
      driverData?.medicalDocument?.forEach(element => {
        data.append('profile[medical_certificate]', {
          uri: element.uri,
          type: element?.type,
          name: element.fileName,
        });
      });
    driverData?.Identity &&
      data.append('profile[id_card_front_side]', {
        uri: driverData?.Identity[0].uri,
        type: driverData?.Identity[0]?.type,
        name: driverData?.Identity[0].fileName,
      });
    driverData?.Identity &&
      data.append('profile[id_card_back_side]', {
        uri: driverData?.Identity[1].uri,
        type: driverData?.Identity[1]?.type,
        name: driverData?.Identity[1].fileName,
      });
    driverData?.vehiclePhoto &&
      data.append('profile[vehicle_detail_attributes][vehicle_document]', {
        uri: driverData?.vehiclePhoto?.uri,
        type: driverData?.vehiclePhoto?.type,
        name: driverData?.vehiclePhoto.fileName,
      });
    // profile[profile_image];
    // driverData?.profile &&
    //   data.append('profile[profile_image]', {
    //     uri: driverData?.profile?.uri,
    //     type: driverData?.profile?.type,
    //     name: driverData?.profile?.fileName,
    //   });
    driverData?.vehiclePhoto &&
      data.append('profile[company_profile_attributes][company_card]', {
        uri: driverData?.vehiclePhoto?.uri,
        type: driverData?.vehiclePhoto?.type,
        name: driverData?.vehiclePhoto.fileName,
      });
    driverData?.fileName &&
      data.append('profile_image', {
        uri: driverData?.uri,
        type: driverData?.type,
        name: driverData?.fileName,
      });

    if (!isSkip) {
      data.append(
        'profile[vehicle_detail_attributes][weight]',
        driverData?.weight?.title,
      );
      data.append(
        'profile[vehicle_detail_attributes][vehicle_model]',
        driverData?.model?.title,
      );
      data.append(
        'profile[vehicle_detail_attributes][trail_type]',
        driverData?.selectedTruck,
      );
      data.append(
        'profile[company_profile_attributes][name]',
        companyForm?.name,
      );
      data.append(
        'profile[company_profile_attributes][address]',
        companyForm?.location,
      );
      data.append(
        'profile[company_profile_attributes][description]',
        companyForm?.detail,
      );
      data.append(
        'profile[company_profile_attributes][employe_detail]',
        companyForm?.employeDetail,
      );
      data.append(
        'profile[company_profile_attributes][company_type]',
        companyType?.find(i => i.isSelected)?.title,
      );
    }

    const resp = await createDriverProfile(data);
    if (resp?.data) {
      navigation.replace(Routes.DocumentCreationSuccess);
      const obj = {
        ...loginUser,
        is_driver: true,
      };
      dispatch(setLoginUser(obj));
    } else {
      showAlert('Error', resp?.error?.data?.errors[0]);
    }
  };
  const handleInputChange = (name, value) => {
    setCompanyForm(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <MainWrapper>
      <ScrollView>
        <MiniProgressBar
          currentStep={7}
          heading={'Company Details'}
          desciption="Write details about feature D here. Write details about feature D here. Write details about feature D here."
          onPressSkip={() => handleSubmit(false)}
        />
        <Text style={styles.companyCard}>Company Card</Text>
        <ImageFileUploader
          title="Upload File"
          onPressDel={() => setFrontSide(null)}
          onPressPlaceholder={() => uploadFromGallery(true)}
          showDel={false}
          selectedPicture={frontSide}
        />
        <View style={styles.detailBox}>
          <Text style={styles.companyDetailText}>Company Details</Text>
          <TextInput
            onChangeText={value => handleInputChange('detail', value)}
            value={companyForm.detail}
            multiline
            style={styles.textInput}
            placeholder="Type Here"
          />
        </View>
        <AppInput
          onChangeText={value => handleInputChange('name', value)}
          value={companyForm.name}
          placeholder="Company Name"
          inputContainerStyle={styles.normalInput}
        />
        <View style={styles.inputContainer}>
          {svgIcon.MapPin}
          <TextInput
            placeholder="Enter Location"
            style={styles.input}
            value={companyForm.location}
            onChangeText={value => handleInputChange('location', value)}
          />
        </View>
        <AppInput
          onChangeText={value => handleInputChange('employeDetail', value)}
          value={companyForm.employeDetail}
          placeholder="Company Employe Details"
          inputContainerStyle={styles.normalInput}
        />

        <TouchableOpacity
          style={styles.companyTypeContainer}
          onPress={() => sheetRef.current.open()}>
          <Text style={styles.title}>Type of Company</Text>
          <View style={styles.clearView}></View>
          {svgIcon.LeftArrow}
        </TouchableOpacity>
        <OptionSelectorSheet
          ref={sheetRef}
          data={companyType}
          onPressWeight={handleCompanyType}
          isCompany
        />

        <AppButton
          title="Next"
          buttonStyle={styles.buttonStyle}
          handleClick={() => handleSubmit(true)}
        />
        <View style={styles.height} />
      </ScrollView>
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default CompanyDetail;
