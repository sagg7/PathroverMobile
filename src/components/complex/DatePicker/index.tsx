import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { svgIcon } from '../../../assets/svg';
import { AppButton } from '../AppButton';
import {
    showAlert,
    CURRENT_DATE,
    DAY_NAME_SHORT,
    CALENDAR_THEME,
} from '../../../shared/utils/constant';
import { PFColors, PFFontSize, PFFonts, WP } from '../../../shared/exporter';
interface DateRangePickerProps {
    modalVisible: boolean;
    handleClick: (dates: { startDate: string; endDate: string }) => void;
    setModalVisible: () => void;
    onPressDone: (v) => void;
    setDob: () => void
    onPressCancel: () => void
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    modalVisible,
    setModalVisible,
    onPressDone,
    onPressCancel,
    setDob
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [markedDates, setMarkedDates] = useState({});
    LocaleConfig.locales[LocaleConfig.defaultLocale].dayNamesShort =
        DAY_NAME_SHORT;

    const handleDayPress = useCallback(
        (day: any) => {
            const dateString = day.dateString;
            setDob(dateString)

            setMarkedDates({
                [dateString]: {
                    selected: true,
                    customStyles: {
                        container: styles.selectedDateBox,
                        text: {
                            color: PFColors.Standard.White,
                        },
                    },
                },
            });
        },
        [setMarkedDates]
    );


    const renderArrow = useCallback(
        (direction: 'left' | 'right') => (
            <View
                style={
                    direction === 'left'
                        ? styles.leftArrowContainer
                        : styles.rightArrowContainer
                }>
                {direction === 'left' ? svgIcon.LeftChevron : svgIcon.RightChevron}
            </View>
        ),
        [],
    );
    const handleMonthChange = (direction) => {
        const newDate = new Date(currentDate);

        if (direction === 'left') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }

        setCurrentDate(newDate);
    };


    const renderHeader = (date) => {
        const month = date?.toString('MMMM yyyy');
        return (
            <View style={styles.calendarHeader}>
                <Text style={styles.monthnameHeader}>{month}</Text>
                <View style={{ flexDirection: "row", width: WP('10'), justifyContent: "space-between" }}>
                    <TouchableOpacity onPress={() => handleMonthChange('left')}>
                        {renderArrow('left')}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleMonthChange('right')}>
                        {renderArrow('right')}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    const formatDate = (dob) => {
        if (dob instanceof Date && !isNaN(dob)) {
            const date = dob.toISOString().split('T')[0]
            return date;
        }
        return '';
    };



    return (
        <Modal
            useNativeDriver
            isVisible={modalVisible}
            onBackdropPress={setModalVisible}
            style={styles.modalContainer}>
            <View style={styles.sheetHeader}>
                <Text style={styles.selectOptionText}>Select Date</Text>
                <TouchableOpacity onPress={onPressCancel}>
                    {svgIcon.CrossCirlce}
                </TouchableOpacity>
            </View>
            <CalendarList
                horizontal
                pagingEnabled
                theme={CALENDAR_THEME}
                current={formatDate(currentDate)}
                maxDate={CURRENT_DATE}
                showScrollIndicator={true}
                onDayPress={handleDayPress}
                renderHeader={renderHeader}
                markedDates={markedDates}
                markingType='custom'
            />
            <View style={styles.buttonsRow}>
                <AppButton
                    title="Done"
                    isEmpty={false}
                    textStyle={styles.yesTextStyle}
                    handleClick={() => onPressDone()}
                />
            </View>
        </Modal>
    );
};

export { DateRangePicker };

const styles = StyleSheet.create({
    modalContainer: {
        bottom: 0,
        margin: 0,
        position: 'absolute',
        borderRadius: WP('3'),
        paddingVertical: WP('5'),
        backgroundColor: PFColors.Standard.White,
    },
    buttonsRow: {
        // marginBottom: WP('3'),
        paddingHorizontal: WP('5'),
    },

    yesTextStyle: {
        width: '100%',
        textAlign: 'center',
    },
    leftArrowContainer: {
        left: 0,
    },
    rightArrowContainer: {
        right: 0,
    },
    monthnameHeader: {
        fontFamily: PFFonts.Foundation.Regular,
        color: PFColors.Gray.DarkGray,
        fontSize: PFFontSize.FONT_SIZE_16
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: WP('7')
    },
    selectOptionText: {
        color: PFColors.Standard.Black,
        fontSize: PFFontSize.FONT_SIZE_16,
        fontFamily: PFFonts.Foundation.SemiBold,
    },
    selectedDateBox: {
        backgroundColor: PFColors.Blue.Dark,
        borderRadius: 10,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: WP('85'),
        height: 60,
        backgroundColor: "#fff"
    }
});