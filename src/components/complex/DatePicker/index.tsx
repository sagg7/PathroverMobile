import React from 'react';
import { PFColors, isIOS } from '../../../shared/exporter';
import DateTimePicker from 'react-native-modal-datetime-picker';

interface DatePickerProps {
    onConfirm: (v) => void;
    onCancel?: () => void
    show: boolean
    onChange: (v: any) => void
}

const DatePicker: React.FC<DatePickerProps> = ({
    onConfirm,
    onCancel,
    show,
    onChange
}) => {

    return (
        <DateTimePicker
            isVisible={show}
            mode="date"
            date={
                new Date()
            }
            display={
                isIOS() ? "spinner" : "default"
            }
            maximumDate={
                new Date()
            }
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmTextIOS="Save"
            buttonTextColorIOS={PFColors.Blue.Dark}
            onChange={onChange}
        />
    );
};

export { DatePicker };

