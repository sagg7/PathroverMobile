import { StyleSheet, Text, View, TouchableOpacity, TextStyle } from 'react-native';
import React from 'react';
import { HP, PFColors, PFFontSize, PFFonts, WP } from '../../../shared/exporter';


interface DynamicSelector {
  items: any;
  onPressItem?: (v: any) => void,
  selectedIndex?: number
  count?: number,
  btnStyles: any
}

const DynamicSelector = ({
  items, onPressItem, selectedIndex,
  count,
  btnStyles
}: DynamicSelector) => {

  return (
    <View style={styles.selectorView}>
      {items?.map((item, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.7}
          disabled={item.isSelected}
          style={[button(index === selectedIndex), btnStyles]}
          onPress={() => onPressItem(index)}>
          <Text style={buttonText(index === selectedIndex)}>{item.title}</Text>
          {index === selectedIndex && count &&
            <Text style={styles.countStyles}>5</Text>
          }
        </TouchableOpacity>
      ))}
    </View>
  );
};
const buttonText = (isActive: boolean): TextStyle => ({
  fontFamily: PFFonts.Foundation.Medium,
  fontSize: PFFontSize.FONT_SIZE_14,
  color: isActive ? PFColors.Standard.White : PFColors.Blue.Dark,
});
const button = (isSelected: boolean): TextStyle => ({
  backgroundColor: isSelected ? PFColors.Blue.Dark : PFColors.Blue.SoftGlacier,
  height: WP('9'),
  paddingHorizontal: 8,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 25,
  borderWidth: 1,
  borderColor: isSelected ? PFColors.Blue.Dark : PFColors.Gray.AshGray,
  marginRight: 15,
  flexDirection: "row",
  // marginHorizontal: 5

})

const styles = StyleSheet.create({
  selectorView: {
    flexDirection: 'row',
    height: HP('4'),
    alignItems: 'center',
    borderColor: "pink",
    borderRadius: 25,
    marginVertical: WP('2'),
    marginHorizontal: WP('5')
  },
  countStyles: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Blue.Dark,
    backgroundColor: "#fff",
    height: 22,
    width: 22,
    textAlign: "center",
    borderRadius: 30,
    marginLeft: 5
  }
});
export { DynamicSelector };
