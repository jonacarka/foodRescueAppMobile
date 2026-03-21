import React, { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

const bagFullSource = require("@/assets/images/onboarding/bag/bagFull.png");

export default function BagScene() {
  const { width } = useWindowDimensions();

  const sceneWidth = Math.min(width - 48, 340);
  const sceneHeight = 320;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(22);
  const floatY = useSharedValue(0);
  const floatX = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(120, withTiming(1, { duration: 320 }));

    translateY.value = withDelay(
      120,
      withTiming(0, {
        duration: 700,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      })
    );

    floatY.value = withDelay(
      950,
      withRepeat(
        withSequence(
          withTiming(-6, {
            duration: 1900,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(6, {
            duration: 1900,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        true
      )
    );

    floatX.value = withDelay(
      950,
      withRepeat(
        withSequence(
          withTiming(-3, {
            duration: 2100,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(3, {
            duration: 2100,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        true
      )
    );

    rotate.value = withDelay(
      950,
      withRepeat(
        withSequence(
          withTiming(-1.2, {
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(1.2, {
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value + floatY.value },
      { translateX: floatX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <View style={[styles.scene, { width: sceneWidth, height: sceneHeight }]}>
      <Animated.Image
        source={bagFullSource}
        resizeMode="contain"
        style={[
          styles.bag,
          {
            width: sceneWidth * 0.72,
            height: sceneWidth * 0.78,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    alignItems: "center",
    justifyContent: "center",
  },
  bag: {
    alignSelf: "center",
  },
});