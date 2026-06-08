import { useSettings } from '@/shared/store/useSettings';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { TemperatureUnit, TimeFormat, WindSpeedUnit } from '@/shared/types/units';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Options } from '../components/SelectOption';
import SelectOption from '../components/SelectOption';

const temperatureUnitOptions = [
  { value: TemperatureUnit.CELSIUS, label: 'Celsius (°C)' },
  { value: TemperatureUnit.FAHRENHEIT, label: 'Fahrenheit (°F)' },
];

const windSpeedUnitOptions = [
  { value: WindSpeedUnit.KPH, label: 'km/h' },
  { value: WindSpeedUnit.MPH, label: 'mph' },
  { value: WindSpeedUnit.MS, label: 'm/s' },
];

const timeFormatOptions = [
  { value: TimeFormat.H24, label: '24 hours' },
  { value: TimeFormat.H12, label: '12 hours (AM/PM)' },
];

const rainThresholdOptions = [
  { value: 30, label: '30%' },
  { value: 50, label: '50%' },
  { value: 70, label: '70%' },
  { value: 90, label: '90%' },
];

const Settings: FC = () => {
  const router = useRouter();
  const {
    gradientColors,
    gradientLocations,
    heroText,
    heroSub,
    textColor,
    subtextColor,
    surfaceStrong,
    border,
    divider,
    chip,
    darkGlass,
  } = useWeatherThemeStore((s) => s);

  const {
    temperatureUnit,
    windSpeedUnit,
    timeFormat,
    rainAlertEnabled,
    rainAlertThreshold,
    dailySummaryEnabled,
    temperatureAlertEnabled,
    temperatureAlertThreshold,
    setTemperatureUnit,
    setWindSpeedUnit,
    setTimeFormat,
    setRainAlertEnabled,
    setRainAlertThreshold,
    setDailySummaryEnabled,
    setTemperatureAlertEnabled,
    setTemperatureAlertThreshold,
  } = useSettings();

  const temperatureAlertThresholdOptions: Options<number>[] = useMemo(() => {
    const celsiusValues = [30, 35, 40, 45];
    return celsiusValues.map((c) => ({
      value: c,
      label:
        temperatureUnit === TemperatureUnit.FAHRENHEIT
          ? `${((c * 9) / 5 + 32).toFixed(0)}°F`
          : `${c}°C`,
    }));
  }, [temperatureUnit]);

  const iconColor = darkGlass ? 'rgba(255,255,255,0.9)' : 'rgba(21,32,46,0.8)';
  const switchTrackColor = { false: 'rgba(120,120,128,0.32)', true: '#34C759' };
  const sep = { borderBottomWidth: 0.6 as const, borderBottomColor: divider };
  const cardStyle = [styles.card, { backgroundColor: surfaceStrong, borderColor: border }];

  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient
        colors={gradientColors}
        locations={gradientLocations}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: chip, borderColor: border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={iconColor} />
        </TouchableOpacity>
        <Text style={[styles.breadcrumb, { color: heroSub }]}>Weather</Text>
      </View>
      <Text style={[styles.pageTitle, { color: heroText }]}>Settings</Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Units — zIndex 2 so its dropdowns float above Notifications below */}
        <View style={styles.sectionZ2}>
          <Text style={[styles.sectionLabel, { color: subtextColor }]}>Units</Text>
          <View style={cardStyle}>
            <View style={[styles.row, sep, { zIndex: 30 }]}>
              <Text style={[styles.rowText, { color: textColor }]}>Temperature</Text>
              <View style={styles.rowControl}>
                <SelectOption
                  value={temperatureUnit}
                  options={temperatureUnitOptions}
                  onSelect={(o: Options<TemperatureUnit>) => setTemperatureUnit(o.value)}
                />
              </View>
            </View>
            <View style={[styles.row, sep, { zIndex: 20 }]}>
              <Text style={[styles.rowText, { color: textColor }]}>Wind Speed</Text>
              <View style={styles.rowControl}>
                <SelectOption
                  value={windSpeedUnit}
                  options={windSpeedUnitOptions}
                  onSelect={(o: Options<WindSpeedUnit>) => setWindSpeedUnit(o.value)}
                />
              </View>
            </View>
            <View style={[styles.row, { zIndex: 10 }]}>
              <Text style={[styles.rowText, { color: textColor }]}>Time Format</Text>
              <View style={styles.rowControl}>
                <SelectOption
                  value={timeFormat}
                  options={timeFormatOptions}
                  onSelect={(o: Options<TimeFormat>) => setTimeFormat(o.value)}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Notifications — zIndex 1 */}
        <View style={styles.sectionZ1}>
          <Text style={[styles.sectionLabel, { color: subtextColor }]}>Notifications</Text>
          <View style={cardStyle}>
            <View style={[styles.row, sep, { zIndex: 50 }]}>
              <View style={styles.rowLabel}>
                <Text style={[styles.rowText, { color: textColor }]}>Rain Alert</Text>
                {rainAlertEnabled ? (
                  <Text style={[styles.rowSub, { color: subtextColor }]}>
                    Notify above {rainAlertThreshold}% chance
                  </Text>
                ) : null}
              </View>
              <Switch
                value={rainAlertEnabled}
                onValueChange={setRainAlertEnabled}
                trackColor={switchTrackColor}
              />
            </View>
            {rainAlertEnabled && (
              <View style={[styles.row, sep, { zIndex: 45 }]}>
                <Text style={[styles.rowText, { color: textColor }]}>Rain Threshold</Text>
                <View style={styles.rowControl}>
                  <SelectOption
                    value={rainAlertThreshold}
                    options={rainThresholdOptions}
                    onSelect={(o: Options<number>) => setRainAlertThreshold(o.value)}
                  />
                </View>
              </View>
            )}
            <View style={[styles.row, sep, { zIndex: 40 }]}>
              <View style={styles.rowLabel}>
                <Text style={[styles.rowText, { color: textColor }]}>Daily Summary</Text>
                <Text style={[styles.rowSub, { color: subtextColor }]}>
                  Morning forecast at 7:00 AM
                </Text>
              </View>
              <Switch
                value={dailySummaryEnabled}
                onValueChange={setDailySummaryEnabled}
                trackColor={switchTrackColor}
              />
            </View>
            <View style={[styles.row, temperatureAlertEnabled ? sep : undefined, { zIndex: 35 }]}>
              <View style={styles.rowLabel}>
                <Text style={[styles.rowText, { color: textColor }]}>Temperature Alert</Text>
                {temperatureAlertEnabled ? (
                  <Text style={[styles.rowSub, { color: subtextColor }]}>
                    Notify above {temperatureAlertThreshold}°
                  </Text>
                ) : null}
              </View>
              <Switch
                value={temperatureAlertEnabled}
                onValueChange={setTemperatureAlertEnabled}
                trackColor={switchTrackColor}
              />
            </View>
            {temperatureAlertEnabled && (
              <View style={[styles.row, { zIndex: 30 }]}>
                <Text style={[styles.rowText, { color: textColor }]}>Temp. Threshold</Text>
                <View style={styles.rowControl}>
                  <SelectOption
                    value={temperatureAlertThreshold}
                    options={temperatureAlertThresholdOptions}
                    onSelect={(o: Options<number>) => setTemperatureAlertThreshold(o.value)}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breadcrumb: {
    fontSize: 17,
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.3,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionZ2: {
    zIndex: 2,
  },
  sectionZ1: {
    zIndex: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 22,
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  card: {
    borderRadius: 16,
    borderWidth: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 52,
    backgroundColor: 'transparent',
  },
  rowLabel: {
    flex: 1,
    marginRight: 8,
  },
  rowText: {
    fontSize: 16,
    fontWeight: '500',
  },
  rowSub: {
    fontSize: 12,
    marginTop: 2,
  },
  rowControl: {
    width: 150,
  },
  bottomPad: {
    height: 40,
  },
});

export default Settings;
