import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MobileAds from 'react-native-google-mobile-ads';
import {useSelector} from 'react-redux';
import {Ads, AskMe, MainWrapper} from '../../../../components';
import {
  createNotifyChannel,
  getFCMToken,
} from '../../../../hooks/NotificationHook';
import {
  PFColors,
  PFFontSize,
  PFFonts,
  appIcons,
  scale,
} from '../../../../shared/exporter';
import {
  bottom_ads_android,
  bottom_ads_ios,
  mid_ads_android,
  mid_ads_ios,
  top_ads_android,
  top_ads_ios,
} from '../../../../shared/utils/constant';

MobileAds()
  .setRequestConfiguration({
    // An array of test device IDs to allow.
    testDeviceIdentifiers: ['EMULATOR'],
  })
  .then(() => {
    // Request config successfully set!
  });

MobileAds()
  .initialize()
  .then(adapterStatuses => {
    // Initialization complete!
  });

const Home = ({navigation}) => {
  const [FCMToken, setFCMToken] = useState(false);
  const loginUser = useSelector(state => state?.auth?.loginUser);
  const [topAds, setTopAds] = useState([]);
  const [midAds, setMidAds] = useState([]);
  const [bottomAds, setBottomAds] = useState([]);

  useEffect(() => {
    const checkPlatform = Platform.OS === 'ios';
    if (checkPlatform) {
      setBottomAds(bottom_ads_ios);
      setMidAds(mid_ads_ios);
      setTopAds(top_ads_ios);
    } else {
      setBottomAds(bottom_ads_android);
      setMidAds(mid_ads_android);
      setTopAds(top_ads_android);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getFCMToken();
      if (token?.fcmToken) {
        setFCMToken(token?.fcmToken);
        createNotifyChannel();
      }
    })();
  }, []);

  const renderItem = ({item}: string) => {
    return <Ads item={item} isTop />;
  };

  const renderShortItem = ({item}: string) => {
    return <Ads item={item} />;
  };

  const ListHeaderComponent = () => {
    return (
      <View style={styles.headerView}>
        <Text>Amazing Ads</Text>
      </View>
    );
  };

  return (
    <MainWrapper>
      <View style={styles.headderContainer}>
        <Text style={styles.homeText}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image
            source={appIcons.settingIcon}
            style={styles.settingIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <AskMe
        placeholder={'Ask me anything...'}
        onPress={() => navigation.navigate('AiChat')}
      />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.flatList}>
          <FlatList
            horizontal
            data={topAds}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item + index.toString()}
          />
        </View>

        <View style={styles.flatlistView}>
          <ListHeaderComponent />
          <FlatList
            horizontal
            data={midAds}
            renderItem={renderShortItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item + index.toString()}
          />
        </View>

        <View style={styles.flatlistView}>
          <ListHeaderComponent />
          <FlatList
            horizontal
            data={bottomAds}
            renderItem={renderShortItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item + index.toString()}
          />
        </View>
      </ScrollView>
      
    </MainWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  headderContainer: {
    backgroundColor: PFColors.Standard.White,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  settingIcon: {
    height: 32,
    width: 32,
  },
  homeText: {
    fontFamily: PFFonts.Foundation.Regular,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
  },
  flatList: {
    width: '94%',
    alignSelf: 'center',
  },
  flatlistView: {
    width: '94%',
    alignSelf: 'center',
    flexDirection: 'column',
  },
  headerView: {
    flex: 1,
    marginTop: scale(6),
    marginBottom: scale(4),
  },
  scrollView: {
    flex: 1,
    paddingBottom: scale(30),
  },
});
