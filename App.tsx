import { useEffect, useState } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GClockWidget from './widgets/GClockWidget';

type WidgetTimelineEntry = {
  date: Date;
  props: { timestamp: number };
};

function createMidnightTimeline(start: Date): WidgetTimelineEntry[] {
  const entries: WidgetTimelineEntry[] = [
    { date: start, props: { timestamp: start.getTime() } },
  ];

  for (let dayOffset = 0; dayOffset < 8; dayOffset += 1) {
    for (const hour of [0, 1]) {
      const date = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + dayOffset,
        hour,
      );

      if (date > start) {
        entries.push({ date, props: { timestamp: date.getTime() } });
      }
    }
  }

  return entries;
}

const gazePositions = [
  { x: -7, y: 1 },
  { x: 2, y: -6 },
  { x: 7, y: 2 },
  { x: -2, y: 6 },
];

function formatTime(date: Date) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((part) => String(part).padStart(2, '0'));
}

function GooglyEye({ second, phase }: { second: number; phase: number }) {
  const gaze = gazePositions[(second + phase) % gazePositions.length];

  return (
    <View style={styles.eye} accessibilityElementsHidden>
      <View style={[styles.pupil, { transform: [{ translateX: gaze.x }, { translateY: gaze.y }] }]} />
    </View>
  );
}

export default function App() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = new Date();

    if (Platform.OS === 'ios') {
      GClockWidget.updateTimeline(createMidnightTimeline(now));
      const timer = setInterval(() => {
        GClockWidget.updateTimeline(createMidnightTimeline(new Date()));
      }, 24 * 60 * 60 * 1000);
      return () => clearInterval(timer);
    }

    GClockWidget.updateSnapshot({ timestamp: now.getTime() });
    const timer = setInterval(() => {
      GClockWidget.updateSnapshot({ timestamp: Date.now() });
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const [hours, minutes, seconds] = formatTime(now);
  const midnightMode = now.getHours() === 0;
  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.wordmark}>GClock</Text>
          <View style={styles.localLabel}>
            <View style={styles.localDot} />
            <Text style={styles.localText}>LOCAL TIME</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.modeRow}>
            <Text style={styles.eyebrow}>THE DAILY EDITION</Text>
            <View style={[styles.modePill, midnightMode && styles.modePillAwake]}>
              <Text style={[styles.modeText, midnightMode && styles.modeTextAwake]}>
                {midnightMode ? 'EYES OPEN' : 'EYES RESTING'}
              </Text>
            </View>
          </View>

          <View
            style={[styles.clockFace, midnightMode ? styles.clockFaceAwake : styles.clockFaceResting]}
            accessible
            accessibilityLabel={midnightMode ? 'Googly eyes awake for the midnight hour' : 'Clock face'}
          >
            <View style={styles.faceLabelRow}>
              <Text style={styles.faceLabel}>G</Text>
              <View style={styles.faceDot} />
            </View>
            {midnightMode ? (
              <View style={styles.eyesRow}>
                <GooglyEye second={now.getSeconds()} phase={0} />
                <GooglyEye second={now.getSeconds()} phase={2} />
              </View>
            ) : (
              <View style={styles.sleepingFace}>
                <View style={styles.sleepingEye} />
                <View style={styles.sleepingEye} />
                <View style={styles.sleepingSmile} />
              </View>
            )}
            <Text style={styles.faceCaption}>{midnightMode ? 'still up?' : 'back at midnight'}</Text>
          </View>

          <View style={styles.timeBlock}>
            <Text
              style={styles.time}
              accessibilityLabel={`${hours} hours, ${minutes} minutes, ${seconds} seconds`}
            >
              <Text>{hours}</Text>
              <Text style={styles.timeColon}>:</Text>
              <Text>{minutes}</Text>
              <Text style={styles.timeColon}>:</Text>
              <Text style={styles.seconds}>{seconds}</Text>
            </Text>
            <Text style={styles.date}>{dateLabel}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerRule} />
          <Text style={styles.footerText}>A LITTLE MORE AWAKE AFTER DARK</Text>
          <Text style={styles.footerIndex}>00 — 01</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F3EC',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 14,
    paddingBottom: 18,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordmark: {
    color: '#152A2D',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0,
  },
  localLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  localDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D85B42',
  },
  localText: {
    color: '#536563',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  modeRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: '#536563',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  modePill: {
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#E4E6DD',
  },
  modePillAwake: {
    backgroundColor: '#F6D86E',
  },
  modeText: {
    color: '#536563',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  modeTextAwake: {
    color: '#152A2D',
  },
  clockFace: {
    width: 252,
    height: 252,
    borderRadius: 126,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  clockFaceAwake: {
    backgroundColor: '#F6D86E',
    borderColor: '#D8B843',
  },
  clockFaceResting: {
    backgroundColor: '#E5E8DF',
    borderColor: '#D6DCD1',
  },
  faceLabelRow: {
    position: 'absolute',
    top: 23,
    left: 28,
    right: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faceLabel: {
    color: '#152A2D',
    fontSize: 14,
    fontWeight: '900',
  },
  faceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D85B42',
  },
  eyesRow: {
    flexDirection: 'row',
    gap: 13,
    marginBottom: 9,
  },
  eye: {
    width: 72,
    height: 84,
    borderRadius: 38,
    backgroundColor: '#FFFEF8',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E9E1C7',
  },
  pupil: {
    width: 27,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#152A2D',
  },
  sleepingFace: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  sleepingEye: {
    width: 25,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#697B72',
  },
  sleepingSmile: {
    position: 'absolute',
    top: 20,
    left: 34,
    width: 14,
    height: 7,
    borderBottomWidth: 2,
    borderColor: '#697B72',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  faceCaption: {
    color: '#152A2D',
    fontFamily: 'serif',
    fontSize: 15,
    fontStyle: 'italic',
  },
  timeBlock: {
    alignItems: 'center',
    gap: 7,
  },
  time: {
    color: '#152A2D',
    fontSize: 54,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0,
  },
  timeColon: {
    color: '#D85B42',
  },
  seconds: {
    color: '#536563',
    fontSize: 39,
    fontWeight: '500',
  },
  date: {
    color: '#536563',
    fontFamily: 'serif',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerRule: {
    height: 1,
    flex: 1,
    backgroundColor: '#CBD2C9',
  },
  footerText: {
    color: '#697B72',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  footerIndex: {
    color: '#D85B42',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});