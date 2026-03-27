import { router } from "expo-router";
import React from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const COLORS = {
  bg: "#0D1A63",
  shell: "rgba(255,255,255,0.10)",
  panel: "#F7F8FC",
  card: "#FFFFFF",
  textDark: "#111827",
  textMuted: "#7B8190",
  primary: "#163BB8",
};

type Props = {
  activeTab: "login" | "signup";
  children: React.ReactNode;
};

export default function AuthShell({ activeTab, children }: Props) {
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
                  onPress={() => router.replace("/(auth)/register")}
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

              <View style={styles.formCard}>{children}</View>
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
});