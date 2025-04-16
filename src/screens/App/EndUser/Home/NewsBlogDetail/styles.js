import {StyleSheet} from 'react-native';
import {
  PFFonts,
  PFColors,
  scrWidth,
  scrHeight,
  PFFontSize,
} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  imageStyle: {
    width: scrWidth,
    height: scrHeight / 2,
    backgroundColor: PFColors.Gray.AshGray,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  titleTextStyle: {
    marginTop: 16,
    lineHeight: 24,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.LightBlack,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  timeTextStyle: {
    marginTop: 4,
    lineHeight: 18,
    color: PFColors.Gray.DarkGray,
    fontSize: PFFontSize.FONT_SIZE_10,
    fontFamily: PFFonts.Foundation.Regular,
  },
  htmlBaseStyle: {
    marginTop: 10,
    color: PFColors.Gray.DarkGray,
    fontSize: PFFontSize.FONT_SIZE_10,
    fontFamily: PFFonts.Foundation.Regular,
  },
});

export default styles;
