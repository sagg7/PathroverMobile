import {useNavigation} from '@react-navigation/native';
import {createToken} from '@stripe/stripe-react-native';
import React from 'react';
import {
  AppHeader,
  CardFieldSheet,
  MainWrapper,
} from '../../../../../components';
import {useAddCardMutation} from '../../../../../redux/manager/managerApiSlice';
import {showAlert} from '../../../../../shared/exporter';

const AddCard = () => {
  const navigation = useNavigation();
  const [addCard, {isLoading}] = useAddCardMutation();
  const onPressSubmit = async (cardDetails: object) => {
    try {
      const {token, error} = await createToken({...cardDetails, type: 'Card'});

      if (token) {
        const obj = {
          token: token?.id,
        };
        const res = await addCard(obj);
        const {data, error} = res;
        if (data) {
          showAlert('Add Card', 'Card Added Successfully');
          navigation.goBack();
        } else if (error) {
          showAlert('Add Card', error?.data?.errors?.join());
        }
      }
    } catch (error) {
      showAlert(
        'Add Card',
        error?.message || error?.data?.errors?.join() || 'Add card failed.',
      );
    }
  };
  return (
    <MainWrapper>
      <AppHeader title="Add Card" />
      <CardFieldSheet onPressSubmit={onPressSubmit} loading={isLoading} />
    </MainWrapper>
  );
};

export default AddCard;
