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

interface ConsentSheetProps {
  onPressSuccess: () => void;
  onPressCancel: () => void;
  message: string;
  cancelBtnText: string;
  successBtnText: string;
  ref: any;
}

const ConsentSheet: React.FC<ConsentSheetProps> = forwardRef(
  (
    {onPressSuccess, onPressCancel, message, cancelBtnText, successBtnText},
    ref,
  ) => {
    const [contentHeight, setContentHeight] = useState(200);

    const handleContentLayout = (event: any) => {
      const {height} = event.nativeEvent.layout;
      setContentHeight(height);
    };

    return (
      <RBSheet
        ref={ref}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customStyles={{
          container: {
            height: contentHeight,
            borderTopLeftRadius: scale(24),
            borderTopRightRadius: scale(24),
          },
        }}>
        <View onLayout={handleContentLayout} style={styles.mainContainer}>
          <Text style={styles.messageTextStyle}>{message}</Text>
          <View style={styles.btnContainer}>
            <Pressable style={styles.cancelBtnStyle} onPress={onPressCancel}>
              <Text style={styles.cancelBtnTextStyle}>{cancelBtnText}</Text>
            </Pressable>
            <Pressable style={styles.successBtnStyle} onPress={onPressSuccess}>
              <Text style={styles.successBtnTextStyle}>{successBtnText}</Text>
            </Pressable>
          </View>
        </View>
      </RBSheet>
    );
  },
);

export default ConsentSheet;

const styles = StyleSheet.create({
  mainContainer: {
   padding:scale(16)
  },
  messageTextStyle: {
    color: PFColors.Standard.Black,
    fontSize: scale(20),
    fontFamily: PFFonts.Foundation.SemiBold,
    marginBottom: scale(24),
    textAlign:'center'
  },
  btnContainer: {
    width:'100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom:scale(16)
  },
  cancelBtnStyle: {
    borderWidth: 1,
    borderRadius: scale(100),
    borderColor: PFColors.Blue.Dark,
    height: scale(40),
    width: scale(166),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnTextStyle: {
    color: PFColors.Blue.Dark,
    fontSize: scale(16),
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  successBtnStyle: {
    borderRadius: scale(100),
    height: scale(40),
    width: scale(166),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:PFColors.Blue.Dark
  },
  successBtnTextStyle: {
    color: PFColors.Standard.White,
    fontSize: scale(16),
    fontFamily: PFFonts.Foundation.SemiBold,
  },
});
