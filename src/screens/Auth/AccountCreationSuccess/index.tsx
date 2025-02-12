import React from 'react';
import {AppHeader, MainWrapper, SuccessInfo} from '../../../components';
import {svgIcon} from '../../../assets/svg';

const AccountCreationSuccess = () => {
  return (
    <MainWrapper>
      <AppHeader title="Path Rover" clickBackIcon={() => {}} />
      <SuccessInfo
        icon={svgIcon.GreenCheck}
        // title="Successfully Created"
        buttonText="Next"
        description={`Your account is registered\nsuccessfully`}
      />
    </MainWrapper>
  );
};

export default AccountCreationSuccess;
