import {
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
import {PFColors, PFFonts} from '../../../shared/exporter';
import {AppButton} from '../AppButton';

interface cargoSheetProps {
  cargoDescriptionDetails: {image: any; description: any} | null;
  setCargoDescriptionDetails: React.Dispatch<
    React.SetStateAction<{image: any; description: any} | null>
  >;
  ref: any;
}

const CargoSheet: React.FC<cargoSheetProps> = forwardRef(
  ({cargoDescriptionDetails, setCargoDescriptionDetails}, ref) => {
    const [cargoDescription, setCargoDescription] = useState(
      cargoDescriptionDetails?.description
        ? cargoDescriptionDetails?.description
        : '',
    );
    const [cargoImage, setCargoImage] = useState(
      cargoDescriptionDetails?.image ? cargoDescriptionDetails?.image : null,
    );

    const refScrollable = useRef(null);
    useImperativeHandle(ref, () => ({
      open: () => {
        refScrollable.current.open();
      },
      close: () => {
        refScrollable.current.close();
      },
    }));
    const handleSave = () => {
      setCargoDescriptionDetails({
        image: cargoImage,
        description: cargoDescription,
      });
    };
    return (
      <RBSheet
        ref={refScrollable}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customStyles={{
          container: {
            height: scale(525),
            borderTopLeftRadius: scale(24),
            borderTopRightRadius: scale(24),
          },
        }}>
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>Upload picture of your cargo</Text>
            <Pressable onPress={() => refScrollable.current.close()}>
              {svgIcon.CrossCirlce}
            </Pressable>
          </View>
          <View style={styles.uploadOptionsContainer}>
            <Pressable style={styles.uploadOptionsItem}>
              {svgIcon.CameraBlue}
              <Text style={styles.optionText}>Camera</Text>
            </Pressable>
            <Pressable style={styles.uploadOptionsItem}>
              {svgIcon.GalleryBlue}
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </Pressable>
            <Text style={styles.imageName}>Image.png</Text>
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
          <AppButton title="Save" handleClick={handleSave} />
        </ScrollView>
      </RBSheet>
    );
  },
);

export default CargoSheet;

const styles = StyleSheet.create({
  bodyContainer: {
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
    color: PFColors.Standard.Black,
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
