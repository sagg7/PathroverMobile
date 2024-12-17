import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {scale, WP} from '../../../shared/theme/responsive';
import {svgIcon} from '../../../assets/svg';
import {IMAGE_OPTIONS, PFColors, PFFonts} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

interface cargoSheetProps {
  cargoDescriptionDetails: {image: any; description: any} | null;
  setCargoDescriptionDetails: React.Dispatch<
    React.SetStateAction<{image: any; description: any} | null>
  >;
  ref: any;
  showCargoSheet: boolean;
  setShowCargoSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const CargoSheet: React.FC<cargoSheetProps> = forwardRef(
  (
    {
      cargoDescriptionDetails,
      setCargoDescriptionDetails,
      showCargoSheet,
      setShowCargoSheet,
    },
    ref,
  ) => {
    const [cargoDescription, setCargoDescription] = useState(
      cargoDescriptionDetails?.description
        ? cargoDescriptionDetails?.description
        : '',
    );
    const [cargoImage, setCargoImage] = useState(
      cargoDescriptionDetails?.image ? cargoDescriptionDetails?.image : null,
    );

    

    const uploadFromGallery = async () => {
      const result = await launchImageLibrary(IMAGE_OPTIONS);
      setCargoImage(result?.assets[0]);
    };

    const uploadFromCamer = async () => {
      try {
        const result = await launchCamera(IMAGE_OPTIONS);
        setCargoImage(result?.assets[0]);
      } catch (error) {
        console.log('error ====== : ', error);
      }
    };

    const handleSave = () => {
      setCargoDescriptionDetails({
        image: cargoImage,
        description: cargoDescription,
      });
      setCargoDescription('');
      setCargoImage(null);
      // refScrollable.current.close();
      setShowCargoSheet(false)
    };

    const isDisable = !cargoImage || !cargoDescription;

    return (
      // <RBSheet
      // closeOnPressBack={true}
      // onClose={()=>{
      //   setCargoDescription('');
      // setCargoImage(null);
      // }}
      //   ref={refScrollable}
      //   customModalProps={{
      //     animationType: 'slide',
      //     statusBarTranslucent: true,
      //   }}
      //   customStyles={{
      //     container: {
      //       height: scale(525),
      //       borderTopLeftRadius: scale(24),
      //       borderTopRightRadius: scale(24),
      //     },
      //   }}>
      // <ScrollView contentContainerStyle={styles.bodyContainer}>
      //   <View style={styles.headingContainer}>
      //     <Text style={styles.headingText}>Upload picture of your cargo</Text>
      //     <Pressable onPress={() => refScrollable.current.close()}>
      //       {svgIcon.CrossCirlce}
      //     </Pressable>
      //   </View>
      //   <View style={styles.uploadOptionsContainer}>
      //     <Pressable
      //       style={styles.uploadOptionsItem}
      //       onPress={uploadFromCamer}>
      //       {svgIcon.CameraBlue}
      //       <Text style={styles.optionText}>Camera</Text>
      //     </Pressable>
      //     <Pressable
      //       style={styles.uploadOptionsItem}
      //       onPress={uploadFromGallery}>
      //       {svgIcon.GalleryBlue}
      //       <Text style={styles.optionText}>Choose from Gallery</Text>
      //     </Pressable>
      //     {cargoImage && (
      //       <Text style={styles.imageName}>{cargoImage?.fileName}</Text>
      //     )}
      //   </View>
      //   <Text style={styles.headingText}>Description of the Cargo</Text>
      //   <TextInput
      //     multiline
      //     placeholder="Description from Transport Manager "
      //     placeholderTextColor={PFColors.Gray.DarkGray}
      //     style={styles.inputStyle}
      //     textAlignVertical="top"
      //     value={cargoDescription}
      //     onChangeText={setCargoDescription}
      //   />
      //   <AppButton
      //     title="Save"
      //     handleClick={handleSave}
      //     disabled={isDisable}
      //   />
      // </ScrollView>
      // </RBSheet>
      <Modal visible={showCargoSheet} animationType="slide">
        {/* <ScrollView contentContainerStyle={styles.bodyContainer}> */}
        <Pressable style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
          <KeyboardAvoidingView style={{flex:1}}
          behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
          >
          <View
            style={{
              backgroundColor: PFColors.Standard.White,
              position: 'absolute',
              bottom: 0,
              width: scale(375),
              paddingBottom:scale(20),
              paddingHorizontal:scale(16),
              borderTopRightRadius:scale(24),
              borderTopLeftRadius:scale(24)
            }}>
            <View style={styles.headingContainer}>
              <Text style={styles.headingText}>
                Upload picture of your cargo
              </Text>
              <Pressable
                onPress={() => setShowCargoSheet(false)}
                // onPress={() => refScrollable.current.close()}
              >
                {svgIcon.CrossCirlce}
              </Pressable>
            </View>
            <View style={styles.uploadOptionsContainer}>
              <Pressable
                style={styles.uploadOptionsItem}
                onPress={uploadFromCamer}>
                {svgIcon.CameraBlue}
                <Text style={styles.optionText}>Camera</Text>
              </Pressable>
              <Pressable
                style={styles.uploadOptionsItem}
                onPress={uploadFromGallery}>
                {svgIcon.GalleryBlue}
                <Text style={styles.optionText}>Choose from Gallery</Text>
              </Pressable>
              {cargoImage && (
                <Text style={styles.imageName}>{cargoImage?.fileName}</Text>
              )}
            </View>
            <Text style={styles.headingText}>Description of the Cargo</Text>
            <TextInput
              multiline
              placeholder="Description from Transport Manager "
              placeholderTextColor={PFColors.Gray.DarkGray}
              style={styles.inputStyle}
              textAlignVertical="top"
              value={cargoDescription}
              onChangeText={setCargoDescription}
            />
            <AppButton
              title="Save"
              handleClick={handleSave}
              disabled={isDisable}
            />
          </View>
          </KeyboardAvoidingView>
        </Pressable>
        {/* </ScrollView> */}
      </Modal>
    );
  },
);

export default CargoSheet;

const styles = StyleSheet.create({
  bodyContainer: {
    // height:scale(514),
    padding: scale(16),
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scale(32),
  },
  headingText: {
    fontSize: scale(16),
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
  },
  uploadOptionsContainer: {
    marginVertical: scale(16),
  },
  uploadOptionsItem: {
    flexDirection: 'row',
    marginBottom: scale(12),
  },
  optionText: {
    fontSize: scale(14),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    marginLeft: scale(12),
  },
  imageName: {
    fontSize: scale(12),
    fontFamily: PFFonts.Foundation.Light,
    color: PFColors.Blue.Dark,
  },
  inputStyle: {
    borderWidth: scale(1),
    height: scale(214),
    marginTop: scale(12),
    borderRadius: scale(16),
    borderStyle: 'dashed',
    paddingVertical: scale(16),
    paddingHorizontal: scale(12),
    fontSize: scale(16),
    fontFamily: PFFonts.Foundation.Medium,
    color: PFColors.Gray.DarkGray,
    marginBottom: scale(32),
  },
});
