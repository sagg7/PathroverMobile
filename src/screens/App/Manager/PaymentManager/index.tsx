import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {AppHeader, CardItem, MainWrapper} from '../../../../components';
import {
  useDeleteCardMutation,
  useGetAllCardsMutation,
  useSetDefaultCardMutation,
} from '../../../../redux/manager/managerApiSlice';
import {FlatList, Text, View} from 'react-native';
import {svgIcon} from '../../../../assets/svg';
import styles from './styles';

const PaymentMethods = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [getAllCards, {data, isLoading}] = useGetAllCardsMutation();
  const [deleteCard] = useDeleteCardMutation();
  const [setDefaultCard] = useSetDefaultCardMutation();

  const fetchCards = async () => {
    try {
      await getAllCards();
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    fetchCards();
  }, [isFocused]);

  const onPressDelete = async (id: string) => {
    try {
      const res = await deleteCard(id);
      if (res?.data) {
        fetchCards();
      }
    } catch (error) {
      //
    }
  };

  const setDefault = async (item: object) => {
    try {
      const obj = new FormData();
      obj.append('id', item?.id);
      obj.append('is_default', true);
      const res = await setDefaultCard(obj);
      if (res?.data) {
        fetchCards();
      }
    } catch (error) {}
  };

  const renderItem = ({item}) => {
    return (
      <CardItem
        cardDetail={item}
        onPressDelete={() => onPressDelete(item?.id)}
        onPress={() => setDefault(item)}
      />
    );
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.noDataView}>
        {svgIcon.Cards}
        <Text style={styles.noDataText}>No Cards Found</Text>
      </View>
    );
  };

  return (
    <MainWrapper>
      <AppHeader
        rightIcon
        title="Payment Method"
        clickRightIcon={() => navigation.navigate('AddCard')}
      />
      <FlatList
        data={data?.user_cards}
        keyExtractor={(item, index) => item + index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={styles.flatlistContainerStyle}
      />
    </MainWrapper>
  );
};

export default PaymentMethods;
