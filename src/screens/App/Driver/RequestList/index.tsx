import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
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
} from '../../../../shared/exporter';
import {useDispatch, useSelector} from 'react-redux';
import SwitchToggle from 'react-native-switch-toggle';
import {useChannel} from '../../../../hooks/socket/useChannel';
import {useActionCable} from '../../../../hooks/socket/useActionCable';
import {setIsProfileVerified} from '../../../../redux/driver/driverSlice';

// APIs
import {useLazyGetProfileStatusQuery} from '../../../../redux/driver/driverApiSlice';
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
  const {isProfileVerified} = useSelector((state: any) => state?.driver);

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
      }, 2000);
    }
  }, [isOfferSent]);

  useEffect(() => {
    console.log('Focused => ', isFocused);

    try {
      subscribe(
        {
          channel: 'RideRequestsChannel',
        },
        {
          received: res => {
            console.log('Res => ', res);
          },
          connected: () => {
            console.log('CONNECTED!');
          },
        },
      );
    } catch (err) {
      console.log('Error => ', err);
    }
    return () => {
      console.log('ROUTE => ', route?.name);
      if (route?.name !== 'Request Life') unsubscribe();
    };
  }, [isFocused]);

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
            renderItem={() => (
              <OfferRequestCard onPressAccept={() => setOfferSheetShow(true)} />
            )}
          />
        ) : (
          <View style={styles.noRidesContainer}>
            <Text style={styles.noRidesText}>No Rides Found</Text>
          </View>
        ))}

      <OfferSheetModal
        modalVisible={offerSheetShow}
        onPressCancel={() => setOfferSheetShow(false)}
        onPressSend={() => {
          setOfferSheetShow(false);
          setTimeout(() => {
            setIsOfferSent(true);
          }, 1000);
        }}
      />
      <SendOfferModal isModalVisible={isOfferSent} />
      <ReviewsListSheet
        modalVisible={showReviewSheet}
        onPressCross={() => setShowReviewSheet(false)}
        onPressDone={() => setShowReviewSheet(false)}
      />
    </MainWrapper>
  );
};

export default RequestList;
