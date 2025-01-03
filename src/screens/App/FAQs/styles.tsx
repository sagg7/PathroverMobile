import {StyleSheet} from 'react-native';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
  WP,
} from '../../../shared/exporter';

const styles = StyleSheet.create({
  bannerImage: {
    height: scale(201),
    width: scale(375),
    resizeMode: 'contain',
    borderBottomRightRadius: scale(24),
    borderBottomLeftRadius: scale(24),
  },
  bodyContainer: {
    padding: scale(16),
    backgroundColor: '#f5f5f5',
    marginHorizontal: WP('6'),
    borderWidth: 1,
    borderRadius: 10,
    borderColor: PFColors.Blue.Dark,
    flexDirection: 'row',
  },
  questionStyles: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.Regular,
    paddingVertical: scale(5),
  },
  answerStyles: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_12,
    fontFamily: PFFonts.Foundation.Regular,
    paddingVertical: scale(5),
    lineHeight: 22,
  },
});
export default styles;
