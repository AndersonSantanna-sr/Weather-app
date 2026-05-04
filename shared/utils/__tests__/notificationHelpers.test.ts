import { scheduleWeatherNotifications } from '@/shared/utils/notificationHelpers';
import { TemperatureUnit } from '@/shared/types/units';

const mockSchedule = jest.fn().mockResolvedValue(undefined);
const mockCancel = jest.fn().mockResolvedValue(undefined);

jest.mock('expo-notifications', () => ({
  cancelAllScheduledNotificationsAsync: () => mockCancel(),
  scheduleNotificationAsync: (...args: unknown[]) => mockSchedule(...args),
  SchedulableTriggerInputTypes: { DATE: 'date' },
}));

const baseSettings = {
  rainAlertEnabled: false,
  rainAlertThreshold: 50,
  dailySummaryEnabled: false,
  temperatureAlertEnabled: false,
  temperatureAlertThreshold: 35,
  temperatureUnit: TemperatureUnit.CELSIUS,
};

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

const makeWeatherData = (overrides: Record<string, unknown> = {}) => ({
  location: { name: 'São Paulo' },
  forecast: {
    forecastday: [
      {
        date: tomorrowStr,
        day: {
          maxtemp_c: 38,
          mintemp_c: 22,
          daily_chance_of_rain: 75,
          condition: { text: 'Sunny' },
          ...overrides,
        },
      },
    ],
  },
});

beforeEach(() => {
  mockSchedule.mockClear();
  mockCancel.mockClear();
});

describe('scheduleWeatherNotifications', () => {
  it('cancels all notifications even when all alerts disabled', async () => {
    await scheduleWeatherNotifications(makeWeatherData() as never, baseSettings);
    expect(mockCancel).toHaveBeenCalledTimes(1);
    expect(mockSchedule).not.toHaveBeenCalled();
  });

  it('schedules daily summary when enabled', async () => {
    await scheduleWeatherNotifications(makeWeatherData() as never, {
      ...baseSettings,
      dailySummaryEnabled: true,
    });
    expect(mockSchedule).toHaveBeenCalledTimes(1);
    expect(mockSchedule.mock.calls[0][0].content.title).toBe('São Paulo');
  });

  it('schedules rain alert when chance >= threshold', async () => {
    await scheduleWeatherNotifications(makeWeatherData() as never, {
      ...baseSettings,
      rainAlertEnabled: true,
      rainAlertThreshold: 50,
    });
    expect(mockSchedule).toHaveBeenCalledTimes(1);
    expect(mockSchedule.mock.calls[0][0].content.title).toBe('Alerta de chuva');
  });

  it('does not schedule rain alert when chance < threshold', async () => {
    await scheduleWeatherNotifications(
      makeWeatherData({ daily_chance_of_rain: 30 }) as never,
      { ...baseSettings, rainAlertEnabled: true, rainAlertThreshold: 50 }
    );
    expect(mockSchedule).not.toHaveBeenCalled();
  });

  it('schedules temperature alert when maxtemp_c >= threshold', async () => {
    await scheduleWeatherNotifications(makeWeatherData() as never, {
      ...baseSettings,
      temperatureAlertEnabled: true,
      temperatureAlertThreshold: 35,
    });
    expect(mockSchedule).toHaveBeenCalledTimes(1);
    expect(mockSchedule.mock.calls[0][0].content.title).toBe('Alerta de temperatura');
  });

  it('does not schedule temperature alert when maxtemp_c < threshold', async () => {
    await scheduleWeatherNotifications(
      makeWeatherData({ maxtemp_c: 30 }) as never,
      { ...baseSettings, temperatureAlertEnabled: true, temperatureAlertThreshold: 35 }
    );
    expect(mockSchedule).not.toHaveBeenCalled();
  });
});
