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
  inputStyles: {
    position: 'absolute',
    zIndex: 1111,
    top: isIOS() ? WP('12') : 1,
  },
  maplayerStyles: {
    position: 'absolute',
    bottom: isIOS() ? WP('10') : WP('5'),
    left: 10,
  },
  hikeIconStyle: {
    position: 'absolute',
    bottom: isIOS() ? WP('25') : WP('20'),
    left: 10,
  },
  recenter: {
    position: 'absolute',
    bottom: isIOS() ? WP('32') : WP('27'),
    left: 10,
  },
  undoRedoContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: WP('20'),
    right: 20,
    marginLeft: 5,
    alignItems: 'center',
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
  headerView: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: WP('94'),
    alignSelf: 'center',
    marginVertical: WP('3'),
  },
  titleStyles: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_16,
  },
  userIcon: {
    height: 35,
    width: 35,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  toggleView: {
    flexDirection: 'row',
    // width: WP('25'),
    justifyContent: 'space-between',
  },
  searchbar: {
    height: scale(44),
    width: WP('65'),
  },
  actionBtnView: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1,
    top: WP('20'),
    width: WP('100'),
    justifyContent: 'space-evenly',
  },
  actionBtnStyles: {
    height: scale(36),
    width: scale(119),
  },
});
export default styles;
