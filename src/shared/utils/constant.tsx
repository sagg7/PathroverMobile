import { Alert } from "react-native";
import { appImages } from "../exporter";

export function showAlert(type: string, des: string) {
    Alert.alert(type, des);
}

export const BASE_URL = ""

type IntroSlidesTypes = {
    key: number;
    title: string;
    info: string;
    image: any;
};
export const APP_INTRO_SLIDES: IntroSlidesTypes[] = [
    {
        key: 1,
        title: 'Welcome to PathFinder!',
        info: 'The premier navigation and mapping application tailored specifically for the oil and gas industry. Our app is designed to simplify navigation in remote and challenging environments, ensuring that you have the tools you need to reach your destination efficiently and safely.',
        image: appImages.appIntroTwo,
    },
    {
        key: 2,
        title: 'Create and Share Routes',
        info: 'Easily create routes and share them with your team for streamlined navigation. Whether you’re planning the best path to a new drill site or coordinating logistics for equipment delivery, PathFinder has you covered.',
        image: appImages.appIntroOne,
    },
    {
        key: 3,
        title: 'Integrated Chat: Seamless Communication',
        info: 'Stay connected with your team no matter where you are with PathFinder’s Integrated Chat, create group chats for different projects or teams, allowing for organized and efficient communication.',
        image: appImages.appIntroThree,
    },
];
export const AuthSheetLoginObj = {
    headerTitle: "Login",
    btnEmailText: "Login With Email",
    btnPhoneText: "Login With Phone",
    isLogin: true
}
export const AuthSheetSignupObj = {
    headerTitle: "Create new account",
    btnEmailText: "Signup With Email",
    btnPhoneText: "Signup With Phone",
    isLogin: false
}