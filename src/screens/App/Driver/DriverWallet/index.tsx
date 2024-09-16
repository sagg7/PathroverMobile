import { View, Text, FlatList } from 'react-native';
import React, { useCallback, useState } from 'react';
import { AppHeader, DynamicSelector, MainWrapper, WalletCard } from '../../../../components';
import styles from './styles';
import { DurationArr, } from '../../../../shared/exporter';

const DriverWallet = ({ }) => {
    const [options, setOptions] = useState(DurationArr)
    const [selectedIndex, setSelectedIndex] = useState(0)

    const handlePressItem = useCallback((index: number) => {
        setOptions(prevOptions =>
            prevOptions.map((item, i) => ({
                ...item,
                isSelected: i === index,
            }))
        );
        setSelectedIndex(index);
    }, []);
    const TransactionCard = () => {
        return (
            <View style={styles.walletTransactionCard}>
                <View>
                    <Text style={styles.nameTime}>Welton</Text>
                    <Text style={styles.nameTime}>Today at 09:20am</Text>
                </View>
                <View style={styles.transactionAmount}>
                    <Text style={styles.transactionAmounttext}>$ 321</Text>
                </View>
            </View>
        )
    }

    return (
        <MainWrapper>
            <AppHeader title='Wallet' />
            <WalletCard balance='5000' handleClick={() => { }} />
            <DynamicSelector
                items={options}
                onPressItem={handlePressItem}
                selectedIndex={selectedIndex}
                btnStyles={styles.selectorBtn}
            />

            <FlatList
                data={[0, 1, 2]}
                renderItem={({ item }) => <TransactionCard item={item} />}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={<Text style={styles.headerText}>Transaction</Text>}
            />

        </MainWrapper>
    );
};

export default DriverWallet;
