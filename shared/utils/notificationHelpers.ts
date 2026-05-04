import type { WeatherData } from '@/features/weather/types/weather';
import type * as NotificationsType from 'expo-notifications';
import type { TemperatureUnit } from '@/shared/types/units';
import { getTemperatureUnitLabel } from '@/shared/utils/unitHelpers';

export type NotificationSettings = {
  rainAlertEnabled: boolean;
  rainAlertThreshold: number;
  dailySummaryEnabled: boolean;
  temperatureAlertEnabled: boolean;
  temperatureAlertThreshold: number;
  temperatureUnit: TemperatureUnit;
};

export async function scheduleWeatherNotifications(
  weatherData: WeatherData,
  settings: NotificationSettings
): Promise<void> {
  const {
    rainAlertEnabled,
    rainAlertThreshold,
    dailySummaryEnabled,
    temperatureAlertEnabled,
    temperatureAlertThreshold,
    temperatureUnit,
  } = settings;

  try {
    const Notifications = require('expo-notifications') as typeof NotificationsType;
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!rainAlertEnabled && !dailySummaryEnabled && !temperatureAlertEnabled) return;

    const city = weatherData.location.name;
    const now = new Date();

    for (const forecastday of weatherData.forecast.forecastday) {
      // forecastday.date is "YYYY-MM-DD" — append time to avoid UTC midnight ambiguity
      const base = new Date(`${forecastday.date}T00:00:00`);

      const trigger7am = new Date(base);
      trigger7am.setHours(7, 0, 0, 0);

      const trigger8am = new Date(base);
      trigger8am.setHours(8, 0, 0, 0);

      if (dailySummaryEnabled && trigger7am > now) {
        const maxTemp = getTemperatureUnitLabel(forecastday.day.maxtemp_c, temperatureUnit);
        const minTemp = getTemperatureUnitLabel(forecastday.day.mintemp_c, temperatureUnit);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: city,
            body: `${city}: ${forecastday.day.condition.text}, máx ${maxTemp}, mín ${minTemp}`,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: trigger7am,
          },
        });
      }

      if (trigger8am > now) {
        if (rainAlertEnabled && forecastday.day.daily_chance_of_rain >= rainAlertThreshold) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Alerta de chuva',
              body: `Chuva prevista em ${city}. Probabilidade: ${forecastday.day.daily_chance_of_rain}%`,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: trigger8am,
            },
          });
        }

        // temperatureAlertThreshold is always stored in °C regardless of display unit
        if (temperatureAlertEnabled && forecastday.day.maxtemp_c >= temperatureAlertThreshold) {
          const maxTemp = getTemperatureUnitLabel(forecastday.day.maxtemp_c, temperatureUnit);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Alerta de temperatura',
              body: `Temperatura alta em ${city}: máx ${maxTemp}`,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: trigger8am,
            },
          });
        }
      }
    }
  } catch (e) {
    console.warn('[notificationHelpers] Failed to schedule notifications', e);
  }
}
