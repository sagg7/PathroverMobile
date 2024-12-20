import {StyleSheet} from 'react-native';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  SafetyArr,
  scale,
  verticalScale,
  WP,
} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  containerView: {
    backgroundColor: PFColors.Gray.WhisperGray,
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: WP('5'),
    paddingVertical: 20,
    paddingHorizontal: WP('5'),
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 7,
    borderWidth: 1,
    borderColor: PFColors.Gray.borderGray,
  },

  flatlistContainerStyle: {
    marginTop: scale(16),
    flex: 1,
  },
  textStyle: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
    paddingHorizontal: WP('5'),
    paddingVertical: verticalScale(15),
  },
  textStyles: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.EclipseBlack,
  },
  lightFont: {
    fontFamily: PFFonts.Foundation.Regular,
  },
});
export default styles;
