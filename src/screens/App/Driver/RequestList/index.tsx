import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {
  AppLoader,
  MainWrapper,
  OfferRequestCard,
  OfferSheetModal,
  ReviewsListSheet,
  SendOfferModal,
} from '../../../../components';
import styles from './styles';
import {
  PFColors,
  appIcons,
  REQ_LIST_SOCKET_URL,
  showAlert,
  UNEXPECTED_ERROR,
  Routes,
} from '../../../../shared/exporter';
import {useDispatch, useSelector} from 'react-redux';
import SwitchToggle from 'react-native-switch-toggle';
import {useChannel} from '../../../../hooks/socket/useChannel';
import {useActionCable} from '../../../../hooks/socket/useActionCable';
import {
  setIsDriverAvailable,
  setIsProfileVerified,
  setUserPickerOffer,
} from '../../../../redux/driver/driverSlice';

// APIs
import {
  useLazyGetProfileStatusQuery,
  useSendLocationMutation,
  useSendOfferToManagerMutation,
} from '../../../../redux/driver/driverApiSlice';
import useLocation from '../../../../hooks/getLocation';
import {useGetInprogressRideQuery} from '../../../../redux/common/commonApiSlice';

const RequestList = ({navigation}: any) => {
  const dispatch = useDispatch();
  const {location} = useLocation();
  const myLocation = [location?.longitude, location?.latitude];
  const intervalRef = useRef<any>(null);
  const [available, setAvailable] = useState(false);
  const [ridesList, setRidesList] = useState<any[]>([]);
  const [requestStatus, setRequestStatus] = useState<string>('');
  const [isOfferSent, setIsOfferSent] = useState<boolean>(false);
  const [offerSheetShow, setOfferSheetShow] = useState<boolean>(false);
  const [showReviewSheet, setShowReviewSheet] = useState<boolean>(false);
  const [profileApproved, setProfileApproved] = useState<boolean>(false);
  const {userRole} = useSelector((state: any) => state?.appRole);
  const {accessToken} = useSelector((state: any) => state?.auth);
  const [offerPrice, setOfferPrice] = useState<any>('');
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [queryParams, setQueryParams] = useState({
    role: 'driver',
  });
  const {isProfileVerified, isDriverAvailable} = useSelector(
    (state: any) => state?.driver,
  );
  const [sendLocation] = useSendLocationMutation();

  // API
  const [getProfileStatus, {isLoading}] =
    useLazyGetProfileStatusQuery(undefined);

  const {isLoading: inProgressLoadding, data: inProgressRide} =
    useGetInprogressRideQuery(queryParams);
  const [sendOfferToManager, {isLoading: offerLoading}] =
    useSendOfferToManagerMutation();

  const cleanedToken = accessToken.replace('Bearer ', '');

  // Socket
  const {actionCable} = useActionCable(REQ_LIST_SOCKET_URL, cleanedToken);
  const {subscribe, unsubscribe, connected} = useChannel(actionCable);

  useEffect(() => {
    setAvailable(isDriverAvailable);
  }, [isDriverAvailable]);

  useEffect(() => {
    if (!isProfileVerified) {
      async function fetchProfileStatus() {
        const res = await getProfileStatus(userRole);
        const status = res?.data?.is_verified;
        setProfileApproved(status);
        dispatch(setIsProfileVerified(status));
      }
      fetchProfileStatus();
    } else {
      setProfileApproved(isProfileVerified);
    }
  }, [userRole]);

  useEffect(() => {
    // if (available) {
    subscribe(
      {
        channel: 'RideRequestsChannel',
      },
      {
        received: res => {
          handleBroadcastData(res);
        },
        connected: () => {
          console.log('Connected!');
        },
      },
    );
    // }

    return () => {
      // if (!available && connected)
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (available) trackLocation();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [available]);

  const handleBroadcastData = (res: any) => {
    const {status, ride_request_id} = res?.data || {};
    if (status === 'cancelled') {
      setTimeout(() => {
        showAlert(
          'Request Cancelled',
          'Request has been cancelled by Manager.',
          () => {
            setRidesList(prev =>
              prev.filter((item: any) => item?.id !== ride_request_id),
            );
          },
        );
      }, 300);
      if (ride_request_id === selectedOffer?.id && isOfferSent) {
        setIsOfferSent(false);
      }
    } else if (status === 'accepted') {
      setRequestStatus('accepted');
      setIsOfferSent(false);
      setOfferSheetShow(false);
      setTimeout(() => {
        showAlert(
          'Request Accepted',
          'Request has been accepted by Manager.',
          () => {
            navigation.navigate(Routes.OrderPickup, {item: selectedOffer});
            setRidesList(prev =>
              prev.filter((item: any) => item?.id === ride_request_id),
            );
          },
        );
      }, 300);
    } else if (status === 'rejected') {
      setRequestStatus('rejected');
      if (ride_request_id === selectedOffer?.id) setIsOfferSent(false);
      setTimeout(() => {
        setIsOfferSent(true);
      }, 300);
    } else {
      setRidesList(prev => [...prev, res.data]);
    }
  };

  const onPressDecline = (acceptedItem: any) => {
    setRidesList((prev: any) =>
      prev.filter((item: any) => item?.id !== acceptedItem?.id),
    );
  };

  const onPressAccept = (acceptedItem: any) => {
    if (acceptedItem) {
      setSelectedOffer(acceptedItem);
      setTimeout(() => {
        setOfferSheetShow(true);
      }, 300);
    }
  };

  const onPressSend = async () => {
    const data: any = {
      offer_data: {
        amount: offerPrice,
        ride_request_id: selectedOffer?.id,
      },
    };

    const resp = await sendOfferToManager(data);

    if (resp?.data) {
      setOfferPrice('');
      setOfferSheetShow(false);
      setTimeout(() => {
        setIsOfferSent(true);
      }, 500);
      dispatch(setUserPickerOffer(selectedOffer));
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  const onPressToggle = () => {
    if (profileApproved) setAvailable(!available);
    dispatch(setIsDriverAvailable(!isDriverAvailable));
  };

  const handleExpireRequest = () => {
    showAlert(
      'Offer Expired',
      'Your offer has been expired as no response received from manager.',
    );
    setIsOfferSent(false);
  };

  const trackLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });

      const {latitude, longitude} = position.coords;
      const obj = {
        user: {
          name: '',
          latitude,
          longitude,
        },
      };

      const resp = await sendLocation(obj);
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  // Todo for inprogress rides
  // useEffect(() => {
  //   if (inProgressRide?.data?.length > 0)
  //     navigation.navigate(Routes.OrderPickup, {item: inProgressRide?.data[0]});
  // }, [inProgressRide]);

  const renderRideRequest = ({item, index}: any) => (
    <OfferRequestCard
      onPressAccept={onPressAccept}
      onPressDecline={onPressDecline}
      item={item}
      index={index}
      location={myLocation}
    />
  );

  return (
    <MainWrapper>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.bellContainer}
          onPress={() => navigation.navigate(Routes.Notification)}>
          <Image source={appIcons.bellIcon} style={styles.bellIcon} />
        </TouchableOpacity>

        <View style={styles.centerSwitchWrapper}>
          <SwitchToggle
            switchOn={available}
            onPress={() => onPressToggle()}
            circleColorOff={PFColors.Gray.AshGray}
            circleColorOn={PFColors.Green.LeafGreen}
            backgroundColorOn={PFColors.Green.MintLight}
            backgroundColorOff={PFColors.Gray.FrostedGray}
            circleStyle={styles.circleStyle}
            containerStyle={styles.toggleContainer}
          />
          <Text style={styles.headerText}>
            {available ? 'Available' : 'Unavailable'}{' '}
          </Text>
        </View>
      </View>

      {!profileApproved && !isLoading && (
        <View style={styles.waitingContainer}>
          <View style={styles.rowContainer}>
            <Image source={appIcons.alertMiniIcon} style={styles.iconStyle} />
            <View>
              <Text style={styles.waitingText}>
                Waiting for Vehicle Registration Approval
              </Text>
              <Text style={styles.waitingTextDesc}>
                Please wait for your vehicle registration approval in-order to
                take orders.
              </Text>
            </View>
          </View>
        </View>
      )}

      {!available && profileApproved && (
        <>
          <View style={styles.approvedContainer}>
            <View style={styles.rowContainer}>
              <Image source={appIcons.checked} style={styles.iconStyle} />
              <View>
                <Text style={styles.approvedText}>
                  Your Documents are Verified
                </Text>
                <Text style={styles.approvedTextDesc}>
                  You can take order as your documents are verified.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.onOffContainer}>
            <Text style={styles.turnOnOfText}>
              {'Please Turn on Your\nAvailable Status'}
            </Text>
          </View>
        </>
      )}

      {available &&
        profileApproved &&
        (ridesList?.length > 0 ? (
          <FlatList
            data={ridesList}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => renderRideRequest({item, index})}
          />
        ) : (
          <View style={styles.noRidesContainer}>
            <Text style={styles.noRidesText}>No Rides Found</Text>
          </View>
        ))}

      <OfferSheetModal
        item={selectedOffer}
        modalVisible={offerSheetShow}
        onPressCancel={() => setOfferSheetShow(false)}
        onPressSend={() => onPressSend()}
        priceValue={offerPrice}
        onChangeText={(text: any) => setOfferPrice(text)}
        location={myLocation}
      />
      {isOfferSent && (
        <SendOfferModal
          isModalVisible={isOfferSent}
          requestStatus={requestStatus}
          handleGoBack={() => setIsOfferSent(false)}
          handleExpireRequest={() => handleExpireRequest()}
        />
      )}
      <ReviewsListSheet
        modalVisible={showReviewSheet}
        onPressCross={() => setShowReviewSheet(false)}
        onPressDone={() => setShowReviewSheet(false)}
      />
      {isLoading && offerLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default RequestList;
