import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
import {Routes} from '../../shared/exporter';

interface PremiumAlertProps {
  title?: string;
  message?: string;
}

const usePremiumAlert = () => {
  const navigation = useNavigation<any>();

  const showPremiumAlert = ({
    title = 'Unlock Premium Features',
    message = 'This feature is available for premium users. Upgrade now to unlock exclusive access!',
  }: PremiumAlertProps) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Upgrade Now',
          onPress: () => {
            navigation.navigate(Routes.Subscription);
          },
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  return {showPremiumAlert};
};

export default usePremiumAlert;
