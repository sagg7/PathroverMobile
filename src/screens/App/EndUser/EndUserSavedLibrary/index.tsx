import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import styles from './styles';
import {svgIcon} from '../../../../assets/svg';
import {AppHeader, MainWrapper} from '../../../../components';
import {EndUserSetting, Routes} from '../../../../shared/exporter';

const EndUserSavedLibrary = ({navigation}: any) => {
  const renderView = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.listConatainer}
        onPress={() =>
          navigation.navigate(Routes.EndUserSavedLibraryType, {item})
        }
        key={4}>
        <View style={styles.innerContainer}>
          <View style={styles.iconContainer}>{item.icon}</View>
          <Text style={styles.listOptionText}>{item?.title}</Text>
        </View>
        {svgIcon.RightChevron}
      </TouchableOpacity>
    );
  };

  return (
    <MainWrapper>
      <AppHeader title="Save Library" />
      <FlatList
        ListHeaderComponent={
          <Text style={styles.titleText}>Your Save Library</Text>
        }
        data={EndUserSetting}
        renderItem={renderView}
      />
    </MainWrapper>
  );
};

export default EndUserSavedLibrary;
