import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { PFColors, PFFontSize, PFFonts, appIcons } from '../../../../shared/exporter'
import { MainWrapper } from '../../../../components'

const Home = ({ navigation }) => {
    return (
        <MainWrapper >
            <View style={styles.headderContainer}>
                <Text style={styles.homeText}>Home</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                    <Image source={appIcons.settingIcon} style={styles.settingIcon} resizeMode='contain' />
                </TouchableOpacity>
            </View>
        </MainWrapper>
    )
}

export default Home

const styles = StyleSheet.create({
    headderContainer: {
        backgroundColor: PFColors.Standard.White,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        alignItems: "center"
    },
    settingIcon: {
        height: 32,
        width: 32
    },
    homeText: {
        fontFamily: PFFonts.Foundation.Regular,
        fontSize: PFFontSize.FONT_SIZE_16,
        color: PFColors.Standard.Black
    }
})