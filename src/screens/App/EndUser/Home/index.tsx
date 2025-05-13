import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MobileAds from 'react-native-google-mobile-ads';
import {useDispatch, useSelector} from 'react-redux';
import {AskMe, MainWrapper} from '../../../../components';
import {isSubscriptionActive} from '../../../../hooks/iap-hook/iapPurchaseHook';
import {getFCMToken} from '../../../../hooks/NotificationHook';
import {useFcmTokenUpdateMutation} from '../../../../redux/auth/authApiSlice';
import {setLoginUser} from '../../../../redux/auth/authSlice';
import {
  useGetNewsBlogsQuery,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from '../../../../redux/endUser/endUserApiSlice';
import {appIcons, AppLoader, Routes} from '../../../../shared/exporter';
import {ANDROID_ADS, IOS_ADS} from '../../../../shared/utils/constant';
import styles from './styles';
import {useGetCurrentUserProfileQuery} from '../../../../redux/endUser/endUserApiSlice';
import {useIsFocused} from '@react-navigation/native';
import {setSelectedTrail} from '../../../../redux/endUser/endUserSlice';
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
  const loginUser = useSelector(state => state?.auth?.loginUser);

  const {data: allNewsBlogs, isLoading} = useGetNewsBlogsQuery(null);
  const {data: subscriptions} = useGetSubscriptionQuery(null);
  const [updateSubscription] = useUpdateSubscriptionMutation();

  const {data: userProfile, refetch} = useGetCurrentUserProfileQuery(null);
  const dispatch = useDispatch();
  const isFocued = useIsFocused();

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
    if (subscriptions?.length > 0 && loginUser?.is_subscribed) {
      checkSubscriptionStatus();
    }
  }, [subscriptions]);

  const checkSubscriptionStatus = async () => {
    const status = await isSubscriptionActive();
    const is_valid = status?.validation;

    dispatch(
      setLoginUser({
        ...loginUser,
        is_subscribed: is_valid,
        is_aval_trial: false,
      }),
    );
    updateSubscription({
      subscription: {
        is_subscribed: is_valid,
        id: subscriptions?.[0]?.id,
      },
    });
  };

  useEffect(() => {
    if (allNewsBlogs && allNewsBlogs?.length > 0) injectAds(allNewsBlogs, ads);
  }, [allNewsBlogs, ads]);
  useEffect(() => {
    if (isFocued) {
      refetch();
    }
  }, [isFocued]);

  useEffect(() => {
    if (userProfile && isFocued) {
      // const obj = {
      //   ...userProfile,
      //   is_subscribed: true,
      // };
      dispatch(setLoginUser(userProfile));
    }
  }, [userProfile, isFocued]);

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
    // if (item?.isAd) {
    //   return <Ads item={ads[index / 21]} />; // Pass ad sequentially
    // }

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate(Routes.NewsBlogDetail, {item})}
        style={styles.itemContainer}>
        <Image
          source={item?.image_url ? {uri: item?.image_url} : appIcons.appLogo}
          style={styles.imageStyle}
          resizeMode={item?.image_url ? 'cover' : 'contain'}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.titleTextStyle}>{item?.title}</Text>
          <Text numberOfLines={3} style={styles.descTextStyle}>
            {item?.content_in_text?.trim()}
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
        <TouchableOpacity
          hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}
          onPress={() => {
            navigation.navigate('Settings');
            dispatch(setSelectedTrail(null));
          }}>
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
