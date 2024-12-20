import {FlatList, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {AppHeader, MainWrapper} from '../../../../components';
import {svgIcon} from '../../../../assets/svg';
import {SafetyArr, SafetytipsArr} from '../../../../shared/exporter';
import styles from './styles';

const SafetyTips = () => {
  const MenuMiniCard = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.containerView}
        key={item.id}
        // onPress={() => navigation.navigate('EditProfile', { key: item?.id })}
      >
        <Text style={styles.textStyles}>{item?.title}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <MainWrapper>
      <AppHeader title="Safety Tips" />
      <Text style={styles.textStyle}>
        Safety Tips:
        <Text style={[styles.textStyle, styles.lightFont]}>
          {' '}
          Rules and Guidelines to keep everyone Secure
        </Text>
      </Text>

      <FlatList
        contentContainerStyle={styles.flatlistContainerStyle}
        data={SafetytipsArr}
        renderItem={MenuMiniCard}
      />
    </MainWrapper>
  );
};

export default SafetyTips;
