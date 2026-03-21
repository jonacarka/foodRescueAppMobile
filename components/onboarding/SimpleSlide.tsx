import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BagScene from "./BagScene";
import BurgerScene from "./BurgerScene";

type Props = {
  title: string;
  subtitle: string;
  variant?: "burger" | "bag" | "default";
};

const CARD_BG = "rgba(255,255,255,0.08)";
const TEXT_PRIMARY = "#FFFFFF";
const TEXT_SECONDARY = "rgba(255,255,255,0.78)";

export default function SimpleSlide({
  title,
  subtitle,
  variant = "default",
}: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.illustration}>
        {variant === "burger" ? (
          <BurgerScene />
        ) : variant === "bag" ? (
            <BagScene/>
        ):(
          <>
            <View style={styles.circleLarge} />
            <View style={styles.circleSmall} />
            <View style={styles.card} />
          </>
        )}
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  illustration: {
    width: 290,
    height: 290,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  circleLarge: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  circleSmall: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  card: {
    width: 136,
    height: 172,
    borderRadius: 28,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  textBlock: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  title: {
    color: TEXT_PRIMARY,
    fontSize: 30,
    lineHeight: 37,
    textAlign: "center",
    maxWidth: 320,
    fontFamily: "Nunito_800ExtraBold",
  },
  subtitle: {
    color: TEXT_SECONDARY,
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 320,
    fontFamily: "Nunito_500Medium",
  },
});