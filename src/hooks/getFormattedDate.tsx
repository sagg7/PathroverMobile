import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
dayjs.extend(calendar);

export const getFormattedDate = (date: string) => {
  const formattedDate = dayjs(date).calendar(null, {
    sameDay: '[Today at] h:mm A',
    lastDay: '[Yesterday at] h:mm A',
    nextDay: '[Tomorrow at] h:mm A',
    nextWeek: 'dddd [at] h:mm A',
    lastWeek: '[Last] dddd [at] h:mm A',
    sameElse: 'MMM D [at] h:mm A',
  });
  return formattedDate;
};
