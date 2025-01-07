import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
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
} from '../../../../shared/exporter';
import {useDispatch, useSelector} from 'react-redux';
import SwitchToggle from 'react-native-switch-toggle';
import {useChannel} from '../../../../hooks/socket/useChannel';
import {useActionCable} from '../../../../hooks/socket/useActionCable';
import {setIsProfileVerified} from '../../../../redux/driver/driverSlice';

// APIs
import {
  useLazyGetProfileStatusQuery,
  useSendOfferToManagerMutation,
} from '../../../../redux/driver/driverApiSlice';
import {useIsFocused} from '@react-navigation/native';

const RequestList = ({route}: any) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [on, seton] = useState(false);
  const [ridesList, setRidesList] = useState<any[]>([]);
  const [isOfferSent, setIsOfferSent] = useState<boolean>(false);
  const [offerSheetShow, setOfferSheetShow] = useState<boolean>(false);
  const [showReviewSheet, setShowReviewSheet] = useState<boolean>(false);
  const [profileApproved, setProfileApproved] = useState<boolean>(false);
  const {userRole} = useSelector((state: any) => state?.appRole);
  const {accessToken} = useSelector((state: any) => state?.auth);
  const [offerPrice, setOfferPrice] = useState<any>('');
  const {isProfileVerified} = useSelector((state: any) => state?.driver);
  const [sendOfferToManager, {isLoading: offerLoading}] =
    useSendOfferToManagerMutation();
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  // API
  const [getProfileStatus, {isLoading}] =
    useLazyGetProfileStatusQuery(undefined);

  const cleanedToken = accessToken.replace('Bearer ', '');

  // Socket
  const {actionCable} = useActionCable(REQ_LIST_SOCKET_URL, cleanedToken);
  const {subscribe, unsubscribe} = useChannel(actionCable);

  useEffect(() => {
    if (userRole === 'driver' && !isProfileVerified) {
      async function fetchProfileStatus() {
        const res = await getProfileStatus(userRole);
        const status = res?.data?.is_verified;
        setProfileApproved(status);
        dispatch(setIsProfileVerified(status));
      }
      fetchProfileStatus();
    }
  }, [userRole]);

  useEffect(() => {
    if (isOfferSent) {
      setTimeout(() => {
        setIsOfferSent(false);
      }, 5000);
    }
  }, [isOfferSent]);

  useEffect(() => {
    subscribe(
      {
        channel: 'RideRequestsChannel',
      },
      {
        received: res => {
          console.log('Received Data => ', res);
          setRidesList(prev => [...prev, res.data]);
        },
        connected: () => {
          console.log('Connected!');
        },
      },
    );

    return () => unsubscribe();
  }, []);

  const onPressDecline = () => {
    setRidesList((prev: any) =>
      prev.filter((item: any) => item?.id !== item?.id),
    );
  };

  const renderRideRequest = ({item, index}: any) => {
    return (
      <OfferRequestCard
        onPressAccept={() => {
          setOfferSheetShow(true);
          setSelectedOffer(item);
        }}
        onPressDecline={() => onPressDecline()}
        item={item}
        index={index}
      />
    );
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
      setOfferSheetShow(false);
      setIsOfferSent(true);
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  return (
    <MainWrapper>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.bellContainer}
          onPress={() => setShowReviewSheet(true)}>
          <Image source={appIcons.bellIcon} style={styles.bellIcon} />
        </TouchableOpacity>

        <View style={styles.centerSwitchWrapper}>
          <SwitchToggle
            switchOn={on}
            onPress={() => profileApproved && seton(!on)}
            circleColorOff={PFColors.Gray.AshGray}
            circleColorOn={PFColors.Green.LeafGreen}
            backgroundColorOn={PFColors.Green.MintLight}
            backgroundColorOff={PFColors.Gray.FrostedGray}
            circleStyle={styles.circleStyle}
            containerStyle={styles.toggleContainer}
          />
          <Text style={styles.headerText}>
            {on ? 'Available' : 'Unavailable'}{' '}
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

      {!on && profileApproved && (
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
      {on &&
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
        onChangeText={text => setOfferPrice(text)}
      />
      <SendOfferModal isModalVisible={isOfferSent} />
      <ReviewsListSheet
        modalVisible={showReviewSheet}
        onPressCross={() => setShowReviewSheet(false)}
        onPressDone={() => setShowReviewSheet(false)}
      />
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default RequestList;
