import {StyleSheet} from 'react-native';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
  WP,
} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  selectorMainView: {
    backgroundColor: PFColors.Gray.LightMist,
    height: scale(48),
    width: WP('80'),
    alignSelf: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },

  searchBox: {
    width: WP('90'),
    height: scale(44),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderRadius: scale(12),
    marginBottom: scale(16),
    alignSelf: 'center',
    backgroundColor: PFColors.Gray.LightMist,
  },
  input: {
    fontSize: scale(14),
    fontFamily: PFFonts.Foundation.Medium,
    color: PFColors.Standard.Black,
    width: scale(350),
  },
  inputContainerStyle: {
    width: scale(350),
  },
  suggestionContainer: {
    width: WP('90'),
    alignSelf: 'center',
  },
  btnStyles: {
    width: WP('90'),
    alignSelf: 'center',
    marginTop: WP('50'),
  },
  suggestionWrapper: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: 'gray',
    zIndex: 1,
  },
  titleText: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    paddingLeft: WP('5'),
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewOnMap: {
    color: PFColors.Blue.Dark,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    textDecorationLine: 'underline',
    paddingRight: WP('6'),
  },
});
export default styles;
