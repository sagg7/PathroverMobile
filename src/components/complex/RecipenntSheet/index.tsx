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
import {AppInput} from '../../primitive/AppInput';

interface RecipentSheetProps {
  recipentDetails: {name: string; phone: string} | null;
  setrecipentDetails: React.Dispatch<
    React.SetStateAction<{name: string; phone: string} | null>
  >;
  ref: any;
}

const RecipentSheet: React.FC<RecipentSheetProps> = forwardRef(
  ({recipentDetails, setrecipentDetails}, ref) => {
    const [recipentName, setRecipentName] = useState(
      recipentDetails?.name ? recipentDetails?.name : '',
    );
    const [recipentPhone, setRecipentPhone] = useState(
      recipentDetails?.phone ? recipentDetails?.phone : '',
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
      setrecipentDetails({
        name: recipentName,
        phone: recipentPhone,
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
            height: scale(320),
            borderTopLeftRadius: scale(24),
            borderTopRightRadius: scale(24),
          },
        }}>
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>Upload picture of your cargo</Text>
            <Pressable
              onPress={() => refScrollable.current.close()}
              style={styles.crossBtnStyle}>
              {svgIcon.CrossCirlce}
            </Pressable>
          </View>

          <AppInput placeholder="Full Name" onChangeText={setRecipentName} inputStyle={styles.inputStyle} />
          <AppInput placeholder="Phone No" onChangeText={setRecipentPhone}inputStyle={styles.inputStyle}/>
          <AppButton
            title="Save"
            handleClick={handleSave}
            buttonStyle={styles.btnStyle}
          />
        </ScrollView>
      </RBSheet>
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
   color:PFColors.Standard.Black,
   fontSize:scale(16),
   fontFamily:PFFonts.Foundation.Medium
  },
  btnStyle: {
    marginTop: scale(24),
  },
  crossBtnStyle: {
    position: 'absolute',
    right: 5,
  },
});
