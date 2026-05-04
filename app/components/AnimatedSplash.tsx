import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, Line, LinearGradient, Rect, Stop } from 'react-native-svg';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Classic variant tokens
const C = {
  tileBg1: '#84CDFB',
  tileBg2: '#2A9DEC',
  tileBg3: '#1869A4',
  sun: '#FFC23B',
  sunHi: '#FFE694',
  rays: '#FFE694',
  cloud: '#FFFFFF',
  cloudShade: '#E1F2FF',
};

// Sun geometry (200×200 viewBox)
const SUN_CX = 78,
  SUN_CY = 78,
  SUN_R = 30;

function buildRays() {
  const rays: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const inner = SUN_R + 8;
    const outer = SUN_R + 22;
    rays.push({
      x1: SUN_CX + Math.cos(a) * inner,
      y1: SUN_CY + Math.sin(a) * inner,
      x2: SUN_CX + Math.cos(a) * outer,
      y2: SUN_CY + Math.sin(a) * outer,
    });
  }
  return rays;
}

const RAYS = buildRays();
const ICON_SIZE = Math.min(SCREEN_W * 0.55, 240);

interface Props {
  onDone: () => void;
}

export default function AnimatedSplash({ onDone }: Props) {
  // Animation values
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const cloudX = useRef(new Animated.Value(-SCREEN_W)).current;
  const sunScale = useRef(new Animated.Value(0.3)).current;
  const sunOpacity = useRef(new Animated.Value(0)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordY = useRef(new Animated.Value(14)).current;
  const barOpacity = useRef(new Animated.Value(0)).current;
  const barSlide = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Sky fade in
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // 2. Cloud drifts in + sun pops (parallel)
      Animated.parallel([
        Animated.timing(cloudX, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(200),
          Animated.parallel([
            Animated.spring(sunScale, {
              toValue: 1,
              friction: 5,
              tension: 80,
              useNativeDriver: true,
            }),
            Animated.timing(sunOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),
      // 3. Wordmark + loading bar fade up
      Animated.parallel([
        Animated.timing(wordOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(wordY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(100),
          Animated.timing(barOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]),
      // 4. Loading bar slides across
      Animated.timing(barSlide, {
        toValue: 60,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.delay(200),
    ]).start(() => onDone());
  }, []);

  return (
    <View style={styles.root}>
      {/* Sky background */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: bgOpacity }]}>
        <Svg width={SCREEN_W} height={SCREEN_H} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={C.tileBg1} />
              <Stop offset="0.6" stopColor={C.tileBg2} />
              <Stop offset="1" stopColor={C.tileBg3} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={SCREEN_W} height={SCREEN_H} fill="url(#sky)" />
        </Svg>
      </Animated.View>

      {/* Hero icon */}
      <View style={styles.iconWrapper}>
        {/* Cloud layer — translates in from left */}
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: cloudX }] }]}>
          <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 200 200">
            {/* cloud shadow */}
            <Ellipse cx="118" cy="148" rx="62" ry="10" fill="rgba(14,53,89,0.18)" />
            {/* cloud puffs */}
            <Circle cx="78" cy="120" r="22" fill={C.cloudShade} />
            <Circle cx="105" cy="108" r="30" fill={C.cloud} />
            <Circle cx="138" cy="112" r="26" fill={C.cloud} />
            <Circle cx="160" cy="124" r="20" fill={C.cloud} />
            <Rect x="74" y="125" width="92" height="22" rx="11" fill={C.cloud} />
            <Ellipse cx="100" cy="98" rx="16" ry="5" fill="#FFFFFF" opacity="0.75" />
          </Svg>
        </Animated.View>

        {/* Sun layer — scales in */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: sunOpacity,
              transform: [{ scale: sunScale }],
            },
          ]}
        >
          <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 200 200">
            {/* rays */}
            {RAYS.map((r, i) => (
              <Line
                key={i}
                x1={r.x1}
                y1={r.y1}
                x2={r.x2}
                y2={r.y2}
                stroke={C.rays}
                strokeWidth="8"
                strokeLinecap="round"
                opacity={0.95}
              />
            ))}
            {/* sun body */}
            <Circle cx={SUN_CX} cy={SUN_CY} r={SUN_R} fill={C.sun} />
            <Circle cx={SUN_CX - 8} cy={SUN_CY - 8} r={SUN_R * 0.55} fill={C.sunHi} opacity={0.7} />
          </Svg>
        </Animated.View>
      </View>

      {/* Wordmark + tagline */}
      <Animated.View
        style={[
          styles.wordmark,
          {
            opacity: wordOpacity,
            transform: [{ translateY: wordY }],
          },
        ]}
      >
        <Animated.Text style={styles.brand}>Weather</Animated.Text>
        <Animated.Text style={styles.tagline}>A friendlier forecast</Animated.Text>
      </Animated.View>

      {/* Loading bar */}
      <Animated.View style={[styles.loadingTrack, { opacity: barOpacity }]}>
        <Animated.View style={[styles.loadingBar, { transform: [{ translateX: barSlide }] }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.tileBg2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  iconWrapper: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginBottom: SCREEN_H * 0.08,
  },
  wordmark: {
    alignItems: 'center',
    position: 'absolute',
    bottom: '24%',
    left: 0,
    right: 0,
  },
  brand: {
    fontWeight: '900',
    fontSize: 52,
    letterSpacing: -1.8,
    color: '#0E3559',
    lineHeight: 56,
  },
  tagline: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(14,53,89,0.65)',
    letterSpacing: 0.2,
  },
  loadingTrack: {
    position: 'absolute',
    bottom: '12%',
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
  loadingBar: {
    width: '40%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});
