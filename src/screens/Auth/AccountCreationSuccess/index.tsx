import React, {useEffect, useState} from 'react';
import {AppHeader, MainWrapper, SuccessInfo} from '../../../components';
import {svgIcon} from '../../../assets/svg';
import {useNavigation} from '@react-navigation/native';

const AccountCreationSuccess = ({route}: any) => {
  const [isNewAccount, setisNewAccount] = useState(false);
  const navigation: any = useNavigation();
  useEffect(() => {
    setisNewAccount(route?.params?.isSignUp);
  }, [route]);

  return (
    <MainWrapper>
      <AppHeader
        title="PathRover"
        clickBackIcon={() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'ContinueAs'}],
          });
        }}
      />
      <SuccessInfo
        icon={svgIcon.GreenCheck}
        // title="Successfully Created"
        buttonText="Next"
        description={
          isNewAccount
            ? `Your account has registered\nsuccessfully.`
            : `Your password has been reset\nsuccessfully.`
        }
      />
    </MainWrapper>
  );
};

export default AccountCreationSuccess;
