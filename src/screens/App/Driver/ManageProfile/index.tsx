import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import {
  AppButton,
  AppHeader,
  AppLoader,
  MainWrapper,
} from '../../../../components';
import styles from './styles';
import {
  IMAGE_OPTIONS,
  ManageProfileArr,
  UNEXPECTED_ERROR,
  appIcons,
  showAlert,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {useEdtProfileMutation} from '../../../../redux/driver/driverApiSlice';
import {setLoginUser} from '../../../../redux/auth/authSlice';

const ManageProfile = ({navigation}: any) => {
  const [profileImage, setProfileImage] = useState<any>(null);
  const loginUser = useSelector(state => state?.auth?.loginUser);
  const [editProfile, {data, isLoading}] = useEdtProfileMutation();
  const username = `${loginUser?.first_name} ${loginUser?.last_name}`;
  const dispatch = useDispatch();
  const uploadFromGallery = async () => {
    const result = await launchImageLibrary(IMAGE_OPTIONS);
    setProfileImage(result?.assets[0]);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.containerView}
        key={item.id}
        onPress={() => navigation.navigate('EditProfile', {key: item?.id})}>
        <Text style={styles.textStyles}>{item?.title}</Text>
        {svgIcon.RightChevron}
      </TouchableOpacity>
    );
  };

  const uploaPicture = async () => {
    const data = new FormData();

    data.append('profile[avatar]', {
      uri: profileImage.uri,
      type: profileImage?.type,
      name: profileImage.fileName,
    });
    const resp = await editProfile(data);
    if (resp?.data) {
      dispatch(setLoginUser(resp?.data?.profile));
      setProfileImage(null);
      showAlert('Alert', `Profile has been updated.`);
    } else {
      showAlert('Error', resp?.error?.data?.errors[0] || UNEXPECTED_ERROR);
    }
  };
  return (
    <MainWrapper>
      <AppHeader title="Manage Profile" />
      <View style={styles.showdow} />
      <View style={styles.lightBlueView}>
        <TouchableOpacity onPress={() => uploadFromGallery()}>
          <ImageBackground
            style={styles.profilePicture}
            imageStyle={styles.profilePictureImageStyles}
            source={
              profileImage
                ? profileImage
                : loginUser?.avatar
                ? {uri: loginUser?.avatar}
                : appIcons.imagePlaceholder
            }
            resizeMode="cover">
            <View style={styles.miniCam}>
              <TouchableOpacity onPress={() => uploadFromGallery()}>
                {svgIcon.MiniCam}
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <Text style={styles.username}>{username}</Text>
      </View>

      <FlatList
        data={ManageProfileArr}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.contentContainerStyle}
      />
      {profileImage && (
        <AppButton
          title="Save"
          buttonStyle={styles.btnStyles}
          handleClick={() => uploaPicture()}
        />
      )}
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default ManageProfile;
