import {CardField, StripeProvider} from '@stripe/stripe-react-native';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {PFColors, scale, WP} from '../../../shared/exporter';
import {STRIPE_KEY} from '../../../shared/utils/constant';
import {AppButton} from '../AppButton';

interface CardFieldSheetProps {
  loading?: boolean;
  onPressSubmit?: (data: object) => void;
}
const CardFieldSheet = ({loading, onPressSubmit}: CardFieldSheetProps) => {
  const [cardDetails, setCardDetails] = useState({});

  const onCardChange = (details: object) => {
    if (details.complete) {
      setCardDetails(details);
    } else {
      setCardDetails({});
    }
  };

  return (
    <View style={styles.container}>
      <StripeProvider publishableKey={STRIPE_KEY}>
        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          style={styles.cardContainer}
          onCardChange={onCardChange}
          disabled={loading}
        />

        <AppButton
          title="Submit"
          isEmpty={false}
          textStyle={styles.textStyle}
          handleClick={() =>
            cardDetails?.complete && onPressSubmit(cardDetails)
          }
          disabled={!cardDetails?.complete || loading}
          buttonStyle={styles.buttonStyle}
        />
      </StripeProvider>
    </View>
  );
};

export {CardFieldSheet};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PFColors.Standard.White,
    paddingHorizontal: WP('4'),
    alignItems: 'center',
  },
  buttonsRow: {
    marginVertical: 15,
    position: 'absolute',
    bottom: 0,
  },
  textStyle: {
    width: '100%',
    textAlign: 'center',
  },
  cardContainer: {
    height: scale(50),
    marginVertical: 10,
    marginTop: 20,
    width: '100%',
    backgroundColor: PFColors.Gray.WhisperGray,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PFColors.Gray.SoftGray,
  },
  buttonStyle: {
    position: 'absolute',
    top: scale(600),
  },
});
