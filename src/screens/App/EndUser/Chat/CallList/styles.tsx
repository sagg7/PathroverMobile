import {StyleSheet} from 'react-native';
import {
  HP,
  PFColors,
  PFFonts,
  PFFontSize,
  WP,
} from '../../../../../shared/exporter';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: WP('3'),
    paddingHorizontal: WP('2'),
  },
  callContainer: {
    flex: 1,
    marginTop: WP('2'),
    marginBottom: WP('2'),
  },
  userCallLog: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: WP('4'),
    paddingHorizontal: WP('4'),
    justifyContent: 'space-between',
  },
  userDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callerImage: {
    width: WP('10'),
    height: WP('10'),
    marginRight: WP('4'),
    borderRadius: WP('5'),
  },
  callerName: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
  callerTimer: {
    marginRight: WP('2'),
    marginTop: WP('1'),
    flexDirection: 'row',
  },
  callerTextStyle: {
    marginRight: WP('2'),
    fontSize: PFFontSize.FONT_SIZE_12,
    color: PFColors.Standard.GrayBlack,
    fontFamily: PFFonts.Foundation.Regular,
  },
  emptyText: {
    alignSelf: 'center',
    marginTop: HP('20'),
    color: PFColors.Standard.GrayBlack,
    fontSize: PFFontSize.FONT_SIZE_16,
    fontFamily: PFFonts.Foundation.Regular,
  },
  noImageCaller: {
    width: WP('10'),
    height: WP('10'),
    marginRight: WP('4'),
    alignItems: 'center',
    borderRadius: WP('5'),
    justifyContent: 'center',
    backgroundColor: PFColors.Standard.Disable,
  },
  noImageTextStyle: {
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_16,
  },
});

export default styles;
