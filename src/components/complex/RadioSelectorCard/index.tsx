import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WP, PFColors, PFFonts, PFFontSize } from '../../../shared/exporter';
import { svgIcon } from '../../../assets/svg';

interface RadioSelectorCard {
  item: any
  onPressCard: () => void
}

const RadioSelector: React.FC<RadioSelectorCard> = ({
  item,
  onPressCard
}) => {
  const { isSelected, title, isWeightSelected, isModelSelected } = item || false
  const selected = isWeightSelected || isSelected || isModelSelected || false
  return (
    <TouchableOpacity style={styles.mainContainer} onPress={onPressCard} activeOpacity={.7}>
      <Text style={styles.titleStyles}>{title}</Text>
      {selected ?
        svgIcon.RadioActive
        :
        svgIcon.RadioInactive
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PFColors.Gray.WhisperGray,
    padding: 20,
    borderRadius: 10,
    marginVertical: WP('3'),
  },
  titleStyles: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    width: WP("75"),
  }
});

export { RadioSelector };
