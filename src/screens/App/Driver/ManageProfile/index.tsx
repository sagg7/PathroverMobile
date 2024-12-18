import { View, Text, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useState } from 'react';
import {
    AppButton,
    AppHeader,
    MainWrapper,
} from '../../../../components';
import styles from './styles';
import { ManageProfileArr, appIcons } from '../../../../shared/exporter';
import { useNavigation } from '@react-navigation/native';
import { svgIcon } from '../../../../assets/svg';
interface ClickableViewProps {
    title: string
    onPress?: () => void
    icon?: any
}

const ManageProfile = ({ navigation }) => {

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.containerView} key={item.id} onPress={() => navigation.navigate("EditProfile", { key: item?.id })}>
                <Text style={styles.textStyles}>{item?.title}</Text>
                {svgIcon.RightChevron}
            </TouchableOpacity>
        )
    }

    return (
        <MainWrapper>
            <AppHeader title='Manage Profile' />
            <View style={styles.showdow} />

            <FlatList
                data={ManageProfileArr}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.contentContainerStyle}
            />


        </MainWrapper>
    );
};

export default ManageProfile;
