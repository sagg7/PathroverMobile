import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Linking, Text, View} from 'react-native';
import {
  AppHeader,
  DynamicSelector,
  MainWrapper,
  WalletCard,
} from '../../../../components';
import {getFormattedDate} from '../../../../hooks/getFormattedDate';
import {
  useGetWalletTransactionsMutation,
  useLinkBankAccountMutation,
} from '../../../../redux/driver/driverApiSlice';
import {
  DurationArr,
  PFColors,
  Routes,
  showAlert,
} from '../../../../shared/exporter';
import styles from './styles';

const DriverWallet = ({}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [options, setOptions] = useState(DurationArr);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [getWalletTransactions, {data, isLoading}] =
    useGetWalletTransactionsMutation();
  const [linkBankAccount] = useLinkBankAccountMutation();

  const getTransactions = async () => {
    try {
      await getWalletTransactions();
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    const filterOption = options.filter(item => item.isSelected);
    const selectedOption = filterOption?.[0]?.title?.toLowerCase();
    getTransactions(selectedOption);
  }, [isFocused, options]);

  const onPressWallet = async () => {
    try {
      const res = await linkBankAccount();
      if (res?.data) {
        const {response} = res?.data;
        Linking.openURL(response);
      } else if (res?.error) {
        showAlert('Link Bank Account', res?.error?.data?.errors?.join());
      }
    } catch (error) {
      //
    }
  };

  const handlePressItem = useCallback((index: number) => {
    setOptions(prevOptions =>
      prevOptions.map((item, i) => ({
        ...item,
        isSelected: i === index,
      })),
    );
    setSelectedIndex(index);
  }, []);

  const getColor = (type: string) => {
    switch (type) {
      case 'withdrawal':
        return PFColors.Standard.Debit;
      case 'deposit':
        return PFColors.Blue.Dark;
      default:
        return PFColors.Blue.Dark;
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.walletTransactionCard}>
        <View>
          {/* <Text style={styles.nameTime}>Welton</Text> */}
          <Text style={styles.nameTime}>
            {getFormattedDate(item?.created_at)}
          </Text>
        </View>
        <View
          style={styles.transactionAmount(getColor(item?.transaction_type))}>
          <Text style={styles.transactionAmounttext}>
            $ {item?.amount || 0}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <MainWrapper>
      <AppHeader
        title="Wallet"
        isWallet
        rightIcon
        clickRightIcon={() => {
          onPressWallet();
        }}
      />
      <WalletCard
        balance={data?.total_balance}
        handleClick={() => {
          navigation.navigate(Routes.WithdrawAmount);
        }}
      />
      <DynamicSelector
        items={options}
        onPressItem={handlePressItem}
        selectedIndex={selectedIndex}
        btnStyles={styles.selectorBtn}
      />

      <FlatList
        data={data?.transactions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <Text style={styles.headerText}>Transactions</Text>
        }
      />
    </MainWrapper>
  );
};

export default DriverWallet;
