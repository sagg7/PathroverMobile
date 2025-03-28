import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import MobileAds from 'react-native-google-mobile-ads';
import {AskMe, MainWrapper} from '../../../../components';
import {useFcmTokenUpdateMutation} from '../../../../redux/auth/authApiSlice';
import {Routes, appIcons, AppLoader, Ads} from '../../../../shared/exporter';
import styles from './styles';
import {useGetNewsBlogsQuery} from '../../../../redux/endUser/endUserApiSlice';
import {getFCMToken} from '../../../../hooks/NotificationHook';
import {IOS_ADS, ANDROID_ADS} from '../../../../shared/utils/constant';
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
const Home = ({navigation}: any) => {
  const [search, setSearch] = useState('');
  const [ads, setAds] = useState<any[]>([]);
  const [fcmToken, setFCMToken] = useState(false);
  const [fcmTokenUpdate] = useFcmTokenUpdateMutation();
  const [data, setData] = useState<any>([]);
  const {data: allNewsBlogs, isLoading} = useGetNewsBlogsQuery(null);
  useEffect(() => {
    (async () => {
      const token = await getFCMToken();
      if (token) {
        setFCMToken(token);
        updateToken(token);
        // createNotifyChannel();
      }
    })();
  }, [navigation]);
  const updateToken = async token => {
    try {
      await fcmTokenUpdate({device_token: token});
    } catch (error) {
      //
    }
  };
  useEffect(() => {
    const checkPlatform = Platform.OS === 'ios';
    setAds(checkPlatform ? IOS_ADS : ANDROID_ADS);
  }, []);
  useEffect(() => {
    if (allNewsBlogs && allNewsBlogs?.length > 0) injectAds(allNewsBlogs, ads);
  }, [allNewsBlogs, ads]);

  const injectAds = (data: any[], ads: any[]) => {
    let newData = [];
    let adIndex = 0;

    for (let i = 0; i < data?.length; i++) {
      newData?.push(data[i]);

      if ((i + 1) % 20 === 0 && ads?.length > 0) {
        newData?.push({isAd: true, adData: ads[adIndex % ads?.length]}); // Cycle through ads
        adIndex++;
      }
    }
    setData(newData);
    return newData;
  };
  const renderItem = ({item, index}: any) => {
    if (item?.isAd) {
      return <Ads item={ads[index / 21]} />; // Pass ad sequentially
    }

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate(Routes.NewsBlogDetail, {item})}
        style={styles.itemContainer}>
        <Image source={{uri: item?.image_url}} style={styles.imageStyle} />
        <View style={styles.contentContainer}>
          <Text style={styles.titleTextStyle}>{item?.title}</Text>
          <Text numberOfLines={3} style={styles.descTextStyle}>
            {item?.content_in_text}
          </Text>
          <Text style={styles.timeTextStyle}>
            {moment(item?.created_at).format('MM-DD-YYYY')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MainWrapper>
      <View style={styles.headerContainer}>
        <Text style={styles.homeTextStyle}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image
            resizeMode="contain"
            style={styles.settingIcon}
            source={appIcons.settingIcon}
          />
        </TouchableOpacity>
      </View>

      <AskMe
        value={search}
        placeholder={'Ask me anything...'}
        onChangeText={txt => setSearch(txt)}
        onPress={() => {
          navigation.navigate('AiChat', {search});
          setSearch('');
        }}
      />
      <Text style={styles.headingTextStyle}>Latest News and Blogs</Text>
      {allNewsBlogs?.length > 0 ? (
        <View style={{flex: 1}}>
          <FlatList
            data={data}
            renderItem={renderItem}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            keyExtractor={(item: any) => item?.id?.toString()}
          />
        </View>
      ) : (
        <View style={styles.noRecordContainer}>
          <Text style={styles.noRecordTextStyle}>
            {!isLoading && 'No Records Found'}
          </Text>
        </View>
      )}
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default Home;
