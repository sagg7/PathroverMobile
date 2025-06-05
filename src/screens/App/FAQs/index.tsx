import React, {useEffect, useState} from 'react';
import {AppHeader, MainWrapper} from '../../../components';
import {AppLoader, FAQ_LIST_LINK, isIOS} from '../../../shared/exporter';
import {WebView} from 'react-native-webview';

const FAQs = () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <MainWrapper>
      <AppHeader title="" />
      {loading && <AppLoader />}
      <WebView source={{uri: FAQ_LIST_LINK}} style={{top: isIOS() ? 0 : 0}} />
    </MainWrapper>
  );
};

export default FAQs;
