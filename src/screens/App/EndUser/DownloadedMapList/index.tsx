import {View, Text, TouchableOpacity, FlatList, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {svgIcon} from '../../../../assets/svg';
import {AppButton, AppHeader, MainWrapper} from '../../../../components';
import {mapBoxToken, Routes, showAlert} from '../../../../shared/exporter';
import MapboxGL from '@rnmapbox/maps';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const DownloadedMapList = ({navigation}: any) => {
  MapboxGL.setAccessToken(mapBoxToken);
  const isFocused = useIsFocused();

  const [downloadedMaps, setDownloadedMaps] = useState<any>([]);
  const {downloadMap} = useSelector(state => state?.endUser?.trailRoute);
  useEffect(() => {
    if (isFocused) checkDownloadedMaps();
  }, [isFocused]);

  const checkDownloadedMaps = async () => {
    try {
      const packs = await MapboxGL.offlineManager.getPacks();
      const completedMaps = packs.filter(
        (pack: any) => pack?.pack?.state === 'complete',
      );

      setDownloadedMaps(completedMaps);
    } catch (error) {
      console.error('Check Offline Maps Error:', error);
      showAlert('Error', 'Failed to check offline maps.');
    }
  };

  const deleteMap = async (name: string) => {
    try {
      await MapboxGL.offlineManager.deletePack(name);
      showAlert('Deleted', `Offline map "${name}" has been deleted.`);
      checkDownloadedMaps(); // Refresh list after deletion
    } catch (error) {
      console.error('Delete Offline Map Error:', error);
      showAlert('Error', 'Failed to delete the offline map.');
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
      <AppHeader title="Map Library" />
      <FlatList
        ListHeaderComponent={
          <Text style={styles.titleText}>Your Map Library</Text>
        }
        data={downloadedMaps}
        renderItem={renderView}
      />

      {'downloadSize' in downloadMap && downloadMap?.downloading ? (
        <View style={styles.downloadView}>
          <Text style={styles.titleStyles}>
            You already have a download in progress. Currently downloaded...{' '}
            {downloadMap?.downloadSize}%
          </Text>
        </View>
      ) : (
        <AppButton
          title="Add Map"
          buttonStyle={styles.btnStyles}
          handleClick={() => navigation.navigate(Routes.DownloadOfflineMap)}
        />
      )}
    </MainWrapper>
  );
};

export default DownloadedMapList;
