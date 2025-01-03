import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  AppHeader,
  AppLoader,
  CreateRouteSheet,
  MainWrapper,
  SaveRouteCard,
} from '../../../../components';
import {
  useDeleteRouteMutation,
  useGetAllSaveRouteQuery,
  useUpdateRouteMutation,
} from '../../../../redux/manager/managerApiSlice';
import styles from './styles';

const SavedLibrary = () => {
  const {
    data: allRoutes,
    isLoading,
    refetch,
  } = useGetAllSaveRouteQuery(undefined);
  const [updateRoute, {isLoading: editLoading}] = useUpdateRouteMutation();
  const [deleteRoute, {isLoading: delLoading}] = useDeleteRouteMutation();
  const [showCreateRouteSheet, setShowCreateRouteSheet] =
    useState<boolean>(false);
  const [startData, setstartData] = useState<any>(null);
  const [endData, setEndData] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);

  const onPressEdit = async (item: any) => {
    const endItem = item?.dropoff_location;
    const firstItem = item?.pickup_location;

    setEndData({
      latitude: endItem?.latitude,
      longitude: endItem?.longitude,
      name: endItem?.name,
    });
    setstartData({
      latitude: firstItem?.latitude,
      longitude: firstItem?.longitude,
      name: firstItem?.name,
    });
    setRoute(item);
    setTimeout(() => {
      setShowCreateRouteSheet(true);
    }, 1000);
  };

  const onPressUpdate = async (item: any) => {
    const id = route?.id;
    const formatedArr = [startData, ...route?.middle_location_points, endData];
    const data = {
      user_route: {
        name: item,
        locations_attributes: formatedArr,
      },
    };

    const resp = await updateRoute({data, id});
    if (resp?.data) {
      setShowCreateRouteSheet(false);
      refetch();
    }
  };

  const onPressDel = async (itemId: any) => {
    const resp = await deleteRoute(itemId);
    if (resp?.data) {
      refetch();
    }
  };

  const renderSaveRoutes = ({item}: any) => {
    return (
      <SaveRouteCard
        item={item}
        onPressDel={() => onPressDel(item?.id)}
        onPressEdit={() => onPressEdit(item)}
      />
    );
  };

  return (
    <MainWrapper>
      <AppHeader title="Save Library" />
      <FlatList
        contentContainerStyle={styles.flatlistContainerStyle}
        data={allRoutes?.user_routes}
        renderItem={renderSaveRoutes}
        ListEmptyComponent={() => (
          <View style={styles.noDataView}>
            <Text>No data found</Text>
          </View>
        )}
      />
      <CreateRouteSheet
        onPressCross={() => setShowCreateRouteSheet(false)}
        modalVisible={showCreateRouteSheet}
        start={startData}
        end={endData}
        title={route?.name}
        handleSave={onPressUpdate}
      />

      {isLoading || editLoading || (delLoading && <AppLoader />)}
    </MainWrapper>
  );
};

export default SavedLibrary;
