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
  noFound: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    textAlign: 'center',
    paddingTop: WP('50'),
  },
  menuOption: {
    padding: WP('4.5'),
    backgroundColor: PFColors.Gray.WhisperGray,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: WP('2'),
  },
  menuOptionText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    paddingLeft: WP('5'),
  },
  deletedDesc: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
    textAlign: 'center',
    paddingBottom: WP('5'),
  },
  cancelBtn: {
    width: '49%',
    marginRight: '1%',
    backgroundColor: PFColors.Gray.WhisperGray,
  },
  deleteBtn: {
    width: '49%',
  },
});
export default styles;
