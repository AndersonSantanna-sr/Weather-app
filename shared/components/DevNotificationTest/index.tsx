import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

const DevNotificationTest: React.FC = () => {
  const handleSend = async () => {
    try {
      const Notifications = require('expo-notifications');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '[DEV] Alerta de chuva',
          body: 'Chuva prevista em São Paulo. Probabilidade: 70%',
        },
        trigger: { seconds: 2 },
      });
      Alert.alert('Dev', 'Notificação agendada para 2 segundos.');
    } catch (e) {
      Alert.alert('Dev', `Erro: ${String(e)}`);
    }
  };

  return (
    <TouchableOpacity style={styles.fab} onPress={handleSend}>
      <Text style={styles.label}>🔔</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
  label: {
    fontSize: 22,
  },
});

export default DevNotificationTest;
