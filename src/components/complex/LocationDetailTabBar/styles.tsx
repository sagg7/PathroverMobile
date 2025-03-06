import {Dimensions, StyleSheet} from 'react-native';
import {PFColors, PFFonts, PFFontSize, scale} from '../../../shared/exporter';

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  tabBarView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  tabBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: width / 4.5,
    paddingVertical: scale(8),
  },
  titleStyle:(isFocused: boolean)=> ({
    color: isFocused ? PFColors.Blue.Dark : PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: isFocused ? PFFonts.Foundation.SemiBold : PFFonts.Foundation.Medium,
  }),
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
  lineStyle: (isFocused: boolean) => ({
    width: '100%',
    borderRadius: 100,
    height: 3,
    backgroundColor: isFocused ? PFColors.Blue.Dark : PFColors.Blue.lightBlue,
    position: 'relative',
  }),
  bottomLineStyle: {
    width: '100%',
    borderRadius: 100,
    height: 3,
    backgroundColor: PFColors.Blue.lightBlue,
    marginBottom: scale(8),
  },
});

export default styles;
