import {StyleSheet} from 'react-native';
import {PFColors, PFFonts, PFFontSize, WP} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  listConatainer: {
    backgroundColor: PFColors.Gray.WhisperGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: WP('92'),
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 5,
  },
  setingOptionIcon: {
    height: WP('5'),
    width: WP('5'),
  },
  listOptionText: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingLeft: WP('3'),
  },
  iconContainer: {
    borderRadius: 9,
    height: WP('7.5'),
    width: WP('7.5'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingVertical: WP('5'),
    paddingHorizontal: WP('5'),
  },
  btnStyles: {
    position: 'absolute',
    bottom: 20,
    width: WP('90'),
    alignSelf: 'center',
  },
});
export default styles;
