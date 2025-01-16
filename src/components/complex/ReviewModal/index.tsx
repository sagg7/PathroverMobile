import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../shared/exporter';
import {AppButton} from '../AppButton';
import {RatingStars} from '../RatingStars';
import {AppInput} from '../../primitive/AppInput';

interface ReviewModalProps {
  modalVisible: boolean;
  setModalVisible?: () => void;
  onPressDone: () => void;
  onPressCross: () => void;
}
const ReviewModal = ({
  modalVisible,
  setModalVisible,
  onPressDone,
  onPressCross,
}: ReviewModalProps) => {
  const [data, setData] = useState({
    rating: 0,
    comment: '',
    disabled: true,
  });

  useEffect(() => {
    if (data?.rating > 0 && data?.comment.length > 1) {
      setData(prev => ({...prev, disabled: false}));
    }
  }, [data]);

  return (
    <Modal
      useNativeDriver
      isVisible={modalVisible}
      onBackdropPress={setModalVisible}
      style={styles.modalContainer}>
      <View>
        <View style={styles.modalKnob} />
        <TouchableOpacity style={styles.crossIconStyle} onPress={onPressCross}>
          {svgIcon.CrossCirlce}
        </TouchableOpacity>
        <RatingStars
          rating={data.rating}
          disabled={false}
          ratingStarStyles={styles.ratingStars}
          starContainerStyle={styles.starContainerStyle}
          onRatingChange={val => setData(prev => ({...prev, rating: val}))}
        />
        <Text style={styles.titleText}>Rate your driver</Text>
        <Text style={styles.subtitleText}>
          You rated Sergio Romasis {data?.rating}{' '}
          {data.rating > 1 ? 'stars' : 'star'}
        </Text>

        <AppInput
          multiline
          placeholder={'Add Comments'}
          value={data.comment}
          onChangeText={txt => setData(prev => ({...prev, comment: txt}))}
          inputContainerStyle={styles.inputContainerStyle}
          placeholderBackgroundColor={'transparent'}
          placeholderFontFamily={PFFonts.Foundation.SemiBold}
        />

        <View style={styles.buttonsRow}>
          <AppButton
            title="Submit"
            isEmpty={false}
            textStyle={styles.textStyle}
            handleClick={onPressDone}
            disabled={data.disabled}
          />
        </View>
      </View>
    </Modal>
  );
};

export {ReviewModal};

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    margin: 0,
    position: 'absolute',
    borderRadius: WP('4'),
    paddingBottom: WP('5'),
    backgroundColor: PFColors.Standard.White,
    width: WP('100'),
    paddingHorizontal: WP('4'),
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
    right: 0,
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
  },
});
