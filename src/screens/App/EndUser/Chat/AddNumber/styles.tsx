import {Dimensions, StyleSheet} from 'react-native';
import {PFColors, PFFonts, PFFontSize} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  btnContainer: isOpen => ({
    marginBottom: isOpen ? 300 : 40,
  }),
  divider: isOpen => ({
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  }),
  contentContainerStyle: {
    flex: 1,
    // flexGrow: 1,
    height: Dimensions.get('screen').height,
  },
  container: {
    padding: 16,
    flex: 1,
    marginTop: 22,
  },
  titleStyle: {
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    marginVertical: 4,
  },
  subTitleStyle: {
    fontSize: PFFontSize.FONT_SIZE_14,
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
  },
});

export default styles;
