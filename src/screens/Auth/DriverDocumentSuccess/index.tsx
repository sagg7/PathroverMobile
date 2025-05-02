import React from 'react';
import {AppHeader, MainWrapper} from '../../../components';
import {svgIcon} from '../../../assets/svg';
import {DriverSuccessInfo} from '../../../components/complex/DriverSuccessInfo';

const DocumentCreationSuccess = ({route}: any) => {
  return (
    <MainWrapper>
      <AppHeader title="PathRover" clickBackIcon={() => {}} />
      <DriverSuccessInfo
        icon={svgIcon.GreenCheck}
        // title="Successfully Created"
        buttonText="Next"
        description={`Your Documents are registered successfully`}
      />
    </MainWrapper>
  );
};

export default DocumentCreationSuccess;
