import React, { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";

const bunTopSource = require("@/assets/images/onboarding/burger/bunTop.png");
const bunBottomSource = require("@/assets/images/onboarding/burger/bunBottom.png");
const pattySource = require("@/assets/images/onboarding/burger/patty.png");
const cheeseSource = require("@/assets/images/onboarding/burger/cheese.png");
const tomatoSource = require("@/assets/images/onboarding/burger/tomato.png");
const lettuceSource = require("@/assets/images/onboarding/burger/lettuce.png");
const onionSource = require("@/assets/images/onboarding/burger/onion.png");

const DROP_START = -240;

export default function BurgerScene(){
    const {width} = useWindowDimensions();

    const sceneWidth = Math.min(width -48,360);
    const sceneHeight = 360;

    const bunTopY =useSharedValue(DROP_START);
    const lettuceY = useSharedValue(DROP_START);
    const tomatoY = useSharedValue(DROP_START);
    const onionY = useSharedValue(DROP_START);
    const cheeseY = useSharedValue(DROP_START);
    const pattyY = useSharedValue(DROP_START);
    const bunBottomY = useSharedValue(DROP_START);

    const bunTopOpacity = useSharedValue(0);
    const lettuceOpacity = useSharedValue(0);
    const tomatoOpacity = useSharedValue(0);
    const onionOpacity = useSharedValue(0);
    const cheeseOpacity = useSharedValue(0);
    const pattyOpacity = useSharedValue(0);
    const bunBottomOpacity = useSharedValue(0);

    const bunTopFloatX = useSharedValue(0);
    const lettuceFloatX = useSharedValue(0);
    const tomatoFloatX = useSharedValue(0);
    const onionFloatX = useSharedValue(0);
    const cheeseFloatX = useSharedValue(0);
    const pattyFloatX = useSharedValue(0);
    const bunBottomFloatX = useSharedValue(0);

    const bunTopFloatY = useSharedValue(0);
     const lettuceFloatY = useSharedValue(0);
      const tomatoFloatY = useSharedValue(0);
       const onionFloatY = useSharedValue(0);
        const cheeseFloatY = useSharedValue(0);
         const pattyFloatY = useSharedValue(0);
          const bunBottomFloatY = useSharedValue(0);

          useEffect(() => {
            const animateIn = (
                yValue : any,
                opacityValue:any,
                delay:number
            ) =>{
                opacityValue.value = withDelay(delay,withTiming(1,{duration:220}));
                yValue.value = withDelay(
                    delay,
                    withSpring(0,{
                        damping:17,
                        stiffness:135,
                        mass:1,
                    })
                );
            };

            animateIn(bunTopY,bunTopOpacity,60);
            animateIn(lettuceY,lettuceOpacity,180);
            animateIn(tomatoY,tomatoOpacity,300);
            animateIn(onionY,onionOpacity,420);
            animateIn(cheeseY,cheeseOpacity,540);
            animateIn(pattyY,pattyOpacity,660);
            animateIn(bunBottomY,bunBottomOpacity,780);

            const floatLoop =(
                xValue:any,
                yValue:any,
                x1:number,
                x2:number,
                y1:number,
                y2:number,
                delay:number,
                duration:number
            ) =>{
                xValue.value = withDelay(
                    delay,
                    withRepeat(
                        withSequence(
                            withTiming(x1,{
                                duration,
                                easing:Easing.inOut(Easing.sin),
                            }),
                            withTiming(x2,{
                                duration,
                                easing:Easing.inOut(Easing.sin),
                            })
                        ),
                        -1,
                        true
                    )
                );

                yValue.value = withDelay(
                    delay,
                    withRepeat(
                        withSequence(
                            withTiming(y1,{
                                duration:duration -150,
                                easing:Easing.inOut(Easing.sin),
                            }),
                            withTiming(y2,{
                                duration:duration -150,
                                easing:Easing.inOut(Easing.sin),
                            })
                        ),
                        -1,
                        true
                    )
                );
            };

            floatLoop(bunTopFloatX, bunTopFloatY, -7, 7, -4, 4, 1100, 1800);
    floatLoop(lettuceFloatX, lettuceFloatY, 6, -6, -3, 3, 1180, 1900);
    floatLoop(tomatoFloatX, tomatoFloatY, -5, 5, -4, 4, 1260, 1750);
    floatLoop(onionFloatX, onionFloatY, 5, -5, -3, 3, 1340, 1850);
    floatLoop(cheeseFloatX, cheeseFloatY, -6, 6, -3, 3, 1420, 1800);
    floatLoop(pattyFloatX, pattyFloatY, 4, -4, -2, 2, 1500, 1950);
    floatLoop(bunBottomFloatX, bunBottomFloatY, -4, 4, -2, 2, 1580, 2000);
          },[
            bunTopY,
    lettuceY,
    tomatoY,
    onionY,
    cheeseY,
    pattyY,
    bunBottomY,
    bunTopOpacity,
    lettuceOpacity,
    tomatoOpacity,
    onionOpacity,
    cheeseOpacity,
    pattyOpacity,
    bunBottomOpacity,
    bunTopFloatX,
    lettuceFloatX,
    tomatoFloatX,
    onionFloatX,
    cheeseFloatX,
    pattyFloatX,
    bunBottomFloatX,
    bunTopFloatY,
    lettuceFloatY,
    tomatoFloatY,
    onionFloatY,
    cheeseFloatY,
    pattyFloatY,
    bunBottomFloatY,
          ]);

          const bunTopStyle = useAnimatedStyle(() =>({
            opacity:bunTopOpacity.value,
            transform:[
                {translateY : bunTopY.value + bunTopFloatY.value},
                {translateX: bunTopFloatX.value},
                {rotate:"-4deg"},
            ],
          }));

          const lettuceStyle = useAnimatedStyle(() => ({
            opacity:lettuceOpacity.value,
            transform:[
                {translateY:lettuceY.value + lettuceFloatY.value},
                {translateX:lettuceFloatX.value},
                {rotate:"3deg"},
            ],
          }));

          const tomatoStyle = useAnimatedStyle(() =>({
            opacity:tomatoOpacity.value,
            transform:[
                {translateY:tomatoY.value + tomatoFloatY.value},
                {translateX:tomatoFloatX.value},
                {rotate:"-3deg"},
            ],
          }));

          const onionStyle = useAnimatedStyle(() =>({
            opacity:onionOpacity.value,
            transform:[
                {translateY:onionY.value + onionFloatY.value},
                {translateX:onionFloatX.value},
                {rotate:"4deg"},
            ],
          }));

          const cheeseStyle = useAnimatedStyle(() =>({
            opacity:cheeseOpacity.value,
            transform:[
                {translateY:cheeseY.value + cheeseFloatY.value},
                {translateX:cheeseFloatX.value},
                {rotate:"-2deg"},
            ],
          }));

          const pattyStyle = useAnimatedStyle(() =>({
            opacity:pattyOpacity.value,
            transform:[
                {translateY:pattyY.value + pattyFloatY.value},
                {translateX:pattyFloatX.value},
                {rotate:"2deg"},
            ],
          }));

          const bunBottomStyle = useAnimatedStyle(() =>({
            opacity:bunBottomOpacity.value,
            transform:[
                {translateY:bunBottomY.value + bunBottomFloatY.value},
                {translateX:bunBottomFloatX.value},
                {rotate:"-2deg"},
            ],
          }));
return (
    <View style={[styles.scene, { width: sceneWidth, height: sceneHeight }]}>
      <Animated.Image
        source={bunBottomSource}
        resizeMode="contain"
        style={[
          styles.layer,
          {
            width: sceneWidth * 0.72,
            height: sceneWidth * 0.28,
            top: 236,
            left: sceneWidth * 0.14,
            zIndex: 1,
          },
          bunBottomStyle,
        ]}
      />

      <Animated.Image
        source={pattySource}
        resizeMode="contain"
        style={[
          styles.layer,
          {
            width: sceneWidth * 0.60,
            height: sceneWidth * 0.22,
            top: 198,
            left: sceneWidth * 0.20,
            zIndex: 2,
          },
          pattyStyle,
        ]}
      />

      <Animated.Image
        source={cheeseSource}
        resizeMode="contain"
        style={[
          styles.layer,
          {
            width: sceneWidth * 0.52,
            height: sceneWidth * 0.19,
            top: 165,
            left: sceneWidth * 0.24,
            zIndex: 3,
          },
          cheeseStyle,
        ]}
      />

      <Animated.Image
        source={onionSource}
        resizeMode="contain"
        style={[
          styles.layer,
          {
            width: sceneWidth * 0.46,
            height: sceneWidth * 0.17,
            top: 136,
            left: sceneWidth * 0.27,
            zIndex: 4,
          },
          onionStyle,
        ]}
      />

      <Animated.Image
        source={tomatoSource}
        resizeMode="contain"
        style={[
          styles.layer,
          {
            width: sceneWidth * 0.48,
            height: sceneWidth * 0.17,
            top: 105,
            left: sceneWidth * 0.26,
            zIndex: 5,
          },
          tomatoStyle,
        ]}
      />

      <Animated.Image
        source={lettuceSource}
        resizeMode="contain"
        style={[
          styles.layer,
          {
            width: sceneWidth * 0.58,
            height: sceneWidth * 0.20,
            top: 70,
            left: sceneWidth * 0.21,
            zIndex: 6,
          },
          lettuceStyle,
        ]}
      />

      <Animated.Image
        source={bunTopSource}
        resizeMode="contain"
        style={[
          styles.layer,
          {
            width: sceneWidth * 0.66,
            height: sceneWidth * 0.26,
            top: 22,
            left: sceneWidth * 0.17,
            zIndex: 7,
          },
          bunTopStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  layer: {
    position: "absolute",
  },
});
