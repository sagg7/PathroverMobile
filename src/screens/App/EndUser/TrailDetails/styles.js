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
  gestureView: {
    flex: 1,
    backgroundColor: 'red',
  },
  inputStyles: {
    position: 'absolute',
    zIndex: 1111,
    top: isIOS() ? WP('12') : 1,
  },
  maplayerStyles: {
    position: 'absolute',
    bottom: isIOS() ? WP('10') : WP('40'),
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
    top: isIOS() ? WP('35') : WP('20'),
    width: WP('100'),
    justifyContent: 'space-around',
    marginLeft: 5,
  },
  actionBtnStyles: {
    height: scale(36),
    width: scale(119),
  },
  tagView: {
    flexDirection: 'row',
    backgroundColor: PFColors.Gray.CloudGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
    marginLeft: WP('5'),
  },
  centerMapStyles: {
    position: 'absolute',
    bottom: isIOS() ? WP('10') : WP('5'),
    right: 7,
    zIndex: 1,
  },
  hikeIconStyle: {
    position: 'absolute',
    bottom: isIOS() ? WP('25') : WP('20'),
    left: 10,
  },
  searcRoute: {
    position: 'absolute',
    bottom: isIOS() ? WP('25') : WP('20'),
    right: 10,
  },
  iconStyle: {
    marginRight: WP('2'),
  },
  stepsContainer: {
    position: 'absolute',
    marginTop: isIOS() ? 90 : 60,
    width: '100%',
    zIndex: 1,
    // backgroundColor: 'transparent',
  },
  instructionCard: {
    width: WP('97'),
    marginHorizontal: 5,
    backgroundColor: '#093E37',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
  },
  instructionText: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.White,
    paddingLeft: WP('5'),
    width: '80%',
  },
  distanceText: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.White,
    // paddingLeft: WP('5'),
  },
  directionIcon: {height: 20, width: 20},
  navigationInfoView: {
    backgroundColor: PFColors.Blue.SoftGlacier,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: PFColors.Blue.Dark,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleView: {
    alignSelf: 'flex-end',
    // marginVertical: 5,
  },
  headerText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  routeInfoText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
  },
});

export default styles;
