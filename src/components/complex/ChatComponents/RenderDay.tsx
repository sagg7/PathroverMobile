import moment from 'moment';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {PFColors, PFFonts, PFFontSize} from '../../../shared/exporter';

const RenderDay = props => {
  const {currentMessage, previousMessage} = props;

  if (previousMessage && previousMessage.createdAt) {
    const previousDate = moment(previousMessage.createdAt);
    const currentDate = moment(currentMessage.createdAt);
    if (previousDate.isSame(currentDate, 'day')) {
      return null;
    }
  }

  const messageDate = moment(currentMessage.createdAt);
  let dayLabel = '';

  if (moment().isSame(messageDate, 'day')) {
    dayLabel = 'Today';
  } else if (moment().subtract(1, 'day').isSame(messageDate, 'day')) {
    dayLabel = 'Yesterday';
  } else {
    dayLabel = messageDate.format('LL');
  }

  return (
    <View style={styles.dayContainer}>
      <Text style={styles.dayText}>{dayLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dayText: {
    fontFamily: PFFonts.Foundation.Medium,
    fontSize: PFFontSize.FONT_SIZE_10,
    color: PFColors.Standard.Black,
  },
  dayContainer: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: PFColors.Orange.Soft,
    borderRadius: 100,
    marginVertical: 4,
    alignSelf: 'center',
  },
});

export {RenderDay};
