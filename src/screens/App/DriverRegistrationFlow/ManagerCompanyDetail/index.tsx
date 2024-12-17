import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
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
  APP_ROLE,
  CompanyTypes,
  IMAGE_OPTIONS,
  showAlert,
} from '../../../../shared/exporter';
import {launchImageLibrary} from 'react-native-image-picker';
import {svgIcon} from '../../../../assets/svg';
import {useDispatch, useSelector} from 'react-redux';
import {useCreateDriverProfileMutation} from '../../../../redux/driver/driverApiSlice';
import {useNavigation} from '@react-navigation/native';
import {setLoginUser} from '../../../../redux/auth/authSlice';

const ManagerCompanyDetail = () => {
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
  let selectedCompanyType = companyType.find(i => i.isSelected === true);

  let isEmpty =
    !detail ||
    !name ||
    !location ||
    !employeDetail ||
    !frontSide ||
    !selectedCompanyType;
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
    data.append('profile[role]', APP_ROLE.MANAGER);

    driverData?.Identity &&
      driverData?.Identity?.forEach(element => {
        data.append('profile[id_card]', {
          uri: element.uri,
          type: element?.type,
          name: element.fileName,
        });
      });

    if (!isSkip) {
      data.append(
        'profile[company_profile_attributes][name]',
        companyForm.name,
      );
      data.append(
        'profile[company_profile_attributes][address]',
        companyForm.location,
      );
      data.append(
        'profile[company_profile_attributes][description]',
        companyForm.detail,
      );
      data.append(
        'profile[company_profile_attributes][employee_detail]',
        companyForm.employeDetail,
      );
      data.append(
        'profile[company_profile_attributes][company_type]',
        selectedCompanyType?.title,
      );
    }

    const resp = await createDriverProfile(data);

    if (resp?.data) {
      navigation.replace('AppStack');
      const obj = {
        ...loginUser,
        is_manager: true,
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
          totalSetps={3}
          currentStep={3}
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
          placeholder="Company Employee Details"
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

export default ManagerCompanyDetail;
