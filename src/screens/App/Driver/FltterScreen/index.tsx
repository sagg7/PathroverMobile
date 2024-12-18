import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import {
    AppButton,
    AppHeader,
    FilterLocationSheet,
    MainWrapper,
} from '../../../../components';
import styles from './styles';
import { appIcons } from '../../../../shared/exporter';
import { DatePicker, DateRangePicker } from '../../../../components/complex/DatePicker';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { svgIcon } from '../../../../assets/svg';
interface ClickableViewProps {
    title: string
    onPress?: () => void
    icon?: any
}

const FilterScreen = () => {
    const [showCalendar, setShowCalendar] = useState(false)
    const [showLocationSheet, setShowLocationSheet] = useState(false)
    const dispatch = useDispatch()
    const [show, setShow] = useState(false);
    const [date, setDate] = useState("");

    const navigation = useNavigation()

    const handleDob = (i) => {
        setBirthDate(i)
    }

    const ClickableView = ({ title, icon, onPress }: ClickableViewProps) => {
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={styles.containerView}>
                    <View style={styles.row}>
                        {icon}
                        <Text style={styles.textStyles}> {title}</Text>
                    </View>
                    <Image source={appIcons.chevron} style={styles.chevronStyles} resizeMode='contain' />
                </View>
            </TouchableOpacity>
        )
    }

    const showDatePicker = () => {
        setShow(true);
    };
    const onConfirm = dates => {
        const dateTimeString = dates;
        setDate(dateTimeString?.toISOString().split('T')[0])
        setShow(false);
    };
    const onChange = dates => {
    };

    return (
        <MainWrapper>
            <AppHeader title='Filter' />
            <View style={styles.height} />

            <ClickableView title={"Date"} icon={svgIcon.Calendar} onPress={() => setShow(true)} />
            <View style={styles.height} />
            <ClickableView title={"Location"} icon={svgIcon.BlueMarker} onPress={() => setShowLocationSheet(true)} />
            <FilterLocationSheet modalVisible={showLocationSheet} onPressCancel={() => setShowLocationSheet(false)} />
            <DatePicker show={show} onCancel={() => setShow(false)} onConfirm={onConfirm} onChange={onChange} />

            <AppButton title="Done" buttonStyle={styles.buttonStyle} />
            <View style={styles.height} />
        </MainWrapper>
    );
};

export default FilterScreen;
