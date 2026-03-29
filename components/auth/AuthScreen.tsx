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
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  bg: "#0D1A63",
  panel: "#F4F5F9",
  card: "#FFFFFF",
  textDark: "#111827",
  textMuted: "#6F7687",
  line: "#D4DAE6",
  primary: "#163BB8",
  primarySoft: "#0D1A63",
  buttonDisabled: "#C5CBD8",
  white: "#FFFFFF",
  danger: "#D14343",
  warning: "#E59B1F",
  success: "#22A06B",
};

type Props = {
  initialTab?: "login" | "signup";
};

export default function AuthScreen({ initialTab = "login" }: Props) {
    const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);

  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("CUSTOMER");
  const [registerLoading, setRegisterLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    getPendingRole().then((role) => {
      if (role) setSelectedRole(role);
    });
  }, []);

  const registerChecks = useMemo(() => {
    const password = registerPassword;

    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [registerPassword]);

  const registerPasswordValid =
    registerChecks.length &&
    registerChecks.upper &&
    registerChecks.lower &&
    registerChecks.number;

  const passwordStrength = useMemo(() => {
    const checksPassed = Object.values(registerChecks).filter(Boolean).length;

    if (!registerPassword.length) {
      return {
        score: 0,
        label: "",
      };
    }

    if (checksPassed <= 2) {
      return {
        score: 1,
        label: "Weak",
      };
    }

    if (checksPassed === 3 || checksPassed === 4) {
      return {
        score: 2,
        label: "Medium",
      };
    }

    return {
      score: 3,
      label: "Strong",
    };
  }, [registerChecks, registerPassword]);

  const passwordStrengthColor =
    passwordStrength.score === 1
      ? COLORS.danger
      : passwordStrength.score === 2
      ? COLORS.warning
      : passwordStrength.score === 3
      ? COLORS.success
      : COLORS.line;

  const isRegisterValid = useMemo(() => {
    return (
      fullName.trim().length >= 2 &&
      /\S+@\S+\.\S+/.test(registerEmail.trim()) &&
      registerPasswordValid
    );
  }, [fullName, registerEmail, registerPasswordValid]);

  const isLoginValid = useMemo(() => {
    return (
      /\S+@\S+\.\S+/.test(loginEmail.trim()) &&
      loginPassword.trim().length > 0
    );
  }, [loginEmail, loginPassword]);

  async function handleRegister() {
    console.log("REGISTER BUTTON PRESSED");
    if (!isRegisterValid || registerLoading) return;

    try {
      setRegisterLoading(true);

      const result = await authService.register({
        fullName: fullName.trim(),
        email: registerEmail.trim().toLowerCase(),
        password: registerPassword,
        role: selectedRole,
      });

      router.push(
        `/(auth)/verify-email?email=${encodeURIComponent(result.email)}` as any
      );
    } catch (error: any) {
      Alert.alert("Register failed", error?.message || "Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  }

  async function handleLogin() {
    if (!isLoginValid || loginLoading) return;

    try {
      setLoginLoading(true);

      await authService.login({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });

      router.replace("/(customer)" as any);
    } catch (error: any) {
      Alert.alert("Login failed", error?.message || "Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }


  return (
    <View style={styles.root}>
    <SafeAreaView style={styles.topSafe} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.screenContent}>

            <View style={styles.topArea}>
              <View style={styles.logoWrap}>
                <Image
                  source={require("@/assets/images/onboarding/logoFinal.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View 
            style={[
                styles.bottomPanel,
                {paddingBottom:24 + insets.bottom},
            ]}
                >
                    <View style={styles.tabsRow}>
                        <Pressable
                        onPress={() => setActiveTab("login")}
                        style={styles.tabButton}
                        >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "login" && styles.tabTextActive,
                    ]}
                  >
                    Login
                  </Text>
                  {activeTab === "login" && <View style={styles.activeLine} />}
                </Pressable>

                <Pressable
                  onPress={() => setActiveTab("signup")}
                  style={styles.tabButton}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "signup" && styles.tabTextActive,
                    ]}
                  >
                    Sign up
                  </Text>
                  {activeTab === "signup" && <View style={styles.activeLine} />}
                </Pressable>
              </View>

              <View style={styles.formContent}>
                {activeTab === "login" ? (
                  <>
                    <View style={styles.fieldBlock}>
                      <Text style={styles.fieldLabel}>Email address</Text>
                      <TextInput
                        value={loginEmail}
                        onChangeText={setLoginEmail}
                        placeholder="Enter your email"
                        placeholderTextColor="#8B92A3"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={styles.input}
                      />
                    </View>

                    <View style={styles.fieldBlock}>
                      <Text style={styles.fieldLabel}>Password</Text>
                      <View style={styles.passwordWrap}>
                        <TextInput
                          value={loginPassword}
                          onChangeText={setLoginPassword}
                          placeholder="Enter your password"
                          placeholderTextColor={COLORS.textMuted}
                          secureTextEntry={!showLoginPassword}
                          style={styles.passwordInput}
                        />

                        <Pressable
                          onPress={() => setShowLoginPassword((v) => !v)}
                        >
                          <Text style={styles.toggleText}>
                            {showLoginPassword ? "Hide" : "Show"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>

                    <View style={styles.forgotWrap}>
                    <Pressable
                      onPress={() =>
                        router.push("/(auth)/forgot-password" as any)
                      }
                    >
                      <Text style={styles.forgotText}>Forgot password?</Text>
                    </Pressable>
                    </View>

                    <Pressable
                      onPress={handleLogin}
                      disabled={!isLoginValid || loginLoading}
                      style={[
                        styles.primaryButton,
                        isLoginValid
                          ? styles.primaryButtonEnabled
                          : styles.primaryButtonDisabled,
                        loginLoading && styles.primaryButtonDisabled,
                      ]}
                    >
                      <Text style={styles.primaryButtonText}>
                        {loginLoading ? "Logging in..." : "Login"}
                      </Text>
                    </Pressable>
                  </>
                ) : (
                  <>
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
                        value={registerEmail}
                        onChangeText={setRegisterEmail}
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
                          value={registerPassword}
                          onChangeText={setRegisterPassword}
                          placeholder="Create your password"
                          placeholderTextColor={COLORS.textMuted}
                          secureTextEntry={!showRegisterPassword}
                          style={styles.passwordInput}
                        />

                        <Pressable
                          onPress={() =>
                            setShowRegisterPassword((v) => !v)
                          }
                        >
                          <Text style={styles.toggleText}>
                            {showRegisterPassword ? "Hide" : "Show"}
                          </Text>
                        </Pressable>
                      </View>

                      {!!registerPassword.length && (
                        <View style={styles.strengthBlock}>
                          <View style={styles.strengthBars}>
                            <View
                              style={[
                                styles.strengthBar,
                                passwordStrength.score >= 1 && {
                                  backgroundColor: passwordStrengthColor,
                                },
                              ]}
                            />
                            <View
                              style={[
                                styles.strengthBar,
                                passwordStrength.score >= 2 && {
                                  backgroundColor: passwordStrengthColor,
                                },
                              ]}
                            />
                            <View
                              style={[
                                styles.strengthBar,
                                passwordStrength.score >= 3 && {
                                  backgroundColor: passwordStrengthColor,
                                },
                              ]}
                            />
                          </View>

                          <Text
                            style={[
                              styles.strengthText,
                              { color: passwordStrengthColor },
                            ]}
                          >
                            {passwordStrength.label}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Pressable
                      onPress={handleRegister}
                      disabled={!isRegisterValid || registerLoading}
                      style={[
                        styles.primaryButton,
                        isRegisterValid
                          ? styles.primaryButtonEnabled
                          : styles.primaryButtonDisabled,
                        registerLoading && styles.primaryButtonDisabled,
                      ]}
                    >
                      <Text style={styles.primaryButtonText}>
                        {registerLoading ? "Creating..." : "Create account"}
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
    root:{
        flex:1,
        backgroundColor:COLORS.panel,
    },
  topSafe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flex: {
    flex: 1,
  },
  screenContent:{
    flex:1,
    backgroundColor:COLORS.bg,
  },

  topArea: {
    height:220,
    backgroundColor:COLORS.bg,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 22,
    paddingBottom: 24,
   
  },
  logoWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 150,
  },

  bottomPanel: {
    flex:1,
    backgroundColor: COLORS.panel,
    borderTopLeftRadius:32,
    borderTopRightRadius:32,
    paddingHorizontal:24,
    paddingTop:18,
    marginTop:-6,
    // minHeight:680,
    
  },

  tabsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    columnGap: 20,
    marginBottom: 18,
  },
  tabButton: {
    width:140,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 17,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  tabTextActive: {
    fontSize:19,
    color: COLORS.textDark,
    fontWeight: "800",
  },
  activeLine: {
    marginTop: 8,
    width: 72,
    height: 4,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },

  formContent: {
    flex:1,
    // marginTop:32,
    paddingHorizontal:6,
    paddingTop:56,
    justifyContent:"space-between",
  },

  fieldBlock: {
    marginBottom: 22,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 6,
    letterSpacing:0.2,
  },
  input: {
    height: 52,
    borderBottomWidth: 1.2,
    borderBottomColor: "#D4DAE6",
    color: COLORS.textDark,
    fontSize: 16,
    paddingHorizontal: 4,
    paddingTop:0,
    paddingBottom:6,
    backgroundColor: "transparent",
  },

  passwordWrap: {
    minHeight: 52,
    borderBottomWidth: 1.2,
    borderBottomColor: "#D4DAE6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passwordInput: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 15.5,
    paddingVertical: 10,
    paddingRight: 12,
  },
  toggleText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },

  strengthBlock: {
    marginTop: 10,
    gap: 6,
  },
  strengthBars: {
    flexDirection: "row",
    gap: 6,
  },
  strengthBar: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#E6E9F0",
  },
  strengthText: {
    fontSize: 12.5,
    fontWeight: "700",
  },

  forgotText: {
    color:"#20263A",
    fontSize: 13.5,
    fontWeight: "600",
    // marginTop: 4,
    // marginBottom: 22,
  },
  forgotWrap:{
    marginTop:10,
    marginBottom:24,
    alignItems:"flex-end",
  },

  primaryButton: {
    height: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 8,
  },
  primaryButtonEnabled: {
    backgroundColor: COLORS.primarySoft,
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.buttonDisabled,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },
});