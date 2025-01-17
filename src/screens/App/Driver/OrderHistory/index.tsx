import {View, FlatList, Text} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AppLoader,
  BottomTabScreenHeader,
  DynamicSelector,
  MainWrapper,
  RideHistoryCard,
} from '../../../../components';
import styles from './styles';
import {
  OrderHistoryOptions,
  Routes,
  showAlert,
  UNEXPECTED_ERROR,
} from '../../../../shared/exporter';
import {useNavigation} from '@react-navigation/native';
import {
  useDeleteOfferHistoryMutation,
  useGetOfferHistoryRoleBaseQuery,
} from '../../../../redux/common/commonApiSlice';
import ConsentSheet from '../../../../components/complex/ConsentSheet';

const OrderHistory = ({}) => {
  const [options, setOptions] = useState(OrderHistoryOptions);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigation: any = useNavigation();
  const [queryParams, setQueryParams] = useState({
    role: 'driver',
  });
  const delSheet = useRef<any>();
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [delId, setDelId] = useState<any>(null);

  const {data, error, isLoading, refetch} =
    useGetOfferHistoryRoleBaseQuery(queryParams);
  const [deleteOfferHistory, {isLoading: deleteLoader}] =
    useDeleteOfferHistoryMutation();

  useEffect(() => {
    if (queryParams) {
      refetch();
    }
  }, [queryParams, refetch]);

  const handlePressItem = useCallback((index: number, status: string) => {
    setOptions(prevOptions =>
      prevOptions.map((item, i) => ({
        ...item,
        isSelected: i === index,
      })),
    );
    setSelectedIndex(index);
    setQueryParams((prev: any) => ({
      ...prev,
      ...{status: status},
    }));
  }, []);

  const handleDelOffer = async () => {
    const role = {role: 'driver'};
    const resp = await deleteOfferHistory({delId, role});
    if (resp?.data) {
      refetch();
      delSheet.current.close();
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  const navigateToFilter = () => {
    navigation.navigate(Routes.FilterScreen, {
      onSelectDate: filterData => {
        if (filterData?.date || filterData?.location) {
          setQueryParams((prev: any) => ({
            ...prev,
            ...(filterData?.date && {date: filterData.date}),
            ...(filterData?.location && {
              'location[latitude]': filterData.location[1],
              'location[longitude]': filterData.location[0],
            }),
          }));
        } else {
          setQueryParams({
            role: 'manager',
          });
        }

        if (filterData?.date) {
          setSelectedDate(filterData.date);
        }
        if (filterData?.location) {
          setSelectedLocation(filterData.location);
        }
      },
      date: selectedDate,
      location: selectedLocation,
    });
  };

  return (
    <MainWrapper>
      <BottomTabScreenHeader
        title="Order History"
        onPressRightIcon={() => navigateToFilter()}
      />
      <View style={styles.selectorConntainer}>
        <DynamicSelector
          items={options}
          onPressItem={handlePressItem}
          selectedIndex={selectedIndex}
          count={data?.orders?.length}
          btnStyles={styles.selectorStyles}
        />
      </View>

      <FlatList
        data={data?.orders}
        renderItem={({item, index}) => (
          <RideHistoryCard
            item={item}
            index={index}
            onPressDel={() => {
              setDelId(item?.id);
              delSheet.current.open();
            }}
            onPressCard={() => navigation.navigate(Routes.OrderDetails)}
          />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.noRidesContainer}>
            <Text style={styles.noRidesText}>
              {' '}
              {isLoading ? '' : 'No Rides Found'}
            </Text>
          </View>
        }
      />
      <ConsentSheet
        ref={delSheet}
        message={'Are you sure you want to delete this history'}
        cancelBtnText="Cancel"
        successBtnText={'Delete'}
        onPressCancel={() => delSheet?.current?.close()}
        onPressSuccess={handleDelOffer}
        fontSize={14}
      />
      {(isLoading || deleteLoader) && <AppLoader />}
    </MainWrapper>
  );
};

export default OrderHistory;
