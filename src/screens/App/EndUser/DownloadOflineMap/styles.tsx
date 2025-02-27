import {StyleSheet} from 'react-native';
import {
  isIOS,
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
  WP,
} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PFColors.Standard.White,
  },
  map: {
    flex: 1,
  },

  maplayerStyles: {
    position: 'absolute',
    bottom: isIOS() ? WP('20') : WP('15'),
    left: 10,
  },

  button: {
    marginHorizontal: 5,
  },
  createRouteBtn: {
    position: 'absolute',
    bottom: 20,
    width: WP('90'),
    alignSelf: 'center',
  },

  titleStyles: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
  },

  searchbar: {
    height: scale(44),
    width: WP('65'),
  },
  downloadView: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: PFColors.Standard.White,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: PFColors.Blue.Dark,
  },
});
export default styles;
