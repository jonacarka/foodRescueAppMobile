import { authService } from "@/services/authService";
import { AuthUser } from "@/types/auth";
import { saveSession } from "@/utils/storage";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
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
  primarySoft: "#EEF4FF",
  white: "#FFFFFF",
};

function getRouteByRole(user: AuthUser) {
  switch (user.role) {
    case "BUSINESS":
      return "/(business)";
    case "CUSTOMER":
    case "NGO":
    case "COURIER":
    case "ADMIN":
    default:
      return "/(customer)";
  }
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => {
    return /\S+@\S+\.\S+/.test(email.trim()) && password.length >= 8;
  }, [email, password]);

  async function handleLogin() {
    if (!isValid || loading) return;

    try {
      setLoading(true);

      const result = await authService.login({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      });

      await saveSession({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });

      router.replace(getRouteByRole(result.user) as any);
    } catch (error: any) {
      if (error?.requiresVerification && error?.email) {
        Alert.alert(
          "Email not verified",
          "Please verify your email before signing in.",
          [
            {
              text: "Go to verification",
              onPress: () =>
                router.push({
                  pathname: "/(auth)/verify-email",
                  params: { email: error.email },
                }),
            },
            { text: "OK", style: "cancel" },
          ]
        );
        return;
      }

      Alert.alert("Login failed", error?.message || "Please try again.");
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
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue rescuing good food.
            </Text>
          </View>

          <View style={styles.card}>
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
                placeholder="Enter your password"
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

            <View style={styles.rowBetween}>
              <View style={styles.rememberRow}>
                <Switch value={rememberMe} onValueChange={setRememberMe} />
                <Text style={styles.rememberText}>Remember me</Text>
              </View>

              <Pressable>
                <Text style={styles.linkText}>Forgot password?</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={!isValid || loading}
              style={[
                styles.primaryButton,
                (!isValid || loading) && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.footerText}>
                Don&apos;t have an account?{" "}
                <Text style={styles.footerLink}>Create one</Text>
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
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 28,
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
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 300,
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
  rowBetween: {
    marginTop: 16,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  rememberText: {
    color: COLORS.textDark,
    fontSize: 14,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
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