import {Dimensions, StyleSheet} from 'react-native';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  scale,
  WP,
} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  headerText: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
  buttonStyle: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(6),
    borderWidth: 1,
    borderColor: PFColors.Gray.DarkGray,
    borderRadius: 100,
  },
  buttonText: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_14,
  },
  imageStyle: {
    height: WP('30'),
    width: WP('47'),
    borderRadius: 15,
    backgroundColor: PFColors.Gray.LightMist,
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
    marginHorizontal: WP('2'),
    paddingBottom: 10,
  },
  contentContainerStyle: {
    paddingBottom: scale(50),
  },
  fullImageStyle: {
    alignSelf: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalContainer: {
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFound: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_16,
    textAlign: 'center',
    marginVertical: 40,
  },
});

export default styles;
