import { StyleSheet } from 'react-native';
import { WP, isIOS, scrHeight } from '../../../shared/exporter';

const styles = StyleSheet.create({
    container: {
    },
    formikContainer: {
        marginHorizontal: WP('4'),
        marginTop: WP('4'),
    },
    divider: {
        flexGrow: isIOS() ? .98 : .96,
        justifyContent: "flex-end",
    },
    btnContainer: isOpen => ({
        // marginBottom: isOpen ? 100 : WP('20'),

    }),
    scrollViewStyle: {
        flexGrow: 1,
    },
    heightStyle: {
        minHeight: scrHeight,
    },
});
export default styles;
