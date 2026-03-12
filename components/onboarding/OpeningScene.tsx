import React, { useEffect, useMemo } from "react";
import { ImageSourcePropType, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
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
    { key:'R',source:require('@/assets/images/onboarding/letters/r.png'),width:86,height:120},
    { key:'e1',source:require('@/assets/images/onboarding/letters/e.png'),width:60,height:90},
    { key:'P',source:require('@/assets/images/onboarding/letters/p.png'),width:68,height:104},
    { key:'L',source:require('@/assets/images/onboarding/letters/l.png'),width:34,height:104},
    { key:'A',source:require('@/assets/images/onboarding/letters/a.png'),width:68,height:90},
    { key:'T',source:require('@/assets/images/onboarding/letters/t.png'),width:40,height:100},
    { key:'e2',source:require('@/assets/images/onboarding/letters/e1.png'),width:60,height:90},
];

const PLATE_DROP_START =-260;
// const LETTER_DROP_START =-180;

export default function OpeningScene(){
    const{width} = useWindowDimensions();

    const sceneWidth = Math.min(width -32,400);
    const sceneHeight = 380;

    const plate1Y = useSharedValue(PLATE_DROP_START);
    const plate2Y = useSharedValue(PLATE_DROP_START);
    const plate3Y = useSharedValue(PLATE_DROP_START);

     const plate1Opacity = useSharedValue(0);
  const plate2Opacity = useSharedValue(0);
  const plate3Opacity = useSharedValue(0);

  const plate1FloatX = useSharedValue(0);
   const plate2FloatX = useSharedValue(0);
    const plate3FloatX = useSharedValue(0);

  const letterY = useSharedValue(12);
  const letterOpacity = useSharedValue(0);
  const letterScale = useSharedValue(0.94);

  const letterPositions = useMemo(() => {
    const gap = 4;
    const totalWidth =
      letters.reduce((sum, item) => sum + item.width, 0) + gap * (letters.length - 1);

    const startX = (sceneWidth - totalWidth) / 2;

    // Shkronjat më lart, mbi pjatën e fundit
    const baseY = 86;

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
    plate1Opacity.value = withDelay(80, withTiming(1, { duration: 220 }));
    plate1Y.value = withDelay(
      80,
      withSpring(0, {
        damping: 17,
        stiffness: 135,
        mass: 1,
      })
    );

    plate2Opacity.value = withDelay(360, withTiming(1, { duration: 220 }));
    plate2Y.value = withDelay(
      360,
      withSpring(0, {
        damping: 17,
        stiffness: 135,
        mass: 1,
      })
    );

    plate3Opacity.value = withDelay(660, withTiming(1, { duration: 220 }));
    plate3Y.value = withDelay(
      660,
      withSpring(0, {
        damping: 17,
        stiffness: 135,
        mass: 1,
      })
    );

    plate1FloatX.value = withDelay(
        1200,
        withRepeat(
            withSequence(
                withTiming(-8,{duration:1800,easing:Easing.inOut(Easing.sin)}),
                withTiming(8,{duration :1800,easing: Easing.inOut(Easing.sin)})
            ),
            -1,
            true
        )
    );

     plate2FloatX.value = withDelay(
        1280,
        withRepeat(
            withSequence(
                withTiming(7,{duration:2000,easing:Easing.inOut(Easing.sin)}),
                withTiming(-7,{duration :2000,easing: Easing.inOut(Easing.sin)})
            ),
            -1,
            true
        )
    );
     plate3FloatX.value = withDelay(
        1360,
        withRepeat(
            withSequence(
                withTiming(-6,{duration:1900,easing:Easing.inOut(Easing.sin)}),
                withTiming(6,{duration :1900,easing: Easing.inOut(Easing.sin)})
            ),
            -1,
            true
        )
    );

    letterOpacity.value = withDelay(
        1180,
        withTiming(1,{
            duration:420,
            easing:Easing.out(Easing.quad),
        })
    );

    letterScale.value = withDelay(
        1180,
        withTiming(1,{
            duration:420,
            easing:Easing.out(Easing.quad),
        })
    );

    letterY.value = withDelay(
        1180,
        withTiming(0,{
            duration:420,
            easing:Easing.out(Easing.quad),
        })
    );
  },[
    letterOpacity,
    letterScale,
    letterY,
    plate1FloatX,
    plate1Opacity,
    plate1Y,
    plate2FloatX,
    plate2Opacity,
    plate2Y,
    plate3FloatX,
    plate3Opacity,
    plate3Y,

  ]);

  const plate1Style = useAnimatedStyle(() => ({
    opacity: plate1Opacity.value,
    transform: [{ translateY: plate1Y.value }, 
        {translateX:plate1FloatX.value},
        {rotate:'-2deg'},
    ],
  }));

  const plate2Style = useAnimatedStyle(() => ({
    opacity: plate2Opacity.value,
    transform: [{ translateY: plate2Y.value }, 
        {translateX:plate2FloatX.value},
        { rotate: '1deg' }],
  }));

  const plate3Style = useAnimatedStyle(() => ({
    opacity: plate3Opacity.value,
    transform: [{ translateY: plate3Y.value },{
        translateX:plate3FloatX.value
    }, 
        { rotate: '-1deg' }],
  }));

  const lettersGroupStyle = useAnimatedStyle(() =>({
    opacity: letterOpacity.value,
    transform:[{translateY:letterY.value},{scale:letterScale.value}],
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
            width: sceneWidth * 0.84,
            height: sceneWidth * 0.40,
            left: sceneWidth * 0.08,
            top: 182,
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
            height: sceneWidth * 0.33,
            left: sceneWidth * 0.15,
            top: 136,
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
            width: sceneWidth * 0.56,
            height: sceneWidth * 0.27,
            left: sceneWidth * 0.22,
            top: 94,
            zIndex: 3,
          },
          plate3Style,
        ]}
      />

      <Animated.View style = {[styles.lettersGroup,lettersGroupStyle]}>
        {letters.map((letter,index) => {
            const position = letterPositions[index];

            return(
                <Animated.Image
                key={letter.key}
                source={letter.source}
                resizeMode="contain"
                style={[
                    styles.letter,
                    {
                        width:position.width,
                        height:position.height,
                        left:position.left,
                        top:position.top,
                        zIndex: 10 + index,
                    },
                ]}
                />
            );
        })}
      </Animated.View>
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
  lettersGroup:{
    ...StyleSheet.absoluteFillObject,
  },
  letter: {
    position: 'absolute',
  },
});