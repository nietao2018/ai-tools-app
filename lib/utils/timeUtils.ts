/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs';

export function formatTime(time: number, format: string = 'HH:mm') {
  return dayjs(time).format(format);
}

export function getCurrentDate() {
  const now = new Date();
  // 如果需要特定时区，可以使用 Intl.DateTimeFormat
  const options = {
    timeZone: 'Asia/Shanghai',
    year: 'numeric' as const,
    month: 'numeric' as const,
    day: 'numeric' as const,
    hour: 'numeric' as const,
    minute: 'numeric' as const,
    second: 'numeric' as const,
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(now);
  return formattedDate;
}
