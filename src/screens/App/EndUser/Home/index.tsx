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
 
  const injectAds = (data: any[], ads: any[]) => {
    let newData = [];
    let adIndex = 0;
 
    for (let i = 0; i < data.length; i++) {
      newData.push(data[i]);
 
      if ((i + 1) % 20 === 0 && ads.length > 0) {
        newData.push({isAd: true, adData: ads[adIndex % ads.length]}); // Cycle through ads
        adIndex++;
      }
    }
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
            data={injectAds(allNewsBlogs, ads)}
            renderItem={renderItem}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            keyExtractor={(index: any) => index.toString()}
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
 
 



// import React, {useEffect, useState} from 'react';
// import {
//   FlatList,
//   Image,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import MobileAds from 'react-native-google-mobile-ads';
// import {useSelector} from 'react-redux';
// import {Ads, AskMe, MainWrapper} from '../../../../components';
// import {getFCMToken} from '../../../../hooks/NotificationHook';
// import {
//   PFColors,
//   PFFontSize,
//   PFFonts,
//   appIcons,
//   scale,
// } from '../../../../shared/exporter';
// import {
//   bottom_ads_android,
//   bottom_ads_ios,
//   mid_ads_android,
//   mid_ads_ios,
//   top_ads_android,
//   top_ads_ios,
// } from '../../../../shared/utils/constant';
// import { useFcmTokenUpdateMutation } from '../../../../redux/auth/authApiSlice';

// MobileAds()
//   .setRequestConfiguration({
//     // An array of test device IDs to allow.
//     testDeviceIdentifiers: ['EMULATOR'],
//   })
//   .then(() => {
//     // Request config successfully set!
//   });

// MobileAds()
//   .initialize()
//   .then(adapterStatuses => {
//     // Initialization complete!
//   });

// const Home = ({navigation}) => {
//   const loginUser = useSelector(state => state?.auth?.loginUser);

//   const [fcmTokenUpdate] = useFcmTokenUpdateMutation();

//   const [FCMToken, setFCMToken] = useState(false);
//   const [search, setSearch] = useState('');
//   const [ads, setAds] = useState({
//     topAds: [],
//     midAds: [],
//     bottomAds: [],
//   });

//   useEffect(() => {
//     const checkPlatform = Platform.OS === 'ios';

//     setAds({
//       topAds: checkPlatform ? top_ads_ios : top_ads_android,
//       midAds: checkPlatform ? mid_ads_ios : mid_ads_android,
//       bottomAds: checkPlatform ? bottom_ads_ios : bottom_ads_android,
//     });
//   }, []);

//   useEffect(() => {
//     (async () => {
//       const token = await getFCMToken();
//       if (token) {
//         setFCMToken(token);
//         updateToken(token);
//         // createNotifyChannel();
//       }
//     })();
//   }, [navigation]);

//   const updateToken = async (token) => {
//     try {
//       await fcmTokenUpdate({ device_token: token });
//     } catch (error) {
//       //
//     }
//   }


//   const renderItem = ({item}: string) => {
//     return <Ads item={item} isTop />;
//   };

//   const renderShortItem = ({item}: string) => {
//     return <Ads item={item} />;
//   };

//   const ListHeaderComponent = () => {
//     return (
//       <View style={styles.headerView}>
//         <Text style={styles.headerText}>Amazing Ads</Text>
//       </View>
//     );
//   };

//   return (
//     <MainWrapper>
//       <View style={styles.headderContainer}>
//         <Text style={styles.homeText}>Home</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
//           <Image
//             source={appIcons.settingIcon}
//             style={styles.settingIcon}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//       </View>

//       <AskMe
//         value={search}
//         placeholder={'Ask me anything...'}
//         onChangeText={txt => setSearch(txt)}
//         onPress={() => {
//           navigation.navigate('AiChat', {search});
//           setSearch('');
//         }}
//       />
//       <ScrollView contentContainerStyle={styles.scrollView}>
//         <View style={styles.flatList}>
//           <FlatList
//             horizontal
//             data={ads.topAds}
//             renderItem={renderItem}
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={(item, index) => item + index.toString()}
//           />
//         </View>

//         <View style={styles.flatlistView}>
//           <ListHeaderComponent />
//           <FlatList
//             horizontal
//             data={ads.midAds}
//             renderItem={renderShortItem}
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={(item, index) => item + index.toString()}
//           />
//         </View>

//         {/* <View style={styles.flatlistView}>
//           <ListHeaderComponent />
//           <FlatList
//             horizontal
//             data={ads.bottomAds}
//             renderItem={renderShortItem}
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={(item, index) => item + index.toString()}
//           />
//         </View> */}
//       </ScrollView>
//     </MainWrapper>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   headderContainer: {
//     backgroundColor: PFColors.Standard.White,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 30,
//     alignItems: 'center',
//     paddingVertical: 6,
//     shadowColor: PFColors.Standard.Black,
//     shadowOpacity: 0.15,
//     shadowRadius: 2,
//     elevation: 2,
//     shadowOffset: {
//       height: 4,
//       width: 0,
//     },
//     marginVertical: 4,
//   },
//   settingIcon: {
//     height: 32,
//     width: 32,
//   },
//   homeText: {
//     fontFamily: PFFonts.Foundation.Regular,
//     fontSize: PFFontSize.FONT_SIZE_16,
//     color: PFColors.Standard.Black,
//   },
//   flatList: {
//     width: '94%',
//     alignSelf: 'center',
//   },
//   flatlistView: {
//     width: '94%',
//     alignSelf: 'center',
//     flexDirection: 'column',
//   },
//   headerView: {
//     flex: 1,
//     marginTop: scale(8),
//     marginBottom: scale(8),
//   },
//   scrollView: {
//     flexGrow: 1,
//     paddingBottom: scale(50),
//   },
//   headerText: {
//     fontFamily: PFFonts.Foundation.SemiBold,
//     fontSize: PFFontSize.FONT_SIZE_16,
//     color: PFColors.Standard.Black,
//   },
// });
