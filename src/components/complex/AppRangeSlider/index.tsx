import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RangeSlider from 'rn-range-slider';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';

interface RangeSliderProps {
  min?: number;
  max?: number;
  onValueChange?: (min: number, max: number) => void;
}

const AppRangeSlider: React.FC<RangeSliderProps> = ({
  min = 0,
  max = 30,
  onValueChange,
}) => {
  const [low, setLow] = useState(min);
  const [high, setHigh] = useState(max);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filters by distance (Trails & routes)</Text>
      <RangeSlider
        min={min}
        max={max}
        step={1}
        floatingLabel
        minRange={1}
        onValueChanged={(low, high) => {
          setLow(low);
          setHigh(high);
          onValueChange?.(low, high);
        }}
        renderThumb={() => <View style={styles.thumb} />}
        renderRail={() => <View style={styles.rail} />}
        renderRailSelected={() => <View style={styles.railSelected} />}
        style={styles.slider}
      />
      <Text style={styles.rangeText}>
        Range: {low} km - {high} km+
      </Text>
    </View>
  );
};

export default AppRangeSlider;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Medium,
    color: PFColors.Standard.Black,
    marginBottom: 8,
  },
  slider: {
    marginVertical: 8,
  },
  rangeText: {
    fontSize: PFFontSize.FONT_SIZE_10,
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
  },
  rail: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: PFColors.Gray.LightGray,
  },
  railSelected: {
    height: 6,
    borderRadius: 3,
    backgroundColor: PFColors.Blue.Dark,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: PFColors.Blue.Dark,
    borderWidth: 2,
    borderColor: PFColors.Gray.CloudWhite,
  },
});