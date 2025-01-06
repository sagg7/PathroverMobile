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
import {useSelector} from 'react-redux';
import SwitchToggle from 'react-native-switch-toggle';
import {useChannel} from '../../../../hooks/socket/useChannel';
import {useActionCable} from '../../../../hooks/socket/useActionCable';

const RequestList = ({}) => {
  const [on, seton] = useState(false);
  const [showReviewSheet, setShowReviewSheet] = useState(false);
  const [offerSheetshow, setofferSheetshow] = useState(false);
  const [isOfferSent, setIsOfferSent] = useState<boolean>(false);
  const {accessToken} = useSelector((state: any) => state?.auth);
  const [offersList, setOffersList] = useState<any>([]);

  const cleanedToken = accessToken.replace('Bearer ', '');

  // Socket
  const {actionCable} = useActionCable(REQ_LIST_SOCKET_URL, cleanedToken);
  const {subscribe, unsubscribe} = useChannel(actionCable);

  useEffect(() => {
    if (isOfferSent) {
      setTimeout(() => {
        setIsOfferSent(false);
      }, 2000);
    }
  }, [isOfferSent]);

  useEffect(() => {
    try {
      subscribe(
        {
          channel: 'RideOffersChannel',
        },
        {
          received: res => {
            console.log('Res => ', res);
          },
          connected: () => {},
        },
      );
    } catch (err) {
      console.log('Error => ', err);
    }
    return () => {
      unsubscribe();
    };
  }, []);

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
            onPress={() => seton(!on)}
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

      {on ? (
        <FlatList
          data={offersList}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <OfferRequestCard
              onPressAccept={() => setofferSheetshow(true)}
              item={item}
              index={index}
            />
          )}
        />
      ) : (
        <>
          <View style={styles.onOffContainer}>
            <Text style={styles.turnOnOfText}>
              {'Please Turn on Your\nAvailable Status'}
            </Text>
          </View>
        </>
      )}
      <OfferSheetModal
        modalVisible={offerSheetshow}
        onPressCancel={() => setofferSheetshow(false)}
        onPressSend={() => {
          setofferSheetshow(false);
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
