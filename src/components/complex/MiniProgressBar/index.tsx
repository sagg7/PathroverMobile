import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { PFColors, PFFontSize, PFFonts, WP } from '../../../shared/exporter';

interface MiniProgressBarProps {
  currentStep: number;
  onPressSkip?: () => void,
  desciption?: string
  heading?: string
}

function MiniProgressBar({
  currentStep,
  onPressSkip,
  desciption,
  heading
}: MiniProgressBarProps) {
  const maxSteps = 7;
  const progressValue = (currentStep / maxSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.innnerContainer}>
        <CircularProgress
          value={progressValue}
          showProgressValue={false}
          radius={20}
          duration={1000}
          maxValue={100}
          inActiveStrokeColor={PFColors.Blue.DisableBlue}
          activeStrokeColor={PFColors.Blue.Dark}
          activeStrokeWidth={8}
          inActiveStrokeWidth={8}
          title={`${currentStep}/${maxSteps}`}
          titleStyle={styles.titleStyles}
        />
        {onPressSkip &&
          <Text style={styles.skip} onPress={onPressSkip}> Skip</Text>
        }
      </View>
      {heading &&
        <Text style={styles.heading}>{heading}</Text>}
      {desciption &&
        <Text style={styles.description}>{desciption}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingVertical: WP('5')
  },
  titleStyles: {
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_10
  },
  heading: {
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_20,
    paddingVertical: WP("3"),
    textAlign: "center"
  },
  skip: {
    fontFamily: PFFonts.Foundation.Medium,
    color: PFColors.Orange.Dark,
    fontSize: PFFontSize.FONT_SIZE_16,
    right: WP('5')
  },
  innnerContainer: {
    flexDirection: "row",
    width: WP('53'),
    alignSelf: "flex-end",
    justifyContent: "space-between"
  },
  description: {
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Gray.DarkGray,
    fontSize: PFFontSize.FONT_SIZE_14,
    width: WP('90'),
    textAlign: "center"
  }
});

export { MiniProgressBar };
