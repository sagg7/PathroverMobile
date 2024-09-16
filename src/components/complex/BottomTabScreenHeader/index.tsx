import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
    WP,
    PFColors,
    PFFontSize,
    PFFonts,
    isIOS,
    appIcons,
} from '../../../shared/exporter';

interface BottomTabScreenHeaderProps {
    title?: string;
    leftIcon?: boolean;
    rightIcon?: boolean;
    onPressRightIcon?: () => void;
}
const BottomTabScreenHeader: React.FC<BottomTabScreenHeaderProps> = ({
    title,
    onPressRightIcon,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPressRightIcon}>
                <Image source={appIcons.filterIcon} style={styles.rightIcon} />
            </TouchableOpacity>
            <Text style={styles.textStyle}>{title}</Text>
            <View style={styles.emptyView} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingVertical: WP('2'),
        paddingHorizontal: WP('4'),
        justifyContent: 'space-between',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        backgroundColor: isIOS() ? null : PFColors.Standard.White,
        height: WP('12')
    },
    textStyle: {
        color: PFColors.Standard.Black,
        fontSize: PFFontSize.FONT_SIZE_16,
        fontFamily: PFFonts.Foundation.SemiBold,
    },
    emptyView: {
        width: WP('6'),
        height: WP('6'),
    },
    rightIcon: {
        width: WP('5'),
        height: WP('5'),
        right: WP('4')
    }

});

export { BottomTabScreenHeader };
