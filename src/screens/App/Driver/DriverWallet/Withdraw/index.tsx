import React, {useState} from 'react';
import {
  AppButton,
  AppHeader,
  AppInput,
  MainWrapper,
} from '../../../../../components';
import styles from './styles';
import {View} from 'react-native';
import {useWithdrawAmountMutation} from '../../../../../redux/driver/driverApiSlice';
import {showAlert} from '../../../../../shared/exporter';

const WithdrawAmount = () => {
  const [amount, setAmount] = useState(0);
  const [withdrawAmount, {isLoading}] = useWithdrawAmountMutation();

  const onPressSubmit = async () => {
    try {
      const res = await withdrawAmount({amount: amount});
      if (res?.data) {
        showAlert('Withdraw Amount', 'Amount Withdrawn Successfully');
      } else if (res?.error) {
        showAlert('Withdraw Amount', res?.error?.data?.errors?.join());
      }
    } catch (error) {
      //
    }
  };
  return (
    <MainWrapper>
      <AppHeader title="Withdraw Amount" />
      <View style={styles.contentView}>
        <AppInput
          placeholder="Amount"
          value={amount}
          onChangeText={txt => {
            if (parseInt(txt) > -1) {
              setAmount(txt);
            }
          }}
          keyboardType={'numeric'}
        />
        <View style={styles.buttonsRow}>
          <AppButton
            title="Confirm Withdraw"
            isEmpty={false}
            textStyle={styles.textStyle}
            handleClick={() => {
              onPressSubmit();
            }}
            disabled={isLoading || amount <= 0}
          />
        </View>
      </View>
    </MainWrapper>
  );
};

export default WithdrawAmount;
