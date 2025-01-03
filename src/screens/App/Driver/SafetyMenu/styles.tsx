import {StyleSheet} from 'react-native';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
  WP,
} from '../../../../shared/exporter';
const styles = StyleSheet.create({
  container: {
    backgroundColor: PFColors?.Gray.WhisperGray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(24),
    borderRadius: scale(12),
  },
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
  },
  contentView: {
    marginLeft: scale(16),
    flex: 1,
  },
  flatlistContainerStyle: {
    marginTop: scale(16),
    flex: 1,
  },
  greenCheck: {
    alignItems: 'center',
    marginVertical: WP('5'),
  },
  textStyle: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
    paddingHorizontal: WP('5'),
  },
  textStyles: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.EclipseBlack,
    paddingLeft: 10,
  },
  iconTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default styles;
