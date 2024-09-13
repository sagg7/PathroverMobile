import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import {
    AppButton,
    MainWrapper,
    MiniProgressBar,
    UploaderInput,
} from '../../../../components';
import styles from './styles';
import { IMAGE_OPTIONS, Routes, appIcons, showAlert } from '../../../../shared/exporter';
import { launchImageLibrary } from 'react-native-image-picker';
import { DateRangePicker } from '../../../../components/complex/DatePicker';
import { useDispatch } from 'react-redux';
import { setDriverProfile } from '../../../../redux/driver/driverSlice';
import { useNavigation } from '@react-navigation/native';

const DriverProfile = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false)
    const [dob, setDob] = useState(null)
    const [birthDate, setBirthDate] = useState(null)
    let disabled = profileImage?.fileName && birthDate || false
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const uploadFromGallery = async () => {
        const result = await launchImageLibrary(IMAGE_OPTIONS);
        setProfileImage(result?.assets[0]);
    };
    const onPressContinue = () => {
        if (birthDate && profileImage) {
            const obj = {
                profile: profileImage,
                dob: birthDate
            }
            dispatch(setDriverProfile(obj))
            navigation.navigate(Routes.UploadIdentity)
        } else {
            showAlert("Alert", "Please select required data to proceed further.")
        }
    }

    const handleDob = (i) => {
        setBirthDate(i)
    }

    return (
        <MainWrapper>
            <ScrollView>
                <MiniProgressBar
                    currentStep={1}
                    heading="Driver Profile"
                    desciption="Write details about feature D here. Write details about feature D here. Write details about feature D here."
                />
                {profileImage ? (
                    <>
                        <Image
                            style={styles.profilePicture}
                            source={profileImage}
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
                <UploaderInput
                    value={birthDate}
                    placeholder="DOB"
                    onPress={() => setShowCalendar(true)}
                />
                <DateRangePicker modalVisible={showCalendar} onPressDone={() => setShowCalendar(false)} setDob={handleDob} onPressCancel={() => setShowCalendar(false)} />
                <AppButton title="Continue" buttonStyle={styles.buttonStyle} handleClick={() => onPressContinue()} disabled={!disabled} />
                <View style={styles.height} />
            </ScrollView>
        </MainWrapper>
    );
};

export default DriverProfile;
