import { View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import {
    AppButton,
    ImageFileUploader,
    MainWrapper,
    MiniProgressBar,
} from '../../../../components';
import styles from './styles';
import { IMAGE_OPTIONS, Routes, showAlert } from '../../../../shared/exporter';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setDriverProfile } from '../../../../redux/driver/driverSlice';

const UploadLicense = () => {
    const [frontSide, setFrontSide] = useState(null);
    const [backSide, setBackSide] = useState(null);
    const dispatch = useDispatch()
    let isDisabled = frontSide?.fileName && backSide?.fileName ? false : true
    const navigation = useNavigation()
    const uploadFromGallery = async (isFront: boolean) => {
        const result = await launchImageLibrary(IMAGE_OPTIONS);
        if (isFront) {
            setFrontSide(result?.assets[0]);
        } else {
            setBackSide(result?.assets[0]);
        }
    };

    const handleNextBtn = () => {
        if (!isDisabled) {
            let licenceArr = [
                { name: 'frontSide', ...frontSide },
                { name: 'backSide', ...backSide },
            ];

            dispatch(
                setDriverProfile({
                    licence: licenceArr,
                }),
            );
            navigation.navigate(Routes.UploadMedicalDocument)
        } else {
            showAlert("Alert", "Please select required data to proceed further.")
        }
    }


    return (
        <MainWrapper>
            <ScrollView>
                <MiniProgressBar
                    currentStep={3}
                    heading={"Driving License"}
                    desciption="Write details about feature D here. Write details about feature D here. Write details about feature D here."
                    onPressSkip={() => navigation.navigate(Routes.UploadMedicalDocument)}
                />
                <ImageFileUploader title='Front Side' onPressDel={() => setFrontSide(null)} onPressPlaceholder={() => uploadFromGallery(true)} selectedPicture={frontSide} />
                <View style={styles.height} />
                <ImageFileUploader title='Back Side' onPressDel={() => setBackSide(null)} onPressPlaceholder={() => uploadFromGallery(false)} selectedPicture={backSide} />
                <AppButton title="Next" buttonStyle={styles.buttonStyle} handleClick={() => handleNextBtn()} disabled={isDisabled} />
                <View style={styles.height} />
            </ScrollView>
        </MainWrapper>
    );
};

export default UploadLicense;
