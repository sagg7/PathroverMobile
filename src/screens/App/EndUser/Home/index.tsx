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
  const loginUser = useSelector(state => state?.auth?.loginUser);

  const [FCMToken, setFCMToken] = useState(false);
  const [search, setSearch] = useState('');
  const [ads, setAds] = useState({
    topAds: [],
    midAds: [],
    bottomAds: [],
  });

  useEffect(() => {
    const checkPlatform = Platform.OS === 'ios';

    setAds({
      topAds: checkPlatform ? top_ads_ios : top_ads_android,
      midAds: checkPlatform ? mid_ads_ios : mid_ads_android,
      bottomAds: checkPlatform ? bottom_ads_ios : bottom_ads_android,
    });
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
        <Text style={styles.headerText}>Amazing Ads</Text>
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
        value={search}
        placeholder={'Ask me anything...'}
        onChangeText={txt => setSearch(txt)}
        onPress={() => {
          navigation.navigate('AiChat', { search })
          setSearch('');
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.flatList}>
          <FlatList
            horizontal
            data={ads.topAds}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item + index.toString()}
          />
        </View>

        <View style={styles.flatlistView}>
          <ListHeaderComponent />
          <FlatList
            horizontal
            data={ads.midAds}
            renderItem={renderShortItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item + index.toString()}
          />
        </View>

        {/* <View style={styles.flatlistView}>
          <ListHeaderComponent />
          <FlatList
            horizontal
            data={ads.bottomAds}
            renderItem={renderShortItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item + index.toString()}
          />
        </View> */}
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
    paddingVertical: 6,
    shadowColor: PFColors.Standard.Black,
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    shadowOffset: {
      height: 4,
      width: 0,
    },
    marginVertical: 4,
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
    marginTop: scale(8),
    marginBottom: scale(8),
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: scale(50),
  },
  headerText: {
    fontFamily: PFFonts.Foundation.SemiBold,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
  },
});
