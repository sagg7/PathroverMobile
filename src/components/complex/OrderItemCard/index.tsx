import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import {
    PFColors,
    PFFontSize,
    PFFonts,
    WP,
    appIcons,
    isIOS,
} from '../../../shared/exporter';
import { svgIcon } from '../../../assets/svg';

interface OrderItemCardProps {
    item?: any;
    onPressArrow?: () => void
    isShow?: boolean
}

const OrderItemCard = ({ item, isShow, onPressArrow }: OrderItemCardProps) => {
    return <TouchableOpacity style={styles.mainContainer} activeOpacity={.8}>
        <View style={styles.itemContainer}>
            <View style={{ flexDirection: "row" }}>
                <Image source={appIcons.orderItem} style={styles.orderIcon} resizeMode='contain' />
                <View style={styles.innerContainner}>
                    <Text style={styles.itemName}>Cargo Box</Text>
                    <Text style={styles.itemquantity}>49pcs </Text>
                </View>
            </View>
            <Text style={styles.itemqPrice}>$18.45 </Text>

        </View>
        <View style={styles.itemContainer}>
            <Text style={styles.itemqPrice}>$18.45 </Text>
            <TouchableOpacity style={styles.upChevron(isShow)} onPress={onPressArrow}>
                {svgIcon.RightChevron}
            </TouchableOpacity>

        </View>
    </TouchableOpacity>;
};

export { OrderItemCard };

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: PFColors.Gray.WhisperGray,
        padding: WP('6')
    },
    orderIcon: {
        height: WP('11'),
        width: WP('11')
    },
    itemContainer: {
        flexDirection: "row",
        paddingVertical: 10,
        justifyContent: "space-between"
    },
    itemName: {
        fontFamily: PFFonts.Foundation.Medium,
        fontSize: PFFontSize.FONT_SIZE_14,
        color: PFColors.Blue.Dark,
        paddingBottom: 3
    },
    itemquantity: {
        fontFamily: PFFonts.Foundation.Light,
        fontSize: PFFontSize.FONT_SIZE_12,
        color: PFColors.Standard.Black,
    },
    itemqPrice: {
        fontFamily: PFFonts.Foundation.Light,
        fontSize: PFFontSize.FONT_SIZE_12,
        color: PFColors.Standard.Black,
        alignSelf: "flex-end"
    },
    innerContainner: {
        marginLeft: WP('2')
    },
    upChevron: show => ({
        transform: [{ rotate: show ? '-90deg' : '90deg' }],
    }),
});
