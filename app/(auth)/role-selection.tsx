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

const clientImage = require("@/assets/images/onboarding/auth/customer.png");
const businessImage = require("@/assets/images/onboarding/auth/business.png");

type MainRoleCardProps = {
  title: string;
  subtitle: string;
  image: any;
  active: boolean;
  onPress: () => void;
};

function MainRoleCard({
  title,
  subtitle,
  image,
  active,
  onPress,
}: MainRoleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, active && styles.cardActive]}
    >
      <View style={styles.cardTextArea}>
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

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<PublicAppRole>("CUSTOMER");

  async function handleGetStarted() {
    await setPendingRole(selectedRole);
    router.push("/(auth)/register");
  }

  async function handleMoreRoles() {
    await setPendingRole(selectedRole);
    router.push("/(auth)/more-roles");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.title}>Choose how you’ll use Replate</Text>
          <Text style={styles.subtitle}>
            Pick the experience that fits you best. You can continue in seconds.
          </Text>
        </View>

        <MainRoleCard
          title="Client"
          subtitle="Discover and save surplus food nearby."
          image={clientImage}
          active={selectedRole === "CUSTOMER"}
          onPress={() => setSelectedRole("CUSTOMER")}
        />

        <MainRoleCard
          title="Business"
          subtitle="Offer surplus food in a simple, smart way."
          image={businessImage}
          active={selectedRole === "BUSINESS"}
          onPress={() => setSelectedRole("BUSINESS")}
        />

        <Pressable onPress={handleMoreRoles} style={styles.moreRolesButton}>
          <Text style={styles.moreRolesText}>More roles</Text>
        </Pressable>

        <Pressable onPress={handleGetStarted} style={styles.primaryButton}>
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
    paddingTop: 24,
    paddingBottom: 36,
  },
  hero: {
    marginBottom: 22,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    color: COLORS.text,
    maxWidth: 300,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
    maxWidth: 320,
  },
  card: {
    minHeight: 180,
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
  cardTextArea: {
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
    width: 150,
    height: 150,
  },
  moreRolesButton: {
    alignSelf: "center",
    marginTop: 4,
    marginBottom: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  moreRolesText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  primaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
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