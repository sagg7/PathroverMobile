import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {showAlert} from '../../shared/exporter';

export const useGoogleSignIn = (setGoogleToken: any) => {
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const result: any = await GoogleSignin.signIn();
      // console.log(result?.data?.);

      if (result?.data?.idToken) {
        setGoogleToken(result?.data?.idToken);
        // showAlert('Success', 'Google Sign-In successful');
      } else {
        showAlert('Google Sign-In failed', 'No ID token returned');
      }
    } catch (error: any) {
      console.log('Error =>', error?.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        showAlert('Google Sign-In Cancelled', 'User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        showAlert(
          'Google Sign-In In Progress',
          'Operation already in progress',
        );
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        showAlert(
          'Google Sign-In Failed',
          'Google Play Services not available or outdated',
        );
      } else {
        showAlert('Google Sign-In Failed', 'An unknown error occurred');
      }
    }
  };

  return {signInWithGoogle};
};
