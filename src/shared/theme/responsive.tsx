import { Dimensions, PixelRatio } from 'react-native';
import { number } from 'yup';

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


const [shortDimension, longDimension] = scrWidth < scrHeight ? [scrWidth, scrHeight] : [scrHeight, scrWidth];

//Default guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 680;

export const scale = (size : number) => shortDimension / guidelineBaseWidth * size;
export const verticalScale = (size : number) => longDimension / guidelineBaseHeight * size;
export const moderateScale = (size : number, factor = 0.5) => size + (scale(size) - size) * factor;
export const moderateVerticalScale = (size : number, factor = 0.5) => size + (verticalScale(size) - size) * factor;

export {
  scrWidth,
  scrHeight,
  widthPercentageToDP as WP,
  heightPercentageToDP as HP,
};
