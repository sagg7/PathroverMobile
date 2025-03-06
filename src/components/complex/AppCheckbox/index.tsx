import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {svgIcon} from '../../../assets/svg';
import {PFColors, PFFonts} from '../../../shared/exporter';

interface AppCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

const AppCheckbox: React.FC<AppCheckboxProps> = ({
  checked = false,
  onChange,
  label,
  containerStyle,
  labelStyle,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handlePress = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.container, containerStyle]}
      onPress={handlePress}>
      {isChecked ? svgIcon.CheckboxFill : svgIcon.CheckboxBlank}
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
    </TouchableOpacity>
  );
};

export default AppCheckbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
  },
});
