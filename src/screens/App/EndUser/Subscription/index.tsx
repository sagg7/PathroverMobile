import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  acknowledgePurchaseAndroid,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  useIAP,
} from 'react-native-iap';
import { useDispatch, useSelector } from 'react-redux';
import { svgIcon } from '../../../../assets/svg';
import { AppButton, AppLoader, MainWrapper } from '../../../../components';
import { setLoginUser } from '../../../../redux/auth/authSlice';
import { useCreateSubscriptionsMutation } from '../../../../redux/endUser/endUserApiSlice';
import {
  HP,
  isIOS,
  PFColors,
  PFFonts,
  PFFontSize,
  SubscriptionPackageName,
  WP,
} from '../../../../shared/exporter';

const SUBSCRIPTIONS_SLIDES = (isTrailAvailed: boolean) =>
  [
    !isTrailAvailed && {
      key: 1,
      title: 'Start Your Trial Today!',
      heading: 'How your free trial works',
      description:
        'No network? No problem! Premium users can download detailed maps to use while offline and far away from cell service. Reliable navigation to keep you safe on trail.',
      bullets: [
        'Get instant access and see how it can change your life.',
        'We’ll remind you with an email or notification that your trial is ending',
        `You'll be charged on ${new Date(
          new Date().setDate(new Date().getDate() + 7),
        ).toDateString()}, cancel anytime before.`,
      ],
      footer: 'Unlimited free access for 7 days, then $19.99 per month.',
      button: 'Start Free Trial',
    },
    {
      key: 2,
      title: 'Unlock Premium Access!',
      heading: 'Subscription for 1 Month',
      description:
        'No network? No problem! Premium users can download detailed maps to use while offline and far away from cell service. Reliable navigation to keep you safe on trail.',
      bullets: [
        'Chat options',
        'Update to WellPath',
        'Recording',
        'Share routes with their phone contact list',
        'Offline Maps',
      ],
      footer: !isTrailAvailed
        ? 'Unlimited free access for 7 days, then $19.99 per month.'
        : '',
      button: 'Purchase Subscription',
    },
  ].filter(Boolean);

const subscriptionSkus = ['com.pathrover.monthly'];

const Subscription = () => {
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);
  const isProcessing = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { subscriptions, getSubscriptions, requestSubscription } = useIAP();
  const { loginUser } = useSelector((state: any) => state?.auth);
  const [createSubscriptions] = useCreateSubscriptionsMutation();
  const [currentPurchase, setCurrentPurchase] = useState<any>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const initializeIAP = async () => {
      try {
        await initConnection();
        if (Platform.OS === 'android') {
          await flushFailedPurchasesCachedAsPendingAndroid();
        }
        await getSubscriptions({ skus: subscriptionSkus });
      } catch (error) {
        //
      }
    };

    initializeIAP();
  }, []);

  const handlePurchaseUpdate = useCallback(async (purchase: any) => {
    setIsLoading(false);
    isProcessing.current = false;
  }, []);

  const handlePurchaseError = useCallback((error: any) => {
    setIsLoading(false);
    isProcessing.current = false;
    Alert.alert('Error', error?.message ? error?.message : 'Failed to process purchase.');
  }, []);

  useEffect(() => {
    const updateListener = purchaseUpdatedListener(handlePurchaseUpdate);
    const errorListener = purchaseErrorListener(handlePurchaseError);

    return () => {
      updateListener.remove();
      errorListener.remove();
    };
  }, [handlePurchaseUpdate, handlePurchaseError]);

  const handleBuySubscription = async (sku: any) => {
    if (isProcessing.current || isLoading) return;
    isProcessing.current = true;
    setIsLoading(true);
    const availablePurchases = await getAvailablePurchases();

    try {
      setIsLoading(true);
      let byPass = false;
      if (Platform.OS === 'ios') {
        if (availablePurchases?.length === 0) {
          byPass = true;
        }
      } else {
        byPass = true;
      }
      
      if (byPass) {
        setIsLoading(true);
        const offerToken =
          subscriptions?.[0]?.subscriptionOfferDetails?.[0]?.offerToken || null;
                
        const purchase = await requestSubscription({
          sku,
          ...(offerToken && { subscriptionOffers: [{ sku, offerToken }] }),
        });
        setCurrentPurchase(purchase);


        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 30);
        const data = {
          subscription: {
            plan_name: 'Premium',
            price: 19.99,
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            receipt: purchase[0] ?? {},
          },
        };

        finishTheTransaction(purchase);

        createSubscriptions(data)
          .unwrap()
          .then(res => {
            Alert.alert('Success', 'Subscription purchased successfully!');
            navigation.goBack();
            dispatch(
              setLoginUser({
                ...loginUser,
                is_subscribed: true,
                is_aval_trial: true,
              }),
            );

          })
          .catch(e => {
            //
          });
      } else {
        setIsLoading(false);
        if (Platform.OS === 'ios' && availablePurchases?.length > 0){
          Alert.alert('Error', 'Subscription already purchased.');
        }
      }
    } catch (err) {
      isProcessing.current = false;
      setIsLoading(false);
      Alert.alert('Error', err?.message ? err?.message : 'Failed to purchase is_subscribed.');
    } finally {
      setIsLoading(false);
      isProcessing.current = false;
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / WP('100'));
    setSelectedIndex(index);
  };

  const handleNextSlide = () => {
    if (selectedIndex < SUBSCRIPTIONS_SLIDES.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * WP('100'), animated: true });
    } else {
      handleBuySubscription(SubscriptionPackageName);
    }
  };

  const finishTheTransaction = async (purchase) => {
    try {
      if (!isIOS()) {
        await acknowledgePurchaseAndroid({
          token: purchase[0].purchaseToken,
          developerPayload: purchase[0].developerPayloadAndroid,
        });
      }

      console.log('purchase', purchase);

      // finishPurchase(!isIOS() ? currentPurchase[0] : currentPurchase, false);
      await finishTransaction({
        purchase: !isIOS() ? purchase[0] : purchase,
        isConsumable: false,
      });

    } catch (error) {
      console.log('Error finishing transaction:', error);
    }
  };

  return (
    <MainWrapper>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.goBack()}
        style={styles.cross}>
        {svgIcon.Cross}
      </TouchableOpacity>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {SUBSCRIPTIONS_SLIDES(loginUser?.is_aval_trial).map((slide, index) => (
          <View key={slide.key} style={styles.container}>
            <Text style={styles.title}>{slide.title}</Text>
            <View style={styles.cardContainer}>
              <View style={styles.headingContainer}>
                <Text style={styles.heading}>{slide.heading}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.description}>{slide.description}</Text>
                <View style={styles.featuresContainer}>
                  {slide.bullets.map((bullet, bulletIndex) => (
                    <View key={bulletIndex} style={styles.bulletRow}>
                      {svgIcon.CheckCircle}
                      <Text style={styles.bullet}>{bullet}</Text>
                    </View>
                  ))}
                  <Text style={styles.footer}>{slide.footer}</Text>
                </View>
              </View>
            </View>
            <View style={styles.buttonWrapper}>
              <AppButton
                disabled={isLoading}
                title={
                  loginUser?.is_aval_trial
                    ? 'Purchase Subscription'
                    : 'Start Free Trial'
                }
                handleClick={handleNextSlide}
                buttonStyle={styles.button}
                textStyle={styles.buttonText}
              />
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {SUBSCRIPTIONS_SLIDES(loginUser?.is_aval_trial).map((_, index) => (
          <View
            key={index}
            style={[styles.dot, { opacity: index === selectedIndex ? 1 : 0.5 }]}
          />
        ))}
      </View>
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WP('100'),
    height: '100%',
    padding: WP('3.5'),
  },
  cross: {
    marginTop: WP('2.5'),
    marginRight: WP('2.5'),
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: PFFontSize.FONT_SIZE_24,
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    lineHeight: 32,
    marginBottom: WP('2.5'),
  },
  cardContainer: {
    backgroundColor: PFColors.Gray.CloudGray,
    borderRadius: 16,
    marginTop: WP('6'),
  },
  headingContainer: {
    padding: WP('3.5'),
    backgroundColor: PFColors.Blue.Dark,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    alignItems: 'center',
  },
  heading: {
    textAlign: 'center',
    fontFamily: PFFonts.Foundation.Bold,
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.White,
  },
  cardContent: {
    padding: WP('3.5'),
    height: HP('50'),
  },
  description: {
    fontSize: PFFontSize.FONT_SIZE_10,
    lineHeight: 16,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Regular,
  },
  featuresContainer: {
    marginTop: WP('5'),
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: WP('2.5'),
  },
  bullet: {
    fontSize: PFFontSize.FONT_SIZE_14,
    marginLeft: WP('2.5'),
    width: '85%',
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Regular,
  },
  footer: {
    marginTop: WP('5'),
    textAlign: 'center',
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Regular,
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: WP('4'),
  },
  dot: {
    width: WP('2'),
    height: WP('2'),
    borderRadius: WP('1'),
    backgroundColor: PFColors.Blue.Dark,
    marginHorizontal: 4,
  },
  slide: {
    width: WP('100%'),
    padding: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PFColors.Gray.WhisperGray,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: PFColors.Blue.Dark,
  },
});

export default Subscription;
