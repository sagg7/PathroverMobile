import { SafeAreaView, StatusBar, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';
import { PFColors } from '../../../shared/exporter';
interface MainWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

const MainWrapper: React.FC<MainWrapperProps> = ({ children, style }) => {
    return (
        <SafeAreaView style={[styles.container, style]}>
            <StatusBar
                backgroundColor={PFColors.Standard.White}
                barStyle={'dark-content'}
                translucent={false}
            />
            {children}
        </SafeAreaView>
    );
};

export { MainWrapper };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PFColors.Standard.White,
    },
});
