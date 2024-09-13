import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import {
    AppButton,
    ImageFileUploader,
    MainWrapper,
    MiniProgressBar,
} from '../../../../components';
import styles from './styles';
import { IMAGE_OPTIONS } from '../../../../shared/exporter';
import { launchImageLibrary } from 'react-native-image-picker';
import { svgIcon } from '../../../../assets/svg';

const VehicleRegistration = () => {
    const [frontSide, setFrontSide] = useState(null);
    const uploadFromGallery = async (isFront: boolean) => {
        const result = await launchImageLibrary(IMAGE_OPTIONS);
        setFrontSide(result?.assets[0]);
    };
    const RenderDocList = ({ onPressDelete }) => {
        return (<View style={styles.rowStyles}>
            <Image style={styles.fileIcon} source={frontSide} />
            <Text numberOfLines={1} style={styles.filename}>File name</Text>
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
                    currentStep={6}
                    heading={"Vehicle Registration\nDocument"}
                    desciption="Write details about feature D here. Write details about feature D here. Write details about feature D here."
                    onPressSkip={() => console.log("working")
                    }
                />
                <ImageFileUploader title='Upload File' onPressDel={() => setFrontSide(null)} onPressPlaceholder={() => uploadFromGallery(true)} />
                {/* {renderDocList()} */}
                {frontSide &&
                    <RenderDocList onPressDelete={() => setFrontSide(null)} />
                }
                <AppButton title="Next" buttonStyle={styles.buttonStyle} disabled />
                <View style={styles.height} />
            </ScrollView>
        </MainWrapper>
    );
};

export default VehicleRegistration;
