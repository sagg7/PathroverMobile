import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  OFFER_STATUS,
  PFColors,
  PFFontSize,
  PFFonts,
  WP,
  appIcons,
  isIOS,
} from '../../../shared/exporter';
import {AppButton} from '../AppButton';

interface SendOfferModalProps {
  isModalVisible: boolean;
  handleClickEmail?: () => void;
  handleExpireRequest: () => void;
  handleGoBack: () => void;
  requestStatus: string;
}

const SendOfferModal: React.FC<SendOfferModalProps> = ({
  isModalVisible,
  handleExpireRequest,
  requestStatus = 'accepted',
  handleGoBack,
}) => {
  const [seconds, setSeconds] = useState(300);

  useEffect(() => {
    if (requestStatus === 'rejected') return;
    if (seconds > 0) {
      const timerId = setTimeout(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    } else {
      setSeconds(300);
      handleExpireRequest();
    }
  }, [seconds]);

  const formatTime = (totalSeconds: any) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <View style={styles.container}>
      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.modalContent}>
          {requestStatus === 'rejected' ? (
            <>
              <Text style={styles.rejectMessage}>
                {'Unfortunately, your offer has\nbeen declined'}
              </Text>
              <AppButton
                title="Go Back"
                buttonStyle={styles.goBackBtn}
                handleClick={() => handleGoBack()}
              />
            </>
          ) : (
            <>
              <TouchableOpacity disabled>
                <View style={styles.bubleViewContainer}>
                  <View style={styles.expandingView}>
                    <Image
                      source={appIcons.clock}
                      style={[styles.bubleIcon]}
                      resizeMode="contain"
                    />
                    <Text style={styles.text}>
                      Expires in :{' '}
                      <Text style={styles.timeText}>{formatTime(seconds)}</Text>
                    </Text>
                  </View>
                  <Text style={styles.offerSentText}>
                    Your offer has been been sent, Please wait for Transport
                    Manager Response.
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export {SendOfferModal};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  modal: {
    justifyContent: 'center',
    margin: 0,
  } as ViewStyle,
  modalContent: {
    backgroundColor: 'white',
    padding: WP('3'),
    borderRadius: WP('5'),
    margin: 15,
  } as ViewStyle,
  rejectMessage: {
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    fontSize: PFFontSize.FONT_SIZE_20,
    textAlign: 'center',
    lineHeight: 30,
    marginTop: WP('3'),
    marginBottom: WP('5'),
  } as TextStyle,
  goBackBtn: {
    width: WP('40'),
    alignSelf: 'center',
    marginVertical: WP('4'),
    height: WP('12s'),
  } as ViewStyle,
  bubleViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    alignSelf: 'center',
    marginVertical: 5,
  },

  expandingView: {
    backgroundColor: PFColors.Gray.CloudWhite,
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: PFFontSize.FONT_SIZE_14,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    paddingBottom: 3,
  },
  bubleIcon: {
    height: 16,
    width: 16,
    marginHorizontal: 5,
  },
  timeText: {
    color: PFColors.Red.RadiantRed,
  },
  offerSentText: {
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.Medium,
    textAlign: 'center',
    paddingTop: 10,
  },
});
