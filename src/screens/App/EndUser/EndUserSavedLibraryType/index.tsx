import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {svgIcon} from '../../../../assets/svg';
import {AppHeader, AppLoader, MainWrapper} from '../../../../components';
import {useGetAllSaveRoutesQuery} from '../../../../redux/endUser/endUserApiSlice';
import {Routes} from '../../../../shared/exporter';

const EndUserSavedLibraryType = ({route, navigation}: any) => {
  const item = route?.params?.item;
  const [queryParams] = useState({
    route_type: item?.type,
  });
  const {data, isLoading} = useGetAllSaveRoutesQuery(queryParams);

  const renderView = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.listConatainer}
        key={item?.id}
        onPress={() =>
          navigation.navigate(Routes.ViewSaveRoutes, {item: item})
        }>
        <View style={styles.innerContainer}>
          <View style={styles.iconContainer}>{svgIcon.MapWindow}</View>
          <Text style={styles.listOptionText}>{item?.name}</Text>
        </View>
        {svgIcon.RightChevron}
      </TouchableOpacity>
    );
  };

  return (
    <MainWrapper>
      <AppHeader title={item?.title} />
      <FlatList
        ListHeaderComponent={
          data?.user_routes?.length > 0 && (
            <Text style={styles.titleText}>Your Save Library</Text>
          )
        }
        ListEmptyComponent={
          !isLoading && <Text style={styles.noFound}>No Record Found.</Text>
        }
        data={data?.user_routes}
        renderItem={renderView}
      />
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default EndUserSavedLibraryType;
