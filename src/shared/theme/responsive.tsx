import {Dimensions, PixelRatio} from 'react-native';

const scrWidth = Dimensions.get('window').width;
const scrHeight = Dimensions.get('window').height;

const widthPercentageToDP = (widthPercent: string) => {
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((scrWidth * elemWidth) / 100);
};

const heightPercentageToDP = (heightPercent: string) => {
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((scrHeight * elemHeight) / 100);
};

export {
  scrWidth,
  scrHeight,
  widthPercentageToDP as WP,
  heightPercentageToDP as HP,
};
