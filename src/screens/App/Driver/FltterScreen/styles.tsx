import {StyleSheet} from 'react-native';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  containerView: {
    backgroundColor: PFColors.Gray.WhisperGray,
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: WP('5'),
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  height: {
    height: 20,
  },
  buttonStyle: {
    width: WP('95'),
    alignSelf: 'center',
    position: 'absolute',
    bottom: WP('20'),
  },
  textStyles: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.EclipseBlack,
    paddingLeft: 10,
  },
  chevronStyles: {
    height: 15,
    width: 15,
    right: 10,
  },
});
export default styles;
