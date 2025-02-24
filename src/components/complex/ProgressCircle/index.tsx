import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

const ProgressCircle = ({
  imageSource,
  progress,
  size,
  color,
}: any) => {
  const radius = (size - (size / 15)) / 2.1;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={[styles.container, {width: size, height: size}]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2.02}
          cy={size / 2}
          r={radius}
          strokeWidth={size / 15}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Image
        source={imageSource}
        style={[
          styles.image,
          {width: radius * 2, height: radius * 2, borderRadius: radius, marginLeft:10},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  image: {
    position: 'absolute',
  },
});

export default ProgressCircle;
