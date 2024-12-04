import {appleAuth} from '@invertase/react-native-apple-authentication';
import {showAlert} from '../../shared/exporter';

export const useAppleSignIn = (
  setAppleToken: (token: string | null) => void,
) => {
  const signInWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      if (!appleAuthRequestResponse.identityToken) {
        showAlert('Apple Sign-In failed', 'No identity token returned');
        return; // exit early if no token
      }

      const { identityToken } = appleAuthRequestResponse;
      setAppleToken(identityToken); // set the token
    } catch (err) {
      console.log('Error => ', err?.message);
      // showAlert('Apple Sign-In Failed', 'The operation couldn’t be completed.');
    }
  };

  return {signInWithApple};
};
