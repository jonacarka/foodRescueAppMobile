import React, { useEffect, useMemo } from "react";
import { ImageSourcePropType, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const plateSource = require('@/assets/images/onboarding/plate3.png');

const letters:{
    key:string;
    source:ImageSourcePropType;
    width:number;
    height:number;
}[]=[
    { key:'R',source:require('@/assets/images/onboarding/letters/r.png'),width:62,height:86},
    { key:'e1',source:require('@/assets/images/onboarding/letters/e.png'),width:44,height:64},
    { key:'P',source:require('@/assets/images/onboarding/letters/p.png'),width:50,height:78},
    { key:'L',source:require('@/assets/images/onboarding/letters/l.png'),width:28,height:78},
    { key:'A',source:require('@/assets/images/onboarding/letters/a.png'),width:50,height:64},
    { key:'T',source:require('@/assets/images/onboarding/letters/t.png'),width:34,height:74},
    { key:'e2',source:require('@/assets/images/onboarding/letters/e1.png'),width:44,height:64},
];

const PLATE_DROP_START =-220;
const LETTER_DROP_START =-180;

export default function OpeningScene(){
    const{width} = useWindowDimensions();

    const sceneWidth = Math.min(width -40,390);
    const sceneHeight = 380;

    const plate1Y = useSharedValue(PLATE_DROP_START);
    const plate2Y = useSharedValue(PLATE_DROP_START);
    const plate3Y = useSharedValue(PLATE_DROP_START);

     const plate1Opacity = useSharedValue(0);
  const plate2Opacity = useSharedValue(0);
  const plate3Opacity = useSharedValue(0);

  const letterY = letters.map(() => useSharedValue(LETTER_DROP_START));
  const letterOpacity = letters.map(() => useSharedValue(0));
  const letterScale = letters.map(() => useSharedValue(0.92));

  const letterPositions = useMemo(() => {
    const gap = 4;
    const totalWidth =
      letters.reduce((sum, item) => sum + item.width, 0) + gap * (letters.length - 1);

    const startX = (sceneWidth - totalWidth) / 2;

    // Shkronjat më lart, mbi pjatën e fundit
    const baseY = 128;

    let currentX = startX;

    return letters.map((item) => {
      const left = currentX;
      currentX += item.width + gap;

      return {
        left,
        top: baseY,
        width: item.width,
        height: item.height,
      };
    });
  }, [sceneWidth]);

  useEffect(() => {
    plate1Opacity.value = withDelay(80, withTiming(1, { duration: 240 }));
    plate1Y.value = withDelay(
      80,
      withSpring(0, {
        damping: 18,
        stiffness: 135,
        mass: 1,
      })
    );

    plate2Opacity.value = withDelay(360, withTiming(1, { duration: 240 }));
    plate2Y.value = withDelay(
      360,
      withSpring(0, {
        damping: 18,
        stiffness: 135,
        mass: 1,
      })
    );

    plate3Opacity.value = withDelay(650, withTiming(1, { duration: 240 }));
    plate3Y.value = withDelay(
      650,
      withSpring(0, {
        damping: 18,
        stiffness: 135,
        mass: 1,
      })
    );

    letters.forEach((_, index) => {
      const delay = 1080 + index * 110;

      letterOpacity[index].value = withDelay(
        delay,
        withTiming(1, {
          duration: 180,
          easing: Easing.out(Easing.quad),
        })
      );

      letterY[index].value = withDelay(
        delay,
        withSpring(0, {
          damping: 20,
          stiffness: 170,
          mass: 0.95,
        })
      );

      letterScale[index].value = withDelay(
        delay,
        withTiming(1, {
          duration: 220,
          easing: Easing.out(Easing.quad),
        })
      );
    });
  }, [letterOpacity, letterScale, letterY, plate1Opacity, plate1Y, plate2Opacity, plate2Y, plate3Opacity, plate3Y]);

  const plate1Style = useAnimatedStyle(() => ({
    opacity: plate1Opacity.value,
    transform: [{ translateY: plate1Y.value }, { rotate: '-3deg' }],
  }));

  const plate2Style = useAnimatedStyle(() => ({
    opacity: plate2Opacity.value,
    transform: [{ translateY: plate2Y.value }, { rotate: '1.2deg' }],
  }));

  const plate3Style = useAnimatedStyle(() => ({
    opacity: plate3Opacity.value,
    transform: [{ translateY: plate3Y.value }, { rotate: '-1deg' }],
  }));

  return (
    <View style={[styles.scene, { width: sceneWidth, height: sceneHeight }]}>
      {/* Pjata e poshtme */}
      <Animated.Image
        source={plateSource}
        resizeMode="contain"
        style={[
          styles.plate,
          {
            width: sceneWidth * 0.82,
            height: sceneWidth * 0.40,
            left: sceneWidth * 0.09,
            top: 166,
            zIndex: 1,
          },
          plate1Style,
        ]}
      />

      {/* Pjata e mesit */}
      <Animated.Image
        source={plateSource}
        resizeMode="contain"
        style={[
          styles.plate,
          {
            width: sceneWidth * 0.70,
            height: sceneWidth * 0.34,
            left: sceneWidth * 0.15,
            top: 126,
            zIndex: 2,
          },
          plate2Style,
        ]}
      />

      {/* Pjata e sipërme */}
      <Animated.Image
        source={plateSource}
        resizeMode="contain"
        style={[
          styles.plate,
          {
            width: sceneWidth * 0.58,
            height: sceneWidth * 0.29,
            left: sceneWidth * 0.21,
            top: 88,
            zIndex: 3,
          },
          plate3Style,
        ]}
      />

      {letters.map((letter, index) => {
        const animatedLetterStyle = useAnimatedStyle(() => ({
          opacity: letterOpacity[index].value,
          transform: [
            { translateY: letterY[index].value },
            { scale: letterScale[index].value },
          ],
        }));

        const position = letterPositions[index];

        return (
          <Animated.Image
            key={letter.key}
            source={letter.source}
            resizeMode="contain"
            style={[
              styles.letter,
              {
                width: position.width,
                height: position.height,
                left: position.left,
                top: position.top,
                zIndex: 10 + index,
              },
              animatedLetterStyle,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plate: {
    position: 'absolute',
  },
  letter: {
    position: 'absolute',
  },
});