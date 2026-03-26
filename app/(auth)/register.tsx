import { authService } from "@/services/authService";
import { UserRole } from "@/types/auth";
import { getPendingRole } from "@/utils/authFlowStorage";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const COLORS = {
  bg: "#0D1A63",
  surface: "#F8F8FB",
  inputBg: "#FFFFFF",
  textDark: "#111827",
  textMuted: "#6B7280",
  border: "#D9E2F2",
  primary: "#163BB8",
  primarySoft: "#6F83D6",
  white: "#FFFFFF",
  badgeBg: "rgba(255,255,255,0.10)",
  badgeBorder: "rgba(255,255,255,0.18)",
  badgeText: "#F5F7FF",
};

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("CUSTOMER");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPendingRole().then((role) => {
      if (role) setSelectedRole(role);
    });
  }, []);

  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password);

  const isValid = useMemo(() => {
    return (
      fullName.trim().length >= 2 &&
      /\S+@\S+\.\S+/.test(email.trim()) &&
      passwordValid
    );
  }, [fullName, email, password, passwordValid]);

  function formatRole(role: UserRole) {
    switch (role) {
      case "CUSTOMER":
        return "Customer";
      case "BUSINESS":
        return "Business";
      case "NGO":
        return "NGO";
      case "COURIER":
        return "Courier";
      case "ADMIN":
        return "Admin";
      default:
        return role;
    }
  }

  async function handleRegister() {
    if (!isValid || loading) return;

    try {
      setLoading(true);

      const result = await authService.register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: selectedRole,
      });

      router.push(
        `/(auth)/verify-email?email=${encodeURIComponent(result.email)}` as any
      );
    } catch (error: any) {
      Alert.alert("Register failed", error?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.brand}>Replate</Text>

            <View style={styles.headingBlock}>
              <Text style={styles.title}>Create account</Text>

              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{formatRole(selectedRole)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>

              <View style={styles.passwordWrap}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create your password"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPassword}
                  style={styles.passwordInput}
                />

                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={10}
                >
                  <Text style={styles.toggleText}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.hint}>8+ chars, upper, lower, number</Text>
            </View>

            <Pressable
              onPress={handleRegister}
              disabled={!isValid || loading}
              style={[
                styles.primaryButton,
                (!isValid || loading) && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Creating account..." : "Create account"}
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text style={styles.footerLink}>Sign in</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  hero: {
    paddingTop: 26,
    paddingHorizontal: 24,
    paddingBottom: 22,
  },
  brand: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
    opacity: 0.96,
    marginBottom: 18,
  },
  headingBlock: {
    gap: 12,
  },
  title: {
    color: COLORS.white,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    maxWidth: 260,
  },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.badgeBg,
    borderWidth: 1,
    borderColor: COLORS.badgeBorder,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  roleBadgeText: {
    color: COLORS.badgeText,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
  },

  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    height: 58,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    color: COLORS.textDark,
    fontSize: 15,
    backgroundColor: COLORS.inputBg,
  },
  passwordWrap: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: COLORS.inputBg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passwordInput: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 15,
    paddingVertical: 15,
    paddingRight: 12,
  },
  toggleText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  hint: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    marginTop: 8,
    marginLeft: 2,
  },

  primaryButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
  },

  footerText: {
    textAlign: "center",
    marginTop: 18,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: COLORS.primary,
    fontWeight: "800",
  },
});