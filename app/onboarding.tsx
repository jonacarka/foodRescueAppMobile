import { router, Stack } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OpeningScene from '../components/onboarding/OpeningScene';
import SimpleSlide from '../components/onboarding/SimpleSlide';

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  kind: 'hero' | 'simple';
};

const APP_BG = '#0D1A63';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_SECONDARY = 'rgba(255,255,255,0.78)';
const DOT_INACTIVE = 'rgba(255,255,255,0.24)';

export default function OnBoardingScreen() {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = useMemo<Slide[]>(
    () => [
      {
        id: '1',
        kind: 'hero',
        title: 'Give every meal a second plate',
        subtitle: 'Surplus food finds a new place instead of going to waste.',
      },
      {
        id: '2',
        kind: 'simple',
        title: 'Find good food nearby',
        subtitle:
          'Discover surplus meals from local businesses in a simple and fast way.',
      },
      {
        id: '3',
        kind: 'simple',
        title: 'Save more, waste less',
        subtitle:
          'Pick up quality food, save money, and help reduce food waste every day.',
      },
    ],
    []
  );

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      listRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      return;
    }

    router.replace('/(auth)/login' as never);
  };

  const handleSkip = () => {
    router.replace('/(auth)/register' as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <FlatList
          ref={listRef}
          data={slides}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={onScrollEnd}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}>
              {item.kind === 'hero' ? (
                <>
                  <View style={styles.heroTop}>
                    <OpeningScene />
                  </View>

                  <View style={styles.textBlock}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                  </View>
                </>
              ) : (
                <SimpleSlide title={item.title} subtitle={item.subtitle} />
              )}
            </View>
          )}
        />

        <View style={styles.footer}>
          <View style={styles.dotsRow}>
            {slides.map((slide, index) => {
              const active = index === currentIndex;

              return (
                <View
                  key={slide.id}
                  style={[
                    styles.dot,
                    {
                      width: active ? 26 : 8,
                      backgroundColor: active ? TEXT_PRIMARY : DOT_INACTIVE,
                    },
                  ]}
                />
              );
            })}
          </View>

          <View style={styles.actionsRow}>
            <Pressable onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>

            <Pressable onPress={handleNext} style={styles.nextButton}>
              <Text style={styles.nextText}>
                {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: APP_BG,
  },
  container: {
    flex: 1,
    backgroundColor: APP_BG,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  heroTop: {
    flex: 0.58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: {
    flex: 0.42,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 6,
  },
  title: {
    color: TEXT_PRIMARY,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    textAlign: 'center',
    maxWidth: 320,
  },
  subtitle: {
    color: TEXT_SECONDARY,
    fontSize: 15.5,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 320,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 18,
    gap: 18,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 999,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  skipText: {
    color: TEXT_SECONDARY,
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    minWidth: 136,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: APP_BG,
    fontSize: 15,
    fontWeight: '800',
  },
});