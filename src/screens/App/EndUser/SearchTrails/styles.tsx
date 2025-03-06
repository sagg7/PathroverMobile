import { StyleSheet } from 'react-native';
import { PFColors, PFFonts, WP, scale } from '../../../../shared/exporter';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PFColors.Standard.White,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: WP('4'),
        marginVertical: WP('5'),
        paddingVertical: WP('1'),
        borderRadius: 12,
        backgroundColor: PFColors.Gray.WhisperGray,
        marginBottom: 10,
    },
    subContainer: {
        marginHorizontal: scale(16)
    },
    inputStyle: {
        marginTop: 0,
        width: '95%',
        borderWidth: 0,
    },
    recentText: {
        marginTop: WP('2'),
        fontSize: scale(14),
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.Medium,
        marginBottom: scale(16),
    },
    itemContainer: {
        flex: 1,
        width: '100%',
        marginBottom: WP('3'),
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: WP('3'),
    },
    nameStyle: {
        marginBottom: 3,
        fontSize: scale(12),
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.SemiBold,
    },
    distanceStyle: {
        marginTop: 3,
        fontSize: scale(10),
        color: PFColors.Standard.Black,
        fontFamily: PFFonts.Foundation.Regular,
    },
    dividerStyle: {
        height: 1,
        width: '100%',
        marginTop: WP('4'),
        backgroundColor: PFColors.Blue.lightBlue,
    },
});

export default styles;