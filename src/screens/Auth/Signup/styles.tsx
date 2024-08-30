import { StyleSheet } from 'react-native';
import { WP, scrHeight } from '../../../shared/exporter';

const styles = StyleSheet.create({
    container: {
    },
    formikContainer: {
        marginHorizontal: WP('4'),
        marginTop: WP('4'),
    },
    divider: {
        flexGrow: .92,
        justifyContent: "flex-end",
    },
    btnContainer: isOpen => ({
        marginBottom: isOpen ? 100 : 10,

    }),
    scrollViewStyle: {
        flexGrow: 1,
    },
    heightStyle: {
        minHeight: scrHeight,
    },
});
export default styles;
