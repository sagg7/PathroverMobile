import {View, FlatList} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AppLoader,
  BottomTabScreenHeader,
  DynamicSelector,
  MainWrapper,
  RideHistoryCard,
} from '../../../../components';
import styles from './styles';
import {OrderHistoryOptions, Routes} from '../../../../shared/exporter';
import {useNavigation} from '@react-navigation/native';
import {
  useDeleteOfferHistoryMutation,
  useGetOfferHistoryRoleBaseQuery,
} from '../../../../redux/common/commonApiSlice';
import ConsentSheet from '../../../../components/complex/ConsentSheet';

const OrderHistory = ({}) => {
  const [options, setOptions] = useState(OrderHistoryOptions);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigation = useNavigation();
  const [queryParams, setQueryParams] = useState({
    role: 'driver',
    status: 'all',
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
      status: status,
    }));
  }, []);

  const handleDelOffer = async () => {
    const role = {role: 'driver'};
    const resp = await deleteOfferHistory({delId, role});
    if (resp?.data) {
      refetch();
      delSheet.current.close();
    }
  };

  const navigateToFilter = () => {
    navigation.navigate(Routes.FilterScreen, {
      onSelectDate: filterData => {
        console.log('Filter Data:', filterData);

        if (filterData?.date || filterData?.location) {
          // Update queryParams with filterData
          setQueryParams((prev: any) => ({
            ...prev,
            ...(filterData?.date && {date: filterData.date}),
            ...(filterData?.location && {location: filterData.location}),
          }));
        } else {
          // Reset to default queryParams
          setQueryParams({
            role: 'manager',
            status: 'all',
          });
        }

        // Optionally update selectedDate state
        if (filterData?.date) {
          console.log('DDate stored', filterData?.date);

          setSelectedDate(filterData.date);
        }
        if (filterData?.location) {
          console.log('Location stored', filterData?.location);

          setSelectedLocation(filterData.location);
        }
      },
      date: selectedDate,
      location: selectedLocation,
    });
  };

  // const navigateToFilter = () => {
  //   navigation.navigate(Routes.FilterScreen, {
  //     onSelectDate: date => {
  //       setSelectedDate(date);
  //       console.log('DATE ROUTING', date);

  //       if (date) {
  //         setQueryParams((prev: any) => ({
  //           ...prev,
  //           ...(date && {date}),
  //         }));
  //       } else {
  //         setQueryParams({
  //           role: 'manager',
  //           status: 'all',
  //         });
  //       }
  //     },
  //     date: selectedDate,
  //     location: '',
  //   });
  // };

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
              console.log('===>', item?.id);
              delSheet.current.open();
            }}
            onPressCard={() => navigation.navigate(Routes.OrderDetails)}
          />
        )}
        keyExtractor={item => item.id}
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
      {isLoading && deleteLoader && <AppLoader />}
    </MainWrapper>
  );
};

export default OrderHistory;
