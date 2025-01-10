import {FlatList, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  AppHeader,
  AppLoader,
  MainWrapper,
  OfferExpireCard,
} from '../../../../../components';
import OfferCard from './OfferCard';
import styles from './styles';
import {useActionCable} from '../../../../../hooks/socket/useActionCable';
import {
  OFFER_STATUS,
  REQ_LIST_SOCKET_URL,
  Routes,
  showAlert,
  UNEXPECTED_ERROR,
} from '../../../../../shared/exporter';
import {useChannel} from '../../../../../hooks/socket/useChannel';
import {useNavigation} from '@react-navigation/native';
import {
  useCancelRideRequestMutation,
  useAcceptDeclineDriverOfferMutation,
} from '../../../../../redux/manager/managerApiSlice';

const VehiclesOffer = ({route}: any) => {
  const [rideOffersFromDriver, setRideOffersFromDriver] = useState<any>([]);
  const {accessToken} = useSelector((state: any) => state?.auth);
  const cleanedToken = accessToken.replace('Bearer ', '');
  const navigation: any = useNavigation();
  const [seconds, setSeconds] = useState(300);

  // APIs
  const [acceptDeclineDriverOffer, {isLoading}] =
    useAcceptDeclineDriverOfferMutation();

  const [cancelRideRequest, {isLoading: cancelLoading}] =
    useCancelRideRequestMutation();

  // Socket
  const {actionCable} = useActionCable(REQ_LIST_SOCKET_URL, cleanedToken);
  const {subscribe, unsubscribe} = useChannel(actionCable);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    } else {
      // handleCancelRequest();
    }
  }, [seconds]);

  // Format seconds into MM:SS
  const formatTime = (totalSeconds: any) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  useEffect(() => {
    subscribe(
      {
        channel: 'RideOffersChannel',
      },
      {
        received: res => {
          console.log('Manager Res => ', res?.data);
          setRideOffersFromDriver((prev: any) => [...prev, res?.data]);
        },
        connected: () => {
          console.log('Connected!');
        },
      },
    );

    return () => unsubscribe();
  }, []);

  const updateStatus = async ({status, item}: any) => {
    try {
      const obj = {
        offer_data: {
          status: status,
          driver_id: item?.driver_id,
          ride_request_id: item?.ride_request_id,
          amount: item?.amount,
        },
      };

      const resp: any = await acceptDeclineDriverOffer(obj);
      if (resp?.data) {
        if (status === OFFER_STATUS.ACCEPTED) {
          // Navigate the Manager to the Ride Arrive Module
          // navigation.navigate(Routes.RideArrive);
          setRideOffersFromDriver([]);
        } else {
          setRideOffersFromDriver((prev: any) =>
            prev.filter(
              (item: any) => item.ride_request_id !== item.ride_request_id,
            ),
          );
        }
      } else {
        showAlert('Error', resp?.error?.data?.error);
      }
    } catch (e) {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  const handleCancelRequest = async () => {
    try {
      const formData = new FormData();
      formData.append('reason', '');

      const resp: any = await cancelRideRequest({
        id: route.params?.id,
        data: formData,
      });
      if (resp?.data) {
        navigation.goBack();
        setRideOffersFromDriver([]);
      } else {
        showAlert('Error', resp?.error?.data?.error);
      }
    } catch (e) {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  return (
    <MainWrapper>
      <AppHeader title="Request Vehicle" leftIcon={false} />
      <View style={styles.bodyConntainer}>
        <FlatList
          contentContainerStyle={styles.flatlistContainerStyle}
          showsVerticalScrollIndicator={false}
          data={rideOffersFromDriver}
          renderItem={({item, index}) => (
            <OfferCard
              style={styles.OfferCard}
              item={item}
              index={index}
              onPressAccept={() =>
                updateStatus({item, status: OFFER_STATUS.ACCEPTED})
              }
              onPressDecline={() =>
                updateStatus({item, status: OFFER_STATUS.REJECTED})
              }
            />
          )}
          ListHeaderComponent={() => (
            <OfferExpireCard
              time={formatTime(seconds)}
              onPressCancel={() => handleCancelRequest()}
            />
          )}
        />
      </View>
      {(isLoading || cancelLoading) && <AppLoader />}
    </MainWrapper>
  );
};

export default VehiclesOffer;
