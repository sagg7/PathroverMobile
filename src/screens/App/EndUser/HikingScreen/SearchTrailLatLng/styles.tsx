import {StyleSheet} from 'react-native';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  WP,
} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PFColors.Standard.White,
  },
  map: {
    flex: 1,
  },
  inputStyles: {
    zIndex: 1,
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
});
export default styles;
