import { StyleSheet } from 'react-native';
import { PFColors, WP } from '../../../../shared/exporter';

const styles = StyleSheet.create({
    height: {
        height: 20,
    },
    buttonStyle: {
        width: WP('95'),
        alignSelf: 'center',
        marginTop: WP('60'),
    },
    selectorStyles: {
        marginRight: 10,
        borderColor: PFColors.Blue.Dark

    },
    selectorConntainer: {
        alignSelf: "center",
        justifyContent: "space-between",
        marginTop: 20
    }

});
export default styles;
