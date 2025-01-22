import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {
  AppHeader,
  AppLoader,
  MainWrapper,
  PaymentHistoryCard,
} from '../../../../components';
import {useGetOfferHistoryRoleBaseQuery} from '../../../../redux/common/commonApiSlice';

const PaymentHistory = () => {
  const [queryParams, setQueryParams] = useState({
    role: 'driver',
  });
  const {data, isLoading} = useGetOfferHistoryRoleBaseQuery(queryParams);
  const renderRideRequest = ({item, index}: any) => (
    <PaymentHistoryCard item={item} index={index} />
  );

  return (
    <MainWrapper>
      <AppHeader title="Payment History" />

      <FlatList
        data={data?.orders}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => renderRideRequest({item, index})}
      />
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default PaymentHistory;
