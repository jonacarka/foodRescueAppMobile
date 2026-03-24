import { PublicAppRole } from "@/types/auth-flow";
import { setPendingRole } from "@/utils/authFlowStorage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const COLORS = {
  bg: "#F8F6F1",
  text: "#111827",
  muted: "#6B7280",
  primary: "#0D1A63",
  primarySoft: "#E9EEFF",
  white: "#FFFFFF",
  border: "#D9E2F2",
};

const ngoImage = require("@/assets/images/onboarding/auth/business.png");
const courierImage = require("@/assets/images/onboarding/auth/customer.png");

type RoleCardProps = {
  title: string;
  subtitle: string;
  image: any;
  active: boolean;
  onPress: () => void;
};

function RoleCard({ title, subtitle, image, active, onPress }: RoleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, active && styles.cardActive]}
    >
      <View style={styles.left}>
        <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>
          {title}
        </Text>
        <Text
          style={[styles.cardSubtitle, active && styles.cardSubtitleActive]}
        >
          {subtitle}
        </Text>
      </View>

      <Image source={image} style={styles.cardImage} resizeMode="contain" />
    </Pressable>
  );
}

export default function MoreRolesScreen() {
  const [selectedRole, setSelectedRole] = useState<PublicAppRole>("NGO");

  async function handleContinue() {
    await setPendingRole(selectedRole);
    router.push("/(auth)/register");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.hero}>
          <Text style={styles.title}>More ways to join Replate</Text>
          <Text style={styles.subtitle}>
            Choose a role that matches how you want to support the platform.
          </Text>
        </View>

        <RoleCard
          title="NGO"
          subtitle="Help redistribute food where it matters most."
          image={ngoImage}
          active={selectedRole === "NGO"}
          onPress={() => setSelectedRole("NGO")}
        />

        <RoleCard
          title="Courier"
          subtitle="Support deliveries with speed and purpose."
          image={courierImage}
          active={selectedRole === "COURIER"}
          onPress={() => setSelectedRole("COURIER")}
        />

        <Pressable onPress={handleContinue} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Get started</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLink}>Sign in</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    marginBottom: 10,
  },
  backText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 15,
  },
  hero: {
    marginBottom: 22,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    color: COLORS.text,
    maxWidth: 310,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
    maxWidth: 320,
  },
  card: {
    minHeight: 170,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    padding: 18,
    marginBottom: 16,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  cardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  left: {
    zIndex: 2,
    maxWidth: "58%",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  cardTitleActive: {
    color: COLORS.primary,
  },
  cardSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.muted,
  },
  cardSubtitleActive: {
    color: COLORS.primary,
  },
  cardImage: {
    position: "absolute",
    right: 8,
    bottom: 0,
    width: 145,
    height: 145,
  },
  primaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },
  footerText: {
    marginTop: 18,
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 14,
  },
  footerLink: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});