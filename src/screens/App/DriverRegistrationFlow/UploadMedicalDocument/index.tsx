import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
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
import { svgIcon } from '../../../../assets/svg';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setDriverProfile } from '../../../../redux/driver/driverSlice';

const UploadMedicalDocument = () => {
    const [frontSide, setFrontSide] = useState(null);
    const [backSide, setBackSide] = useState(null);
    const dispatch = useDispatch()
    let isDisabled = frontSide?.fileName && backSide?.fileName ? false : true
    const navigation = useNavigation()
    const handleNextBtn = () => {
        if (!isDisabled) {
            let identityArr = [
                { name: 'frontSide', ...frontSide },
                { name: 'backSide', ...backSide },
            ];

            dispatch(
                setDriverProfile({
                    medicalDocument: identityArr,
                }),
            );
            navigation.navigate(Routes.VehicleDetail)
        } else {
            showAlert("Alert", "Please select required data to proceed further.")
        }
    }



    const uploadFromGallery = async (isFront: boolean) => {
        const result = await launchImageLibrary(IMAGE_OPTIONS);
        if (isFront) {
            setFrontSide(result?.assets[0]);
        } else {
            setBackSide(result?.assets[0]);
        }
    };
    const RenderDocList = ({ onPressDelete }) => {
        return (<View style={styles.rowStyles}>
            <Image style={styles.fileIcon} source={frontSide} />
            <Text numberOfLines={1} style={styles.filename}>{frontSide?.fileName}</Text>
            <TouchableOpacity onPress={onPressDelete}>
                {svgIcon.Delete}
            </TouchableOpacity>

        </View>

        )
    }

    return (
        <MainWrapper>
            <ScrollView>
                <MiniProgressBar
                    currentStep={4}
                    heading={"Medical Certificate\nDocument"}
                    desciption="Write details about feature D here. Write details about feature D here. Write details about feature D here."
                    onPressSkip={() => navigation.navigate(Routes.VehicleDetail)
                    }
                />
                <ImageFileUploader title='Upload File' onPressDel={() => setFrontSide(null)} onPressPlaceholder={() => uploadFromGallery(true)} />
                {/* {renderDocList()} */}
                {frontSide &&
                    <RenderDocList onPressDelete={() => setFrontSide(null)} />
                }
                <Text style={styles.cdlDocsStyles}>Upload DOT/CDL docs</Text>
                <ImageFileUploader title='Upload File' onPressDel={() => setBackSide(null)} onPressPlaceholder={() => uploadFromGallery(false)} selectedPicture={backSide} />
                <AppButton title="Next" buttonStyle={styles.buttonStyle} handleClick={() => handleNextBtn()} disabled={isDisabled} />
                <View style={styles.height} />
            </ScrollView>
        </MainWrapper>
    );
};

export default UploadMedicalDocument;
