import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

export function Skeleton({ width = 150, height = 20, borderRadius = 8 }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return <Animated.View style={[styles.skeleton, { width, height, borderRadius, opacity }]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
});
