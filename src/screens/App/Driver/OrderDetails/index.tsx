import { View, Text, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { AppHeader, MainWrapper, OrderItemCard } from '../../../../components';
import styles from './styles';
import { appIcons } from '../../../../shared/exporter';

const OrderDetails = () => {
    const [showDetailCard, setshowDetailCard] = useState(true)

    const ItemInfo = ({ title, value, extraStyle }) => {
        return (
            <View style={styles.itemInfoContainer}>
                <Text style={[styles.itemInfoText, extraStyle]}>{title}</Text>
                <Text style={[styles.itemInfoText, extraStyle]}>{value}</Text>
            </View>
        );
    };

    return (
        <MainWrapper>
            <AppHeader title='Order Details' />
            <ScrollView>

                <View style={styles.orderStatusInfo}>
                    <Text style={styles.orderStatus}>Order Delivered!</Text>
                    <Text style={styles.orderStatusInfoText}>Please ensure that the safety sticker is untouched.</Text>
                </View>

                <View style={styles.orderDeliveryInfoCard}>
                    <Image source={appIcons.semitruck} style={styles.truckstyles} resizeMode='contain' />
                    <Text style={styles.orderDeliveryTime}>Delivered on 16.07.2022, 20:39</Text>
                </View>

                <View style={styles.orderDeliveryTimeCard}>
                    <Text style={styles.itemOrderText}>Items in order</Text>
                    <Text style={styles.orderDeliveryTime}>1 Item(s)</Text>
                </View>

                <OrderItemCard onPressArrow={() => setshowDetailCard(!showDetailCard)} isShow={showDetailCard} />

                {showDetailCard &&
                    <View style={styles.accordianContainer}>
                        <ItemInfo title="SubTotal" value="$18.45" />
                        <ItemInfo title="Delivery Fee" value="Free" />
                        <ItemInfo title="Order Total" value="$18.34" extraStyle={styles.fontSize} />
                    </View>
                }

                <View style={styles.divider} />

                <View style={styles.infoCard}>
                    <ItemInfo title="Order ID" value="M2R-VYZ" extraStyle={styles.boldText} />
                    <ItemInfo title="Order Time" value="16.07.2022, 19:43" extraStyle={styles.fontSize} />
                    <ItemInfo title="Payment Time" value="16.07.2022, 19:43" extraStyle={[styles.fontSize, styles.grayShade]} />
                    <ItemInfo title="Ship Time" value="16.07.2022, 19:43" extraStyle={[styles.fontSize, styles.grayShade]} />
                    <ItemInfo title="Completed Time" value="16.07.2022, 19:43" extraStyle={[styles.fontSize, styles.grayShade]} />
                </View>

            </ScrollView>
        </MainWrapper>
    );
};

export default OrderDetails;
