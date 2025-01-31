import {StyleSheet} from 'react-native';
import {isIOS, PFColors, PFFonts, scale, WP} from '../../../../shared/exporter';

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
    width: scale(300),
    paddingLeft: isIOS() ? 10 : 3,
  },
  inputContainerStyle: {
    width: WP('82'),
  },
  suggestionContainer: {
    width: WP('90'),
    alignSelf: 'center',
  },
  btnStyles: {
    marginVertical: WP('10'),
    width: WP('50'),
    alignSelf: 'center',
  },

  addressCard: {
    borderRadius: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    margin: 5,
  },
  infoView: {
    marginLeft: scale(8),
    width: WP('80'),
  },
  addressName: {
    fontSize: scale(12),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
  },
  addressText: {
    fontSize: scale(10),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
  },
  mapIcon: {height: 30, width: 30},
});
export default styles;
