import {Dimensions, StyleSheet} from 'react-native';
import {PFColors, PFFonts, PFFontSize, scale} from '../../../shared/exporter';

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBarView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  tabBtn: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: width / 3,
    paddingVertical: scale(8),
  },
  titleStyle: {
    color: PFColors.Blue.Dark,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  lineStyle: {
    width: '100%',
    borderRadius: 100,
    height: 3,
    backgroundColor: PFColors.Blue.Dark,
  },
});

export default styles;
