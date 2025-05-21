import {useEffect, useState} from 'react';
import {
  getProducts,
  endConnection,
  initConnection,
  requestPurchase,
  getSubscriptions,
  finishTransaction,
  requestSubscription,
  clearTransactionIOS,
  getAvailablePurchases,
  purchaseErrorListener,
  purchaseUpdatedListener,
  flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';
import {Platform} from 'react-native';
import { isIOS } from '../shared/exporter';

const useInAppPurchase = () => {
  let purchaseErrorSubscription = null;
  let purchaseUpdateSubscription = null;
  const [products, setProducts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [iapLoading, setIAPLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [purchaseError, setPurchaseError] = useState(null);
  const [currentPurchase, setCurrentPurchase] = useState(null);

  // Initialize the In-App Purchases - Only for Android
  // Purchase update listener
  useEffect(() => {
    const initializeIAP = async () => {
      try {
        await initConnection();
        if (!isIOS()) {
          // Flush failed purchases cached as pending on Android
          await flushFailedPurchasesCachedAsPendingAndroid();
        } else {
          await clearTransactionIOS();
        }
        setConnected(true);
      } catch (error) {``
        console.error('Initialization error => ', error);
      }

      // Set up purchase update listener
      purchaseUpdateSubscription = purchaseUpdatedListener(purchase => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          // Call your API (backend) to deliver or download the purchase
        }
      });

      // Set up purchase error listener
      purchaseErrorSubscription = purchaseErrorListener(error => {
        console.warn('Purchase Error Listener => ', error);
      });
    };

    initializeIAP();

    // Clean up subscriptions
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
      // endConnection();
    };
  }, []);

  // Fetch products against provided SKUS/Product IDs
  const fetchProducts = async skus => {
    if (!connected) return;
    try {
      const productIds = Platform.select({
        ios: skus,
        android: skus,
        default: [],
      });
      const fetchedProducts = await getProducts({skus: productIds});
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch subscriptions against provided SKUS/Product IDs
  const fetchSubscriptions = async skus => {
    if (!connected) return;
    try {
      const subscriptionSkus = Platform.select({
        ios: skus,
        android: skus,
        default: [],
      });

      const fetchedSubscriptions = await getSubscriptions({
        skus: subscriptionSkus,
      });
      setSubscriptions(fetchedSubscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  // For one-time products
  const buyProduct = async skuID => {
    setIAPLoading(true);
    setPurchaseError(null);
    setCurrentPurchase(null);
    let purchase;
    try {
      if (Platform.OS == 'ios') {
        purchase = await requestPurchase({sku: skuID});
      } else {
        purchase = await requestPurchase({skus: [skuID]});
      }
      setIAPLoading(false);
      setCurrentPurchase(purchase);
    } catch (error) {
      setIAPLoading(false);
      setPurchaseError('PUR_ERROR', error);
    }
  };

  // For subscriptions products
  const buySubscription = async (sku, offerToken) => {
    setIAPLoading(true);
    setPurchaseError(null);
    setCurrentPurchase(null);
    try {
      const purchase = await requestSubscription({
        sku,
        ...(offerToken && {subscriptionOffers: [{sku, offerToken}]}),
      });
      setIAPLoading(false);
      setCurrentPurchase(purchase);
    } catch (err) {
      setIAPLoading(false);
      console.warn(err.code, err.message);
    }
  };

  // Acknowledgement the purchase has been consumed.
  const finishPurchase = async (currentPurchasedItem, isConsumable) => {
    if (!currentPurchasedItem) return;
    try {
      await finishTransaction({
        purchase: currentPurchasedItem,
        isConsumable: isConsumable,
      });
      setCurrentPurchase(null);
      console.log('Finished Transaction');
    } catch (error) {
      console.error('Error finishing transaction:', error);
    }
  };

  // Get all purchases purchased(buy/subscribe) by the user
  const checkForAvailablePurchases = async () => {
    if (!connected) return;
    try {
      const availablePurchases = await getAvailablePurchases();
      console.log('Buy/Subscribe => ', availablePurchases);
    } catch (error) {
      console.error('Error checking available purchases:', error);
    }
  };

  return {
    products,
    connected,
    iapLoading,
    subscriptions,
    purchaseError,
    currentPurchase,
    buyProduct,
    fetchProducts,
    setIAPLoading,
    finishPurchase,
    buySubscription,
    fetchSubscriptions,
    checkForAvailablePurchases,
  };
};

export default useInAppPurchase;
