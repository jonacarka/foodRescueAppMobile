import AuthShell from "@/components/auth/AuthShell";
import { authService } from "@/services/authService";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const COLORS = {
  textDark: "#111827",
  textMuted: "#7B8190",
  line: "#D8DEEA",
  primary: "#163BB8",
  blackButton: "#0E1016",
  white: "#FFFFFF",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => {
    return /\S+@\S+\.\S+/.test(email.trim()) && password.trim().length > 0;
  }, [email, password]);

  async function handleLogin() {
    if (!isValid || loading) return;

    try {
      setLoading(true);

      await authService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      router.replace("/(customer)" as any);
    } catch (error: any) {
      Alert.alert("Login failed", error?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell activeTab="login">
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>Email address</Text>
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

      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>Password</Text>
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
      </View>

      <Pressable onPress={() => router.push("/(auth)/forgot-password" as any)}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </Pressable>

      <Pressable
        onPress={handleLogin}
        disabled={!isValid || loading}
        style={[
          styles.primaryButton,
          (!isValid || loading) && styles.primaryButtonDisabled,
        ]}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </Pressable>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  input: {
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    color: COLORS.textDark,
    fontSize: 16,
    paddingHorizontal: 2,
    backgroundColor: "transparent",
  },
  passwordWrap: {
    minHeight: 54,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passwordInput: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 16,
    paddingVertical: 10,
    paddingRight: 12,
  },
  toggleText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  forgotText: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 22,
  },
  primaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.blackButton,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },
});