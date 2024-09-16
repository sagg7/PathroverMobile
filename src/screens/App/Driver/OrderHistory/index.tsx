import { View, Text, FlatList } from 'react-native';
import React, { useCallback, useState } from 'react';
import { BottomTabScreenHeader, DynamicSelector, MainWrapper, RideHistoryCard } from '../../../../components';
import styles from './styles';
import { OrderHistoryOptions, Routes, } from '../../../../shared/exporter';
import { useNavigation } from '@react-navigation/native';

const OrderHistory = ({ }) => {
    const [options, setOptions] = useState(OrderHistoryOptions)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const navigation = useNavigation()

    const handlePressItem = useCallback((index: number) => {
        setOptions(prevOptions =>
            prevOptions.map((item, i) => ({
                ...item,
                isSelected: i === index,
            }))
        );
        setSelectedIndex(index);
    }, []);

    return (
        <MainWrapper>
            <BottomTabScreenHeader title='Order History' onPressRightIcon={() => navigation.navigate(Routes.FilterScreen)} />
            <View style={styles.selectorConntainer} >
                <DynamicSelector
                    items={options}
                    onPressItem={handlePressItem}
                    selectedIndex={selectedIndex}
                    count={5}
                    btnStyles={styles.selectorStyles}
                />
            </View>

            <FlatList
                data={[0, 3, 4, 5, 6, 7, 8]}
                renderItem={({ item }) => <RideHistoryCard item={item} onPressCard={() => navigation.navigate(Routes.OrderDetails)} />}
                keyExtractor={(item) => item.id}
            />



        </MainWrapper>
    );
};

export default OrderHistory;
