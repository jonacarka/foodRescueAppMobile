import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type RoleKey = "CUSTOMER" | "BUSINESS" | "NGO" | "COURIER";

const COLORS = {
  bg: "#F7F5F0",
  card: "#FFFFFF",
  cardSelected: "#EEF2FF",
  border: "#D9DEE8",
  borderSelected: "#172554",
  text: "#0F172A",
  muted: "#667085",
  primary: "#172C8C",
  white: "#FFFFFF",
};

const ROLES: {
  key: RoleKey;
  title: string;
  subtitle: string;
  image: any;
}[] = [
  {
    key: "CUSTOMER",
    title: "Client",
    subtitle: "Save good food nearby",
    image: require("@/assets/images/onboarding/auth/customer.png"),
  },
  {
    key: "BUSINESS",
    title: "Business",
    subtitle: "Share surplus food easily",
    image: require("@/assets/images/onboarding/auth/business.png"),
  },
  {
    key: "NGO",
    title: "NGO",
    subtitle: "Support food redistribution",
    image: require("@/assets/images/onboarding/auth/ngo.png"),
  },
  {
    key: "COURIER",
    title: "Courier",
    subtitle: "Help deliver rescued food",
    image: require("@/assets/images/onboarding/auth/courier.png"),
  },
];

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<RoleKey>("CUSTOMER");

  const selectedItem = useMemo(
    () => ROLES.find((item) => item.key === selectedRole),
    [selectedRole]
  );

  const handleContinue = () => {
    // Ketu fut logjiken tende ekzistuese
    // psh ruajtja e role ne storage dhe pastaj navigimi
    router.push("/(auth)/register");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose your role</Text>
          <Text style={styles.subtitle}>Pick one to continue</Text>
        </View>

        <View style={styles.cardsWrap}>
          {ROLES.map((item) => {
            const isSelected = item.key === selectedRole;

            return (
              <Pressable
                key={item.key}
                onPress={() => setSelectedRole(item.key)}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                ]}
              >
                <View style={styles.cardText}>
                  <Text
                    style={[
                      styles.cardTitle,
                      isSelected && styles.cardTitleSelected,
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>

                <Image
                  source={item.image}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInLink}>Sign in</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 8,
    marginBottom: 18,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 17,
    lineHeight: 25,
    color: COLORS.muted,
    fontWeight: "500",
  },
  cardsWrap: {
    gap: 14,
    marginBottom: 22,
  },
  card: {
    minHeight: 128,
    borderRadius: 28,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingLeft: 20,
    paddingRight: 14,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardSelected: {
    backgroundColor: COLORS.cardSelected,
    borderColor: COLORS.borderSelected,
  },
  cardText: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  cardTitleSelected: {
    color: COLORS.primary,
  },
  cardSubtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.muted,
    fontWeight: "500",
    maxWidth: 170,
  },
  cardImage: {
    width: 118,
    height: 96,
  },
  primaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#1E3192",
    alignItems: "center",
    justifyContent: "center",
    marginTop:8,
    marginBottom: 14,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
  },
  signInText: {
    textAlign: "center",
    fontSize: 16,
    color: COLORS.muted,
    fontWeight: "500",
  },
  signInLink: {
    color: COLORS.primary,
    fontWeight: "800",
  },
});