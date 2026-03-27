import AuthShell from "@/components/auth/AuthShell";
import { authService } from "@/services/authService";
import { UserRole } from "@/types/auth";
import { getPendingRole } from "@/utils/authFlowStorage";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const COLORS = {
  textDark: "#111827",
  textMuted: "#7B8190",
  line: "#D8DEEA",
  primary: "#163BB8",
  blackButton: "#0E1016",
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
    <AuthShell activeTab="signup">
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>Full name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
          autoCapitalize="words"
        />
      </View>

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
            placeholder="Create your password"
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

      <Text style={styles.metaText}>8+ characters</Text>

      <Pressable
        onPress={handleRegister}
        disabled={!isValid || loading}
        style={[
          styles.primaryButton,
          (!isValid || loading) && styles.primaryButtonDisabled,
        ]}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? "Creating..." : "Create account"}
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
  metaText: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    marginTop: 2,
    marginBottom: 18,
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