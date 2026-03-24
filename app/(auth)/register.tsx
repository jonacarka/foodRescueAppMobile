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
  card: "#FFFFFF",
  textDark: "#111827",
  textMuted: "#6B7280",
  border: "#D9E2F2",
  primary: "#163BB8",
  white: "#FFFFFF",
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

      router.push(`/(auth)/verify-email?email=${encodeURIComponent(result.email)}` as any);
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
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.hero}>
            <Text style={styles.badge}>Replate</Text>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              You’re joining as <Text style={styles.roleText}>{selectedRole}</Text>.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
            />

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

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a secure password"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)}>
                <Text style={styles.toggleText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </Pressable>
            </View>

            <Text style={styles.hint}>
              Use at least 8 characters, including uppercase, lowercase, and a number.
            </Text>

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
    paddingBottom: 32,
  },
  hero: {
    paddingTop: 34,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  badge: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    opacity: 0.9,
  },
  title: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
  roleText: {
    fontWeight: "800",
    color: COLORS.white,
  },
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    borderRadius: 28,
    padding: 20,
  },
  label: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    color: COLORS.textDark,
    fontSize: 15,
    backgroundColor: COLORS.white,
  },
  passwordWrap: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
  },
  passwordInput: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 15,
    paddingVertical: 14,
    paddingRight: 12,
  },
  toggleText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  hint: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 10,
    marginBottom: 18,
  },
  primaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
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
    fontWeight: "700",
  },
});