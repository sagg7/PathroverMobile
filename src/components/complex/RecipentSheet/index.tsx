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
import {formatPhoneNumber, PFColors, PFFonts} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {AppInput} from '../../primitive/AppInput';

interface RecipentSheetProps {
  recipentDetails: {name: string; phone: string} | null;
  setrecipentDetails: React.Dispatch<
    React.SetStateAction<{name: string; phone: string} | null>
  >;
  showRecipentSheet: boolean;
  setShowRecipentSheet: React.Dispatch<React.SetStateAction<boolean>>;
  ref: any;
}

const RecipentSheet: React.FC<RecipentSheetProps> = forwardRef(
  (
    {
      recipentDetails,
      setrecipentDetails,
      showRecipentSheet,
      setShowRecipentSheet,
    },
    ref,
  ) => {
    const [recipentName, setRecipentName] = useState(
      recipentDetails?.name ? recipentDetails?.name : '',
    );
    const [recipentPhone, setRecipentPhone] = useState(
      recipentDetails?.phone ? recipentDetails?.phone : '',
    );

    const handleSave = () => {
      setrecipentDetails({
        name: recipentName,
        phone: recipentPhone,
      });
      setRecipentName('');
      setRecipentPhone('');
      // refScrollable.current.close();
      setShowRecipentSheet(false)
    };

    const isDisable = !recipentName || !recipentPhone;

    return (
      // <RBSheet
      //   ref={refScrollable}
      //   customModalProps={{
      //     animationType: 'slide',
      //     statusBarTranslucent: true,
      //   }}
      //   customStyles={{
      //     container: {
      //       height: scale(320),
      //       borderTopLeftRadius: scale(24),
      //       borderTopRightRadius: scale(24),
      //     },
      //   }}>
      //   <ScrollView contentContainerStyle={styles.bodyContainer}>
          // <View style={styles.headingContainer}>
          //   <Text style={styles.headingText}>Recipient Detail</Text>
          //   <Pressable
          //     onPress={() => refScrollable.current.close()}
          //     style={styles.crossBtnStyle}>
          //     {svgIcon.CrossCirlce}
          //   </Pressable>
          // </View>

          // <AppInput
          //   placeholder="Full Name"
          //   value={recipentName}
          //   onChangeText={setRecipentName}
          //   inputStyle={styles.inputStyle}
          // />
          // <AppInput
          //   placeholder="Phone No"
          //   value={recipentPhone}
          //   onChangeText={setRecipentPhone}
          //   inputStyle={styles.inputStyle}
          //   keyboardType={'number-pad'}
          // />
          // <AppButton
          // disabled={isDisable}
          //   title="Save"
          //   handleClick={handleSave}
          //   buttonStyle={styles.btnStyle}
          // />
      //   </ScrollView>
      // </RBSheet>
      <Modal visible={showRecipentSheet} animationType="slide">
        {/* <ScrollView contentContainerStyle={styles.bodyContainer}> */}
        <Pressable style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'height' : 'padding'}>
            <View
              style={{
                backgroundColor: PFColors.Standard.White,
                position: 'absolute',
                bottom: 0,
                width: scale(375),
                paddingBottom: scale(20),
                paddingHorizontal: scale(16),
                borderTopRightRadius: scale(24),
                borderTopLeftRadius: scale(24),
              }}>
            <View style={styles.headingContainer}>
            <Text style={styles.headingText}>Recipient Detail</Text>
            <Pressable
              onPress={() => setShowRecipentSheet(false)}
              style={styles.crossBtnStyle}>
              {svgIcon.CrossCirlce}
            </Pressable>
          </View>

          <AppInput
            placeholder="Full Name"
            value={recipentName}
            onChangeText={setRecipentName}
            inputStyle={styles.inputStyle}
          />
          <AppInput
            placeholder="Phone No"
            value={recipentPhone}
            onChangeText={(val)=>{
              const formatted = formatPhoneNumber(val);
              setRecipentPhone(formatted)}}
            inputStyle={styles.inputStyle}
            keyboardType={'number-pad'}
          />
          <AppButton
          disabled={isDisable}
            title="Save"
            handleClick={handleSave}
            buttonStyle={styles.btnStyle}
          />
            </View>
          </KeyboardAvoidingView>
        </Pressable>
        {/* </ScrollView> */}
      </Modal>
    );
  },
);

export default RecipentSheet;

const styles = StyleSheet.create({
  bodyContainer: {
    padding: scale(16),
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(32),
    marginBottom: scale(24),
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
    color: PFColors.Standard.Black,
    fontSize: scale(16),
    fontFamily: PFFonts.Foundation.Medium,
  },
  btnStyle: {
    marginTop: scale(24),
  },
  crossBtnStyle: {
    position: 'absolute',
    right: 5,
  },
});
