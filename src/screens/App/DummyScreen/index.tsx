import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { PFColors, PFFonts, WP } from '../../../shared/exporter'
import { useDispatch } from 'react-redux'
import { setAccessToken, setLoginUser } from '../../../redux/auth/authSlice'

const DummyScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const handleLogout = () => {
        dispatch(setAccessToken(null))
        dispatch(setLoginUser(null))
        navigation.replace('AuthStack')

    }
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.textStyles} onPress={() => handleLogout()}>Work in progress</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    textStyles: {
        textAlign: "center",
        color: PFColors.Blue.Dark,
        fontFamily: PFFonts.Foundation.SemiBold
    }
})
export default DummyScreen