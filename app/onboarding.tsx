import { Ionicons } from '@expo/vector-icons';
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
import Animated, {
  Easing, useAnimatedStyle, withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandIntro from '../components/onboarding/BrandIntro';
import OpeningScene from '../components/onboarding/OpeningScene';
import SimpleSlide from '../components/onboarding/SimpleSlide';

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  kind: 'hero' | 'simple';
  variant?: 'burger' | 'bag' | 'default';
};

const APP_BG = '#0D1A63';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_SECONDARY = 'rgba(255,255,255,0.78)';
const DOT_INACTIVE = 'rgba(255,255,255,0.22)';

type DotProps = {
  active:boolean;
};

function PaginationDot({active} : DotProps){
  const animatedStyle = useAnimatedStyle(() =>{
    return{
      width:withTiming(active ? 26 : 8,{
        duration:260,
        easing:Easing.out(Easing.cubic),
      }),
      opacity:withTiming(active ? 1 : 0.9,{
        duration:220,
        easing:Easing.out(Easing.cubic),
      }),
      transform:[
        {
          scale:withTiming(active ? 1 : 0.95,{
            duration:220,
            easing:Easing.out(Easing.cubic),
          }),
        },
      ],
    };
  },[active]);

  return(
    <Animated.View
    style={[
      styles.dot,
      animatedStyle,
      {
        backgroundColor:active ? TEXT_PRIMARY : DOT_INACTIVE,
      },
    ]}
    />
  );
}

export default function OnBoardingScreen() {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const[showBrandIntro,setShowBrandIntro]=useState(true);

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
        variant:'burger',
        title: 'Find good food nearby',
        subtitle:
          'Discover surplus meals from local businesses in a simple and fast way.',
      },
      {
        id: '3',
        kind: 'simple',
        variant:'bag',
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

  if(showBrandIntro){
    return(
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{headerShown:false}} />
        <BrandIntro onFinish={() => setShowBrandIntro(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={handleSkip} hitSlop={10} style={styles.skipTopButton}>
            <Text style = {styles.skipTopText}>Skip</Text>
          </Pressable>
        </View>

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
                <SimpleSlide 
                title={item.title}
                 subtitle={item.subtitle}
                 variant={item.variant ?? 'default'} />
              )}
            </View>
          )}
        />

        <View style={styles.footer}>
          <View style={styles.dotsRow}>
            {slides.map((slide, index) => (
              <PaginationDot key={slide.id} active={index === currentIndex} />
            ))}
            </View>
             
             <View style={styles.bottomRow}>
              <View style={styles.footerSpacer} />

              <Pressable onPress={handleNext} style={styles.arrowButton}>
                <Ionicons
                name={currentIndex === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
                size={22}
                color={APP_BG}
                />
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
  topBar:{
    paddingTop:6,
    paddingHorizontal:24,
    alignItems:'flex-end',
  },
  skipTopButton:{
    paddingVertical:6,
    paddingHorizontal:4,
  },
  skipTopText:{
    color:'rgba(255,255,255,0.72)',
    fontSize:15,
    fontFamily:'Nunito_700Bold',
  },
  slide: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  heroTop: {
    flex: 0.60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: {
    flex: 0.40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
  },
  title: {
    color: TEXT_PRIMARY,
    fontSize: 30,
    lineHeight: 37,
    textAlign: 'center',
    maxWidth: 325,
    fontFamily:'Nunito_800ExtraBold',
  },
  subtitle: {
    color: TEXT_SECONDARY,
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 320,
    fontFamily:'Nunito_500Medium',
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
  bottomRow:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  footerSpacer:{
    width:52,
  },
  arrowButton:{
    width:58,
    height:58,
    borderRadius:999,
    backgroundColor:'#FFFFFF',
    alignItems:'center',
    justifyContent:'center',
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