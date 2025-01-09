import {FlatList, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  AppHeader,
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
import {useAcceptDeclineDriverOfferMutation} from '../../../../../redux/manager/managerApiSlice';

const VehiclesOffer = ({route}: any) => {
  const [rideOffersFromDriver, setRideOffersFromDriver] = useState<any>([]);
  const {accessToken} = useSelector((state: any) => state?.auth);
  const cleanedToken = accessToken.replace('Bearer ', '');
  const navigation: any = useNavigation();
  const [seconds, setSeconds] = useState(300);
  const [acceptDeclineDriverOffer, {isLoading}] =
    useAcceptDeclineDriverOfferMutation();

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
      navigation.goBack();
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
          console.log('Received Data Vehicle Offer => ', res);
          if (
            res?.message ===
            'Your offer has been accepted by the transport manager'
          )
            return;
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
    if (status === OFFER_STATUS.ACCEPTED) {
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
          navigation.navigate(Routes.OrderPickup, {item: item});
          setRideOffersFromDriver([]);
        } else {
          showAlert('Error', resp?.error?.data?.error);
        }
      } catch (e) {
        showAlert('Error', UNEXPECTED_ERROR);
      }
    }
    setRideOffersFromDriver((prev: any) =>
      prev.filter((item: any) => item.ride_request_id !== item.ride_request_id),
    );
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
              onPressCancel={() => {
                navigation.goBack();
              }}
            />
          )}
        />
      </View>
    </MainWrapper>
  );
};

export default VehiclesOffer;
