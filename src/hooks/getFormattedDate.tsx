import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(calendar);
dayjs.extend(relativeTime);

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

export const getFormattedTime = (date: string) => {
  const formattedTime = dayjs(date).toNow(true);
  return formattedTime;
};

export const isToday = (date: string) => {
  const now = dayjs(new Date()).format('MM-DD-YYYY');
  const selected = dayjs(date).format('MM-DD-YYYY');
  const match = dayjs(now).isSame(selected);

  return match;
}
