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
    flexDirection: 'row',
    justifyContent: 'center',
    width: width / 3,
    paddingVertical: scale(8),
  },
  titleStyle: {
    color: PFColors.Blue.Dark,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  countViewStyle: {
    backgroundColor: PFColors.Blue.Dark,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 100,
    marginLeft: 4,
  },
  countStyle: {
    color: PFColors.Standard.White,
    fontSize: PFFontSize.FONT_SIZE_10,
    fontFamily: PFFonts.Foundation.Medium,
  },
  lineStyle: {
    width: '100%',
    borderRadius: 100,
    height: 3,
    backgroundColor: PFColors.Blue.Dark,
  },
});

export default styles;
