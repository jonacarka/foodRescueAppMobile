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

const plateSource = require("@/assets/images/onboarding/platefinalFinal.png");

const PLATE_DROP_START = -260;

export default function OpeningScene() {
  const { width } = useWindowDimensions();

  const sceneWidth = Math.min(width - 32, 400);
  const sceneHeight = 390;

  const plate1Y = useSharedValue(PLATE_DROP_START);
  const plate2Y = useSharedValue(PLATE_DROP_START);
  const plate3Y = useSharedValue(PLATE_DROP_START);

  const plate1Opacity = useSharedValue(0);
  const plate2Opacity = useSharedValue(0);
  const plate3Opacity = useSharedValue(0);

  const plate1FloatX = useSharedValue(0);
  const plate2FloatX = useSharedValue(0);
  const plate3FloatX = useSharedValue(0);

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
          withTiming(-7, {
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(7, {
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        true
      )
    );

    plate2FloatX.value = withDelay(
      1280,
      withRepeat(
        withSequence(
          withTiming(6, {
            duration: 1950,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(-6, {
            duration: 1950,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        true
      )
    );

    plate3FloatX.value = withDelay(
      1360,
      withRepeat(
        withSequence(
          withTiming(-5, {
            duration: 1850,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(5, {
            duration: 1850,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        true
      )
    );
  }, [
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
    transform: [
      { translateY: plate1Y.value },
      { translateX: plate1FloatX.value },
      { rotate: "7.5deg" },
    ],
  }));

  const plate2Style = useAnimatedStyle(() => ({
    opacity: plate2Opacity.value,
    transform: [
      { translateY: plate2Y.value },
      { translateX: plate2FloatX.value },
      { rotate: "14.5deg" },
    ],
  }));

  const plate3Style = useAnimatedStyle(() => ({
    opacity: plate3Opacity.value,
    transform: [
      { translateY: plate3Y.value },
      { translateX: plate3FloatX.value },
      { rotate: "-5.5deg" },
    ],
  }));

  return (
    <View style={[styles.scene, { width: sceneWidth, height: sceneHeight }]}>
      <Animated.Image
        source={plateSource}
        resizeMode="contain"
        style={[
          styles.plate,
          {
            width: sceneWidth * 0.84,
            height: sceneWidth * 0.40,
            left: sceneWidth * 0.08,
            top: 208,
            zIndex: 1,
          },
          plate1Style,
        ]}
      />

      <Animated.Image
        source={plateSource}
        resizeMode="contain"
        style={[
          styles.plate,
          {
            width: sceneWidth * 0.67,
            height: sceneWidth * 0.32,
            left: sceneWidth * 0.14,
            top: 146,
            zIndex: 2,
          },
          plate2Style,
        ]}
      />

      <Animated.Image
        source={plateSource}
        resizeMode="contain"
        style={[
          styles.plate,
          {
            width: sceneWidth * 0.50,
            height: sceneWidth * 0.24,
            left: sceneWidth * 0.23,
            top: 92,
            zIndex: 3,
          },
          plate3Style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  plate: {
    position: "absolute",
  },
});