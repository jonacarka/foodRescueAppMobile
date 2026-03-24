import { authService } from "@/services/authService";
import { AuthUser } from "@/types/auth";
import { saveSession } from "@/utils/storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
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

function getRouteByRole(user:AuthUser){
    switch(user.role){
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

export default function VerifyEmailScreen(){
    const params = useLocalSearchParams<{email?:string}>();
    const initialEmail = typeof params.email === "string" ? params.email :"";

    const[email,setEmail]=useState(initialEmail);
    const[code,setCode] = useState("");
    const[loading,setLoading] = useState(false);
    const[resending,setResending] = useState(false);

    const isValid = useMemo(() => {
    return /\S+@\S+\.\S+/.test(email.trim()) && /^\d{5}$/.test(code.trim());
  }, [email, code]);

    async function handleVerify(){
        if(!isValid || loading) return;

        try{
            setLoading(true);

            const result = await authService.verifyEmail({
                email:email.trim().toLowerCase(),
                code:code.trim(),
            });

            await saveSession({
                accessToken:result.accessToken,
                refreshToken:result.refreshToken,
                user:result.user,
            });

            router.replace(getRouteByRole(result.user)as any);
        }catch(error:any){
            Alert.alert("Verification failed", error?.message || "Please try again");
        }finally{
            setLoading(false);
        }
    }

     async function handleResend() {
    if (!/\S+@\S+\.\S+/.test(email.trim()) || resending) return;

    try {
      setResending(true);
      const result = await authService.resendCode(email.trim().toLowerCase());
      Alert.alert("Code sent", result.message);
    } catch (error: any) {
      Alert.alert("Resend failed", error?.message || "Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.hero}>
            <Text style={styles.badge}>Replate</Text>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
              Enter the 5-digit code we sent to your email address.
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

            <Text style={styles.label}>Verification code</Text>
            <TextInput
              value={code}
              onChangeText={(text) => setCode(text.replace(/[^\d]/g, "").slice(0, 5))}
              placeholder="12345"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              maxLength={5}
              style={[styles.input, styles.codeInput]}
            />

            <Pressable
              onPress={handleVerify}
              disabled={!isValid || loading}
              style={[
                styles.primaryButton,
                (!isValid || loading) && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Verifying..." : "Verify email"}
              </Text>
            </Pressable>

            <Pressable onPress={handleResend} disabled={resending}>
              <Text style={styles.footerText}>
                Didn&apos;t get the code?{" "}
                <Text style={styles.footerLink}>
                  {resending ? "Sending..." : "Resend"}
                </Text>
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.secondaryText}>
                Back to <Text style={styles.footerLink}>Sign in</Text>
              </Text>
            </Pressable>
          </View>
        </View>
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
  container: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 24,
  },
  hero: {
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
  codeInput: {
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: "800",
  },
  primaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
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
  secondaryText: {
    textAlign: "center",
    marginTop: 10,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});