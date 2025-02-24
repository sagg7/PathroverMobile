import {View, Text, TouchableOpacity, FlatList, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {svgIcon} from '../../../../assets/svg';
import {AppButton, AppHeader, MainWrapper} from '../../../../components';
import {mapBoxToken, Routes} from '../../../../shared/exporter';
import MapboxGL from '@rnmapbox/maps';
import {useIsFocused} from '@react-navigation/native';

const DownloadedMapList = ({navigation}: any) => {
  MapboxGL.setAccessToken(mapBoxToken);
  const isFocused = useIsFocused();

  const [downloadedMaps, setDownloadedMaps] = useState<any>([]);

  useEffect(() => {
    if (isFocused) checkDownloadedMaps();
  }, [isFocused]);

  const checkDownloadedMaps = async () => {
    try {
      const packs = await MapboxGL.offlineManager.getPacks();
      setDownloadedMaps(packs);
    } catch (error) {
      console.error('Check Offline Maps Error:', error);
      Alert.alert('Error', 'Failed to check offline maps.');
    }
  };

  const deleteMap = async (name: string) => {
    try {
      await MapboxGL.offlineManager.deletePack(name);
      Alert.alert('Deleted', `Offline map "${name}" has been deleted.`);
      checkDownloadedMaps(); // Refresh list after deletion
    } catch (error) {
      console.error('Delete Offline Map Error:', error);
      Alert.alert('Error', 'Failed to delete the offline map.');
    }
  };

  const renderView = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.listConatainer}
        onPress={() => {
          navigation.navigate(Routes.ViewOfflineMap, {item});
        }}>
        <View style={styles.innerContainer}>
          <View style={styles.iconContainer}>{svgIcon.RouteBlue}</View>
          <Text style={styles.listOptionText}>{item?.name}</Text>
        </View>
        <TouchableOpacity onPress={() => deleteMap(item.name)}>
          {svgIcon.Delete}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <MainWrapper>
      <AppHeader title="Save Library" />
      <FlatList
        ListHeaderComponent={
          <Text style={styles.titleText}>Your Map Library</Text>
        }
        data={downloadedMaps}
        renderItem={renderView}
      />
      <AppButton
        title="Add Map"
        buttonStyle={styles.btnStyles}
        handleClick={() => navigation.navigate(Routes.DownloadOfflineMap)}
      />
    </MainWrapper>
  );
};

export default DownloadedMapList;
