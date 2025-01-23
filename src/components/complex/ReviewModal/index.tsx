import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {RatingStars} from '../RatingStars';
import {AppInput} from '../../primitive/AppInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface ReviewModalProps {
  modalVisible: boolean;
  loading?: boolean;
  setModalVisible?: () => void;
  onPressDone: (data: object) => void;
  onPressCross: () => void;
  details: object;
}
const ReviewModal = ({
  modalVisible,
  setModalVisible,
  onPressDone,
  onPressCross,
  details,
  loading,
}: ReviewModalProps) => {
  const [data, setData] = useState({
    rating: 0,
    comment: '',
    disabled: true,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (data?.rating > 0 && data?.comment.length > 1 && data.disabled) {
        setData(prev => ({...prev, disabled: false}));
      } else if (
        data?.rating <= 0 &&
        data?.comment.length <= 0 &&
        data.disabled
      ) {
        setData(prev => ({...prev, disabled: true}));
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [data]);

  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <KeyboardAwareScrollView
        enableOnAndroid
        showsVerticalScrollIndicator={false}
        scrollToOverflowEnabled={false}
        contentContainerStyle={styles.main}>
        <View style={styles.container}>
          <View style={styles.modalKnob} />
          <TouchableOpacity
            style={styles.crossIconStyle}
            onPress={onPressCross}
            disabled={loading}>
            {svgIcon.CrossCirlce}
          </TouchableOpacity>
          <RatingStars
            rating={data.rating}
            disabled={false || loading}
            ratingStarStyles={styles.ratingStars}
            starContainerStyle={styles.starContainerStyle}
            onRatingChange={val => setData(prev => ({...prev, rating: val}))}
          />
          <Text style={styles.titleText}>Rate your driver</Text>
          <Text style={styles.subtitleText}>
            You rated {details?.user_name || ''} {data?.rating}{' '}
            {data.rating > 1 ? 'stars' : 'star'}
          </Text>

          <TextInput
            placeholder={'Add Comments'}
            value={data.comment}
            onChangeText={txt => setData(prev => ({...prev, comment: txt}))}
            style={styles.inputContainerStyle}
            placeholderTextColor={PFColors.Gray.DarkGray}
            // placeholderFontFamily={PFFonts.Foundation.SemiBold}
            editable={!loading}
            multiline
          />

          <View style={styles.buttonsRow}>
            <AppButton
              title="Submit"
              isEmpty={false}
              textStyle={styles.textStyle}
              handleClick={() => onPressDone(data)}
              disabled={data.disabled}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export {ReviewModal};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  main: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  container: {
    margin: 0,
    borderRadius: WP('4'),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: WP('5'),
    backgroundColor: PFColors.Standard.White,
    width: WP('100'),
    paddingHorizontal: WP('4'),
    justifyContent: 'flex-end',
  },
  buttonsRow: {
    marginVertical: 10,
  },
  textStyle: {
    width: '100%',
    textAlign: 'center',
  },
  titleText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: PFFonts.Foundation.Medium,
    color: PFColors.Gray.FadedGray,
    fontSize: PFFontSize.FONT_SIZE_16,
    textAlign: 'center',
    marginTop: WP('1'),
  },
  crossIconStyle: {
    alignSelf: 'flex-end',
    marginVertical: WP('3'),
    right: 12,
    position: 'absolute',
    top: 0,
  },
  modalKnob: {
    alignSelf: 'center',
    paddingVertical: WP('0.5'),
    backgroundColor: PFColors.Gray.borderGray,
    width: 44,
    borderRadius: 12,
    position: 'absolute',
    top: WP('4'),
  },
  ratingStars: {
    height: 20,
    width: 20,
    marginRight: WP('1.5'),
  },
  starContainerStyle: {
    alignSelf: 'center',
    marginBottom: WP('2'),
    marginTop: WP('10'),
  },
  inputContainerStyle: {
    backgroundColor: PFColors.Standard.White,
    height: WP('25'),
    borderStyle: 'dashed',
    borderColor: PFColors.Standard.Black,
    marginBottom: WP('2'),
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.Regular,
    borderWidth: 1,
    borderRadius: 20,
    textAlignVertical: 'top',
    padding: 20,
  },
});
