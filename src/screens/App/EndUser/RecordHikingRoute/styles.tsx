import {StyleSheet} from 'react-native';
import {
  isIOS,
  PFColors,
  PFFonts,
  PFFontSize,
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
    bottom: isIOS() ? WP('25') : WP('20'),
    left: 10,
  },

  videoCam: {
    position: 'absolute',
    bottom: isIOS() ? WP('18') : WP('15'),
    right: 10,
  },
  recordBtn: {
    position: 'absolute',
    bottom: 20,
    width: WP('90'),
    alignSelf: 'center',
  },
  reportCard: {
    width: '49%',
    alignItems: 'center',
    marginTop: WP('2'),
    backgroundColor: PFColors.Gray.WhisperGray,
    borderRadius: 16,
    paddingVertical: WP('5'),
  },
  reportIcon: {
    width: WP('13'),
    height: WP('13'),
    marginBottom: 5,
  },
  reportCardTitle: {
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  confirmReportContainer: {
    alignSelf: 'center',
    paddingTop: WP('3'),
    alignItems: 'center',
  },
  markerReport: {
    width: WP('12'),
    height: WP('12'),
    borderRadius: WP('6'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PFColors.Standard.White,
  },
  report: {
    width: '93%',
    height: '93%',
    resizeMode: 'contain',
  },
  emergencyBtn: {
    position: 'absolute',
    width: WP('40'),
    right: WP('3'),
    backgroundColor: PFColors.Red.RadiantRed,
    height: 40,
    alignItems: 'center',
    bottom: WP('100'),
  },
  recenterBtn: {
    position: 'absolute',
    width: WP('38'),
    left: WP('3'),
    backgroundColor: '#A0AFC3',
    height: 40,
    alignItems: 'center',
    bottom: WP('100'),
  },
  reportAction: {
    position: 'absolute',
    width: WP('30'),
    right: WP('3'),
    height: 40,
    alignItems: 'center',
    bottom: WP('175'),
  },
});
export default styles;
