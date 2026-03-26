import { authService } from "@/services/authService";
import { UserRole } from "@/types/auth";
import { getPendingRole } from "@/utils/authFlowStorage";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Image,
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
  shell: "rgba(255,255,255,0.10)",
  panel: "#F7F8FC",
  card: "#FFFFFF",
  textDark: "#111827",
  textMuted: "#7B8190",
  line: "#D8DEEA",
  primary: "#163BB8",
  primarySoft: "#6E84D9",
  white: "#FFFFFF",
  blackButton: "#0E1016",
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
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.outerShell}>
            <View style={styles.topArea}>
              <View style={styles.logoWrap}>
                <Image
                  source={require("@/assets/images/onboarding/logoFinal.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={styles.bottomPanel}>
              <View style={styles.tabsRow}>
                <Pressable
                  onPress={() => router.replace("/(auth)/login")}
                  style={styles.tabButton}
                >
                  <Text style={styles.tabText}>Login</Text>
                </Pressable>

                <Pressable style={styles.tabButton}>
                  <Text style={[styles.tabText, styles.tabTextActive]}>
                    Sign up
                  </Text>
                  <View style={styles.activeLine} />
                </Pressable>
              </View>

              <View style={styles.formCard}>
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

                <Pressable onPress={() => router.replace("/(auth)/login")}>
                  <Text style={styles.footerText}>
                    Already have an account?{" "}
                    <Text style={styles.footerLink}>Login</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
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
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 14,
  },

  outerShell: {
    borderRadius: 34,
    backgroundColor: COLORS.shell,
    padding: 8,
  },

  topArea: {
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 10,
  },
  logoWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 170,
    height: 110,
  },

  bottomPanel: {
    backgroundColor: COLORS.panel,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },

  tabsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    columnGap: 34,
    marginBottom: 20,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 84,
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 18,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  tabTextActive: {
    color: COLORS.textDark,
    fontWeight: "800",
  },
  activeLine: {
    marginTop: 8,
    width: 60,
    height: 3,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },

  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },

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

  footerText: {
    marginTop: 18,
    textAlign: "center",
    color: COLORS.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: COLORS.primary,
    fontWeight: "800",
  },
});