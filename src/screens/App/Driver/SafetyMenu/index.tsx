import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {AppHeader, MainWrapper} from '../../../../components';
import {svgIcon} from '../../../../assets/svg';
import {Routes, SafetyArr} from '../../../../shared/exporter';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';

const SafetyMenu = () => {
  const navigation: any = useNavigation();

  const MenuMiniCard = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.containerView}
        key={item.id}
        onPress={() => navigation.navigate(Routes.SafetyTips)}>
        <View style={styles.iconTitleContainer}>
          {item.icon}
          <Text style={styles.textStyles}>{item?.title}</Text>
        </View>
        {svgIcon.RightChevron}
      </TouchableOpacity>
    );
  };
  return (
    <MainWrapper>
      <AppHeader title="Safety" />
      <View style={styles.greenCheck}>{svgIcon.SafetyGreen}</View>
      <Text style={styles.textStyle}>Why do you want to contact us?</Text>

      <FlatList
        contentContainerStyle={styles.flatlistContainerStyle}
        data={SafetyArr}
        renderItem={MenuMiniCard}
      />
    </MainWrapper>
  );
};

export default SafetyMenu;
