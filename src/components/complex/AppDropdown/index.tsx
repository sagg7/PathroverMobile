import React, {useState} from 'react';
import {StyleSheet, Text, View, ViewStyle, TextStyle} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {PFColors, PFFonts, PFFontSize, WP} from '../../../shared/exporter';
import DownChaveron from '../../../assets/svg/DownChaveron.svg';

interface AppDropdownProps {
  label?: string;
  data: {label: string; value: string | number}[];
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  dropdownStyle?: ViewStyle;
  selectedTextStyle?: TextStyle;
  placeholderStyle?: TextStyle;
}

const AppDropdown: React.FC<AppDropdownProps> = ({
  label,
  data,
  placeholder = 'Select',
  value,
  onChange,
  style,
  labelStyle,
  dropdownStyle,
  selectedTextStyle,
  placeholderStyle,
}) => {
  const [selectedValue, setSelectedValue] = useState(value || null);

  const handleChange = (item: {label: string; value: string | number}) => {
    setSelectedValue(item.value);
    onChange?.(item.value);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={selectedValue}
        onChange={handleChange}
        itemTextStyle={{color: '#000'}}
        style={[styles.dropdown, dropdownStyle]}
        containerStyle={styles.dropdownContainer}
        selectedTextStyle={[styles.selectedText, selectedTextStyle]}
        placeholderStyle={[styles.placeholderText, placeholderStyle]}
        renderRightIcon={() => <DownChaveron fill={PFColors.Standard.Black} />}
      />
    </View>
  );
};

export default AppDropdown;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: PFFontSize.FONT_SIZE_10,
    fontFamily: PFFonts.Foundation.Regular,
    marginBottom: 6,
    color: PFColors.Standard.Black,
  },
  dropdown: {
    height: WP('12'),
    borderRadius: WP('6'),
    paddingHorizontal: 16,
    backgroundColor: PFColors.Gray.WhisperGray,
    justifyContent: 'center',
  },
  dropdownContainer: {
    borderRadius: 10,
  },
  selectedText: {
    fontSize: 14,
    fontFamily: PFFonts.Foundation.Medium,
    color: PFColors.Standard.Black,
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: PFFonts.Foundation.Medium,
    color: PFColors.Standard.Black,
  },
});
