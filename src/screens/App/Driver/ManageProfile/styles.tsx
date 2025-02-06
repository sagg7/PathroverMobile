import {StyleSheet} from 'react-native';
import {PFColors, PFFontSize, PFFonts, WP} from '../../../../shared/exporter';

const styles = StyleSheet.create({
  containerView: {
    backgroundColor: PFColors.Gray.WhisperGray,
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: WP('5'),
    paddingVertical: 20,
    paddingHorizontal: WP('5'),
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 7,
  },
  row: {
    flexDirection: 'row',
  },
  height: {
    height: 20,
  },
  buttonStyle: {
    width: WP('95'),
    alignSelf: 'center',
    marginTop: WP('120'),
  },
  textStyles: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.EclipseBlack,
    // paddingLeft: 10
  },
  chevronStyles: {
    height: 15,
    width: 15,
    right: 10,
  },
  showdow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    height: 1,
    backgroundColor: PFColors.Standard.White,
  },
  contentContainerStyle: {},
  profilePicContainer: {
    height: WP('30'),
    width: WP('30'),
    borderRadius: WP('30') / 2,
    borderWidth: 1,
    borderColor: PFColors.Blue.Dark,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: WP('5'),
  },
  profilePicture: {
    height: WP('30'),
    width: WP('30'),
    borderRadius: WP('30') / 2,
    alignSelf: 'center',
    marginTop: WP('5'),
    // borderWidth: 1,
  },
  profilePictureImageStyles: {
    height: WP('30'),
    width: WP('30'),
    borderRadius: WP('30') / 2,
    alignSelf: 'center',
    marginTop: WP('5'),
    borderWidth: 1,
    borderColor: PFColors.Orange.Dark,
  },
  placeholder: {
    height: WP('20'),
    width: WP('20'),
  },
  miniCam: {
    position: 'absolute',
    bottom: -10,
    right: 0,
  },
  lightBlueView: {
    backgroundColor: PFColors.Blue.SoftGlacier,
    height: WP('55'),
    borderBottomEndRadius: 30,
    borderBottomLeftRadius: 30,
    marginBottom: 20,
  },
  username: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_24,
    color: PFColors.Standard.Black,
    textAlign: 'center',
    paddingVertical: 30,
  },
  btnStyles: {
    width: WP('90'),
    alignSelf: 'center',
    bottom: WP('10'),
  },
});
export default styles;
