import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {AppHeader, MainWrapper} from '../../../components';
import {scale, WP} from '../../../shared/theme/responsive';
import {PFColors} from '../../../shared/exporter';
import {svgIcon} from '../../../assets/svg';
import styles from './styles';

const FAQs = () => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const renderFaqs = () => {
    return (
      <TouchableOpacity onPress={() => setIsSelected(!isSelected)}>
        <View style={getViewStyles(isSelected)}>
          <View>
            <Text style={styles.questionStyles}>Question 1</Text>
            {isSelected && (
              <Text style={styles.answerStyles}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s,
              </Text>
            )}
          </View>
          <View style={chevronStyles(isSelected)}>{svgIcon.UpChaveron}</View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MainWrapper>
      <AppHeader title="FAQ’s" />
      <FlatList
        data={[0]}
        renderItem={renderFaqs}
        contentContainerStyle={{marginTop: 20}}
      />
    </MainWrapper>
  );
};

export default FAQs;

const getViewStyles = (isSelected: boolean) => ({
  padding: scale(16),
  backgroundColor: isSelected
    ? PFColors.Blue.SoftGlacier
    : PFColors.Gray.CloudGray,
  borderColor: isSelected ? PFColors.Blue.Dark : PFColors.Gray.borderGray,
  marginHorizontal: WP('6'),
  borderWidth: 1,
  borderRadius: 10,
  flexDirection: 'row',
});
const chevronStyles = (isSelected: boolean) => ({
  transform: [{rotate: isSelected ? '0deg' : '180deg'}],
  position: 'absolute',
  right: 20,
  top: WP('5'),
});
