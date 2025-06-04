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

  imageStyle: {
    height: WP('50'),
    width: WP('94'),
    borderRadius: 14.75,
    alignSelf: 'center',
  },

  noFound: {
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_16,
    textAlign: 'center',
    marginVertical: 40,
  },
  video: {
    height: WP('55'),
    width: WP('94'),
    backgroundColor: PFColors.Gray.FrostedGray,
    alignSelf: 'center',
  },
});

export default styles;
