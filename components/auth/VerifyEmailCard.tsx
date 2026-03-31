import { authService } from "@/services/authService";
import { AuthUser } from "@/types/auth";
import { saveSession } from "@/utils/storage";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Alert,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const COLORS={
    textDark:"#111827",
    textMuted:"#6B7280",
    border:"#D9E2F2",
    primary:"#0D1A63",
    white:"#FFFFFF",
    buttonDisabled:"#C5CBD8",
};

type Props = {
    email:string;
    onBackToLogin:() => void;
};

function getRouteByRole(user:AuthUser){
    switch(user.role){
        case "BUSINESS":
            return"/(business)";
            case "CUSTOMER":
                case "NGO":
                    case "COURIER":
                        case "ADMIN":
                            default:
                                return"/(customer)";
    }
}

export default function VerifyEmailCard({
    email,
    onBackToLogin,
}:Props){
    const[code,setCode] = useState("");
    const[loading,setLoading]=useState(false);
    const [resending,setResending] = useState(false);
    const[cooldown,setCooldown] = useState(0);

    const hiddenInputRef = useRef<TextInput>(null);

    useEffect(() =>{
        if(cooldown <= 0) return;

        const timer = setTimeout(() =>{
            setCooldown((prev) => prev -1);
        },1000);

        return () => clearTimeout(timer);
    },[cooldown]);

    const isValid = useMemo(() =>{
        return /\S+@\S+\.\S+/.test(email.trim()) && /^\d{5}$/.test(code.trim());
    },[email,code]);

    function handleCodeChange(text:string){
        const clean = text.replace(/[^\d]/g,"").slice(0, 5);
        setCode(clean);

        if(clean.length === 5){
            hiddenInputRef.current?.blur();
            Keyboard.dismiss();
        }
    }

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

            router.replace(getRouteByRole(result.user) as any);
        }catch(error:any){
            Alert.alert("Verification failed",error?.message || "Please try again");
        }finally{
            setLoading(false);

        }
    }

    async function handleResend(){
        if(!/\S+@\S+\.\S+/.test(email.trim()) || resending || cooldown > 0) return;

        try{
            setResending(true);
            const result = await authService.resendCode(email.trim().toLowerCase());
            setCooldown(60);
            Alert.alert("Code sent",result.message);
        }catch(error:any){
            Alert.alert("Resend failed",error?.message || "Please try again");
        }finally{
            setResending(false);
    }
}

return (
    <View style={styles.verifyWrap}>
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>
        We sent a 5-digit code to your email address.
      </Text>

      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>Email</Text>
        <TextInput
          value={email}
          editable={false}
          selectTextOnFocus={false}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input, styles.inputDisabled]}
        />
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>Verification code</Text>

        <Pressable style={styles.codeBoxesWrap} onPress={() => hiddenInputRef.current?.focus()}>
            {[0,1,2,3,4].map((index) =>{
                const digit = code[index] ?? "";
                const isActive = code.length === index || (code.length === 5 && index === 4);

                return(
                    <View
                    key={index}
                    style={[
                        styles.codeBox,
                        isActive && styles.codeBoxActive,
                    ]}
                    >
                        <Text style={styles.codeBoxText}>{digit}</Text>
                    </View>
                );
            })}
        </Pressable>

        <TextInput
        ref={hiddenInputRef}
        value={code}
        onChangeText={handleCodeChange}
        keyboardType="number-pad"
        maxLength={5}
        returnKeyType="done"
        blurOnSubmit
        onSubmitEditing={() => {
            hiddenInputRef.current?.blur();
            Keyboard.dismiss();
        }}
        style={styles.hiddenInput}
        />
      </View>

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

      <Pressable onPress={handleResend} disabled={resending || cooldown > 0}>
        <Text style={styles.footerText}>
          Didn&apos;t get the code?{" "}
          <Text style={styles.footerLink}>
            {resending
              ? "Sending..."
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend"}
          </Text>
        </Text>
      </Pressable>

      <Pressable onPress={onBackToLogin}>
        <Text style={styles.secondaryText}>
          Back to <Text style={styles.footerLink}>Sign in</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  verifyWrap: {
    flex: 1,
    paddingTop:18,
    // justifyContent: "center",
  },
  title: {
    color:"#0D1A63",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
    textAlign:"left",
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
    maxWidth: 320,
  },
  fieldBlock: {
    marginBottom: 22,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 6,
    letterSpacing: 0.2,
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
  inputDisabled: {
    backgroundColor: "#F3F5F8",
    color: "#7B8496",
  },
  codeBoxesWrap:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginTop:4,
  },
  codeBox:{
    width:52,
    height:56,
    borderWidth:1.5,
    borderColor:"#D9E2F2",
    borderRadius:12,
    backgroundColor:"#FFFFFF",
    alignItems:"center",
    justifyContent:"center",
  },
  codeBoxActive:{
    borderColor:"#0D1A63",
    shadowColor:"#0D1A63",
    shadowOpacity:0.08,
    shadowRadius:6,
    shadowOffset:{width:0,height:2},
    elevation:2,
  },

  codeBoxText:{
    fontSize:24,
    fontWeight:"700",
    color:COLORS.textDark,
  },
  hiddenInput:{
    position:"absolute",
    opacity:0,
    width:1,
    height:1,
  },
  
  primaryButton: {
    height: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 8,
    backgroundColor: COLORS.primary,
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.buttonDisabled,
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