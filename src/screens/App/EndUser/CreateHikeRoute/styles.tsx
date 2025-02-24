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
  centerMapStyles: {
    position: 'absolute',
    bottom: isIOS() ? WP('35') : WP('10'),
    left: 10,
  },
  redoBtn: {
    position: 'absolute',
    bottom: isIOS() ? WP('40') : WP('10'),
    right: 10,
  },
  undoBtn: {
    position: 'absolute',
    bottom: isIOS() ? WP('25') : WP('27'),
    right: 10,
  },
  pencilBtn: {
    position: 'absolute',
    bottom: isIOS() ? WP('55') : WP('44'),
    right: 10,
  },
  SaveButton: {
    position: 'absolute',
    bottom: isIOS() ? WP('70') : WP('60'),
    right: 10,
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
  freeFeatureText: {
    color: PFColors.Blue.Dark,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    paddingRight: 10,
  },
  centerSwitchWrapper: {
    position: 'absolute',
    left: '35%',
    transform: [{translateX: -25}],
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleContainer: {
    width: 50,
    height: 25,
    borderRadius: 25,
    padding: 5,
    // right: 20,
  },
  circleStyle: {
    width: 18,
    height: 18,
    borderRadius: 10,
  },
  toggleView: {
    flexDirection: 'row',
  },
  searchView: {
    flexDirection: 'row',
    position: 'absolute',
    top: isIOS() ? 120 : 60,
    zIndex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: WP('95'),
    alignSelf: 'center',
  },
  searchbar: {
    height: scale(44),
    width: WP('65'),
  },
  filterIcon: {
    height: scale(44),
    width: scale(44),
  },
  routeStopStyles: {
    height: 16,
    width: 16,
    borderRadius: 20 / 2,
    backgroundColor: PFColors.Red.RadiantRed,
  },
  maplayerStyles: {
    position: 'absolute',
    bottom: isIOS() ? WP('40') : WP('25'),
    left: 10,
  },
});
export default styles;
