import {Platform} from 'react-native';
import {
  AccessToken,
  AuthenticationToken,
  LoginManager,
} from 'react-native-fbsdk-next';
import {showAlert} from '../../shared/exporter';

type SetFacebookToken = (token: string | null) => void;

export const useFacebookSignIn = (setFacebookToken: SetFacebookToken) => {
  const signInWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        showAlert('Facebook sign-in failed', 'Facebook sign-in was cancelled.');
        return;
      }

      if (result.grantedPermissions) {
        if (Platform.OS === 'ios') {
          const res = await AuthenticationToken.getAuthenticationTokenIOS();
          const authenticationToken = res?.authenticationToken;

          if (authenticationToken) {
            setFacebookToken(authenticationToken);
            return authenticationToken;
          }
        } else {
          const res = await AccessToken.getCurrentAccessToken();
          const accessToken = res?.accessToken;

          if (accessToken) {
            setFacebookToken(accessToken);
            return accessToken;
          }
        }
      }

      showAlert(
        'Facebook sign-in failed',
        'Unable to retrieve Facebook access token.',
      );
    } catch (error) {
      console.error('Facebook sign-in error:', error);
      showAlert(
        'Facebook sign-in failed',
        (error as Error)?.message ||
          'An unknown error occurred during Facebook sign-in.',
      );
    }
  };

  return {signInWithFacebook};
};
