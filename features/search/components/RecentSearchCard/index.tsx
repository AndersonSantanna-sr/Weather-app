import { useForecast } from '@/features/weather/hooks/useForecast';
import ForecastCard from '@/shared/components/ForecastCard';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { formatRelativeTime } from '@/shared/utils/dateHelpers';
import { Ionicons } from '@expo/vector-icons';
import type { FC } from 'react';
import React, { useRef, useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, Animated, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useSearchStore } from '../../stores/useSearchStore';
import type { SearchLocation } from '../../types/search';
import { createStyles } from './styles';

type Props = {
  item: SearchLocation;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const RecentSearchCard: FC<Props> = ({ item, onPress, style }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { data, isFetching, isError, refetch } = useForecast(`${item.lat},${item.lon}`);
  const removeRecentSearch = useSearchStore((state) => state.removeRecentSearch);
  const textColor = useWeatherThemeStore((state) => state.textColor);
  const subtextColor = useWeatherThemeStore((state) => state.subtextColor);
  const translateX = useRef(new Animated.Value(0)).current;
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleConfirmRemove = () => {
    setConfirmVisible(false);
    Animated.timing(translateX, {
      toValue: -500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => removeRecentSearch(item.id));
  };

  return (
    <>
      <Animated.View style={[style, { transform: [{ translateX }] }]}>
        <View>
          <TouchableOpacity
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`View weather for ${item.name}`}
          >
            {isFetching && !data ? (
              <View style={styles.loading}>
                <ActivityIndicator size="small" color={theme.colors.text.secondary} />
              </View>
            ) : isError ? (
              <View style={styles.errorCard}>
                <View style={styles.errorLeft}>
                  <Text style={[styles.errorName, { color: textColor }]}>{item.name}</Text>
                  <Text style={[styles.errorSubtitle, { color: subtextColor }]}>
                    {formatRelativeTime(item.searchedAt)}
                  </Text>
                </View>
                <Text style={[styles.errorTemp, { color: textColor }]}>—</Text>
                <Ionicons name="warning-outline" size={24} color={subtextColor} />
              </View>
            ) : (
              <ForecastCard
                title={item.name}
                subtitle={formatRelativeTime(item.searchedAt)}
                avgTemperature={data?.current.temp_c ?? 0}
                icon={data?.current.condition.code ?? 0}
                isDay={!!data?.current.is_day}
              />
            )}
          </TouchableOpacity>

          {isError && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={`Retry loading weather for ${item.name}`}
            >
              <Ionicons name="refresh-outline" size={20} color={textColor} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => setConfirmVisible(true)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item.name}`}
          >
            <Ionicons name="close" size={18} color={textColor} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Modal
        transparent
        animationType="fade"
        visible={confirmVisible}
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Remover cidade</Text>
            <Text style={styles.dialogMessage}>
              Deseja remover {item.name} das buscas recentes?
            </Text>
            <View style={styles.dialogActions}>
              <TouchableOpacity
                style={styles.dialogButton}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.dialogCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, styles.dialogButtonConfirm]}
                onPress={handleConfirmRemove}
              >
                <Text style={styles.dialogButtonConfirmText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default RecentSearchCard;
