import {FlatList, View} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  AppHeader,
  MainWrapper,
  OfferExpireCard,
} from '../../../../../components';
import OfferCard from './OfferCard';
import styles from './styles';
import {useActionCable} from '../../../../../hooks/socket/useActionCable';
import {REQ_LIST_SOCKET_URL} from '../../../../../shared/exporter';
import {useChannel} from '../../../../../hooks/socket/useChannel';
import {useIsFocused} from '@react-navigation/native';

const VehiclesOffer = ({route}) => {
  const {accessToken} = useSelector((state: any) => state?.auth);
  const cleanedToken = accessToken.replace('Bearer ', '');
  const isFocused = useIsFocused();

  // Socket
  const {actionCable} = useActionCable(REQ_LIST_SOCKET_URL, cleanedToken);
  const {subscribe, unsubscribe} = useChannel(actionCable);

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
          connected: () => {
            console.log('CONNECTED!');
          },
        },
      );
    } catch (err) {
      console.log('Error => ', route);
    }
    return () => {
      if (route?.name !== 'VehiclesOffer') unsubscribe();
    };
  }, []);

  return (
    <MainWrapper>
      <AppHeader title="Request Vehicle" leftIcon={false} />
      <View style={styles.bodyConntainer}>
        <FlatList
          contentContainerStyle={styles.flatlistContainerStyle}
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3]}
          renderItem={({item}) => <OfferCard style={styles.OfferCard} />}
          ListHeaderComponent={() => <OfferExpireCard time={'4:55'} />}
        />
      </View>
    </MainWrapper>
  );
};

export default VehiclesOffer;
