import {StyleSheet} from 'react-native';
import {PFColors, PFFonts, PFFontSize, WP} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  height: {
    height: 20,
  },
  buttonStyle: {
    width: WP('95'),
    alignSelf: 'center',
    marginTop: WP('60'),
  },
  selectorStyles: {
    marginRight: 10,
    borderColor: PFColors.Blue.Dark,
  },
  selectorConntainer: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  noRidesContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRidesText: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.Bold,
    paddingTop: WP('50'),
  },
});
export default styles;
