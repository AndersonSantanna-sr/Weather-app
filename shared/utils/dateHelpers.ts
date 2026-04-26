import { type WeatherHour } from '@/features/weather/types/weather';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const getWeekday = (date: string): string => {
  const [year, month, day] = date.split('-').map(Number);
  const weekday = new Date(year, month - 1, day).getDay();
  return WEEKDAYS[weekday];
};

export const formatDate = (date: string): string => {
  const [_, month, day] = date.split('-').map(Number);
  return `${MONTHS[month - 1]}, ${day}`;
};

export const formatHour = (datetime: string): string => {
  return datetime.split(' ')[1];
};

export const getNextHours = (
  today: WeatherHour[],
  tomorrow: WeatherHour[],
  count = 7
): WeatherHour[] => {
  const currentHour = new Date().getHours();

  const remaining = today.filter((item) => {
    const hour = parseInt(item.time.split(' ')[1].split(':')[0]);
    return hour >= currentHour;
  });

  if (remaining.length >= count) return remaining.slice(0, count);

  const needed = count - remaining.length;
  return [...remaining, ...tomorrow.slice(0, needed)];
};

export const formatRelativeTime = (timestamp: number): string => {
  if (!timestamp || !Number.isFinite(timestamp)) return '–';
  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return 'agora';
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}min atrás`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h atrás`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'ontem';
  return `${diffDays} dias atrás`;
};
