import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { listingService } from "@/services/listingService";
import { Listing } from "@/types/listing";
import { formatPickupWindow, formatTimeLeft } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";

const COLORS = {
  bg: "#f6f2e9",
  // cream: "#F7F1E7",
  // creamSoft: "#FBF7F0",
  card:"#FFFDF9",
  cardSoft:"#FBF7F1",
  // white: "#FFFFFF",
  primary: "#0D1A63",
  primarySoft:"#EAF0FF",
  primarySoftStrong:"#DCE6FF",
  text: "#0B1437",
  muted: "#7B8194",
  mutedSoft: "#9AA1B5",
  border: "#E7DED0",
  ribbon:"#162D87",
  ribbonText:"#FFFFFF",
  savingsBg:"#EEF3FF",
  savingsText:"#294891",
  shadow: "rgba(17, 24, 39, 0.08)",
};

function getHeroImage(category?: string | null) {
  const c = (category ?? "").toLowerCase();

  if (c.includes("dessert") || c.includes("bakery")) {
    return {
      uri: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=80",
    };
  }

  if (c.includes("grocery")) {
    return {
      uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
    };
  }

  return {
    uri: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80",
  };
}

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailsVisible,setDetailsVisible]=useState(false);
  const[detailsTab,setDetailsTab]=useState<"about" | "pickup" | "value">("about");

  const openDetails = (tab:"about" | "pickup" | "value") =>{
    setDetailsTab(tab);
    setDetailsVisible(true);
  };

  const loadListing = useCallback(async () => {
    if (!id || typeof id !== "string") {
      setError("Invalid listing id.");
      setLoading(false);
      return;
    }

    try {
      setError("");
      const data = await listingService.getListingById(id);
      setListing(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load listing.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadListing();
    }, [loadListing])
  );

  const categoryLabel = useMemo(() => {
    if (!listing?.category) return "Rescue";

    return listing.category
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }, [listing]);

  const estimatedValue = useMemo(() => {
    if (!listing) return 0;
    return Math.round(listing.pricecents * 1.8);
  }, [listing]);

  const savings = useMemo(() => {
    if (!listing) return 0;
    return Math.max(estimatedValue - listing.pricecents, 0);
  }, [estimatedValue, listing]);

  const pickupText = useMemo(() => {
    if (!listing) return "";
    return formatPickupWindow(listing.pickupstartat, listing.pickupendat);
  }, [listing]);

  const expiresText = useMemo(() => {
    if (!listing) return "";
    return formatTimeLeft(listing.expiresat);
  }, [listing]);

  const handleReserve = () => {
    if (!listing) return;

    Alert.alert(
      "Reserve listing",
      `You selected "${listing.title}". Next we can connect this to real order creation.`
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.stateText}>Loading listing...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !listing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error || "Listing not found."}</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.back()}>
            <Text style={styles.primaryButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          <ImageBackground
            source={getHeroImage(listing.category)}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            <View style={styles.heroOverlay} />

            <SafeAreaView edges={["top"]} style={styles.heroSafeArea}>
              <View style={styles.topActions}>
                <Pressable style={styles.topIconBtn} onPress={() => router.back()}>
                  <Text style={styles.topIconText}>←</Text>
                </Pressable>

                <Pressable
                  style={styles.topIconBtn}
                  onPress={() => Alert.alert("Saved", "Favorites can be added next.")}
                >
                  <Text style={styles.topIconText}>♡</Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </ImageBackground>

          <View style={styles.heroInfoBand}>
            <View style={styles.heroBandLeft}>
              <Text style={styles.heroBandSmall}>Pickup today</Text>
              <Text style={styles.heroBandMain}>{pickupText}</Text>
            </View>

            <View style={styles.heroBandDivider} />

            <View style={styles.heroBandCenter}>
              <Text style={styles.heroBandSmall}>Expires</Text>
              <Text style={styles.heroBandMain}>{expiresText}</Text>
            </View>

            <View style={styles.heroBandDivider} />

            <View style={styles.heroBandRight}>
              <Text style={styles.heroBandSmall}>Price</Text>
              <Text style={styles.heroBandMain}>
                {formatPrice(listing.pricecents, listing.currency)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.businessName}>{listing.business_name}</Text>
              <Text style={styles.title}>{listing.title}</Text>
              <Text style={styles.subtitle}>
                {listing.business_city || "Unknown city"}
                {listing.business_address ? ` • ${listing.business_address}` : ""}
              </Text>
            </View>

            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{categoryLabel}</Text>
            </View>
          </View>

          <View style={styles.metricGrid}>
            <MetricCard
              label="Pickup"
              value={pickupText}
            />
            <MetricCard
              label="Quantity"
              value={`${listing.quantity} ${listing.unit}`}
            />
            <MetricCard
              label="Est. value"
              value={formatPrice(estimatedValue, listing.currency)}
            />
            <MetricCard
              label="You save"
              value={formatPrice(savings, listing.currency)}
              accent
            />
          </View>

          <View style={styles.quickActionsRow}>
            <QuickAction label="About" onPress={() => openDetails("about")} />
            <QuickAction label="Pickup info" onPress={() => openDetails("pickup")} />
            <QuickAction label="Value" onPress={() => openDetails("value")} />
          </View>

          <View style={styles.quickSummaryCard}>
            <Text style={styles.quickSummaryTitle}>Quick note</Text>
            <Text style={styles.quickSummaryText} numberOfLines={2}>
              {listing.description?.trim()
              ? listing.description
            : "A lower-cost evening meal combo for quick pickup"}
            </Text>
          </View>
          </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.bottomSafeArea}>
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomSmall}>Rescue price</Text>
            <Text style={styles.bottomPrice}>
              {formatPrice(listing.pricecents, listing.currency)}
            </Text>
          </View>

          <Pressable style={styles.reserveButton} onPress={handleReserve}>
            <Text style={styles.reserveButtonText}>Reserve now</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <Modal
      visible={detailsVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setDetailsVisible(false)}
      >
        <View style={{flex:1,justifyContent:"flex-end"}}>
        <Pressable
        style={styles.sheetBackdrop}
        onPress={() => setDetailsVisible(false)}
        />

        <View style={styles.sheetContainer}>
          <View style = {styles.sheetHandle}/>

          <View style={styles.sheetTabs}>
            <Pressable
            style={[
              styles.sheetTab,
              detailsTab === "about" && styles.sheetTabActive,
            ]}
            onPress={() => setDetailsTab("about")}
            >
              <Text
              style={[
                styles.sheetTabText,
                detailsTab === "about" && styles.sheetTabTextActive,
              ]}
              >
                About
              </Text>
            </Pressable>

            <Pressable
            style={[
              styles.sheetTab,
              detailsTab==="pickup" && styles.sheetTabActive,
            ]}
            onPress={() => setDetailsTab("pickup")}
            >
              <Text
              style={[
                styles.sheetTabText,
                detailsTab === "pickup" && styles.sheetTabTextActive,

              ]}
              >
                Pickup
              </Text>
            </Pressable>

            <Pressable
            style={[
              styles.sheetTab,
              detailsTab==="value" && styles.sheetTabActive,
            ]}
            onPress={() => setDetailsTab("value")}
            >
              <Text
              style={[
                styles.sheetTabText,
                detailsTab === "value" && styles.sheetTabTextActive,
              ]}
              >
                Value
              </Text>
            </Pressable>
          </View>

          {detailsTab === "about" &&(
            <View>
              <Text style ={styles.sheetTitle}>About this rescue</Text>
              <Text style={styles.sheetBodyText}>
                {listing.description?.trim()
                ? listing.description
                : "A rescued food listing available for pickup today"}
              </Text>
              </View>
          )}

          {detailsTab === "pickup" && (
            <View>
              <Text style={styles.sheetTitle}>Pickup details</Text>
              <InfoRow label="Address" value={listing.business_address || "Adress not specified"} />
              <InfoRow label="City" value={listing.business_city || "Unknown city"} />
              <InfoRow label="Pickup window" value={pickupText} />
              </View>
          )}

          {detailsTab === "value" && (
            <View>
              <Text style={styles.sheetTitle}>Rescue Value</Text>
              <InfoRow
              label="Estimated value"
              value={formatPrice(estimatedValue,listing.currency)}
              />
              <InfoRow
              label="Rescue price"
              value={formatPrice(listing.pricecents,listing.currency)}
              />
              <InfoRow
              label="You save"
              value={formatPrice(savings,listing.currency)}
              />
              </View>
          )}
        </View>
        </View>
      </Modal>
    </View>
    
  );
}

function MetricCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View style={[styles.metricCard, accent && styles.metricCardAccent]}>
      <Text style={[styles.metricLabel, accent && styles.metricLabelAccent]}>
        {label}
      </Text>
      <Text style={[styles.metricValue, accent && styles.metricValueAccent]}>
        {value}
      </Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function QuickAction({
  label,
  onPress,
}:{
  label:string;
  onPress: () => void;
}) {
  return(
    <Pressable style={styles.quickAction} onPress={onPress}>
      <Text style={styles.quickActionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: COLORS.bg,
  },
  stateText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.muted,
  },
  errorText: {
    fontSize: 15,
    color: "#B42318",
    textAlign: "center",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  heroWrap: {
    backgroundColor: COLORS.bg,
  },
  heroImage: {
    height: 390,
    justifyContent: "space-between",
  },
  heroInfoBand:{
    marginHorizontal:20,
    marginTop: -30,
    backgroundColor:COLORS.ribbon,
    borderRadius:24,
    paddingVertical:16,
    paddingHorizontal:18,
    borderWidth:4,
    borderColor:COLORS.bg,
    zIndex:4,
    shadowColor:COLORS.shadow,
    shadowOpacity:1,
    shadowRadius:14,
    shadowOffset:{width:0,height:8},
    elevation:5,
  },
  heroBandDivider:{
    width:1,
    alignSelf:"stretch",
    backgroundColor:"rgba(255,255,255,0.18)",
    marginHorizontal:12,

  },
  heroBandSmall:{
    fontSize:12,
    color:"rgba(255,255,255,0.72)",
    marginBottom:4,
  },
  heroBandMain:{
    fontSize:15,
    fontWeight:"800",
    color:COLORS.ribbonText,
  },
  heroImageStyle: {
    resizeMode: "cover",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(34, 51, 28, 0.14)",
  },
  heroSafeArea: {
    zIndex: 5,
  },
  topActions: {
    paddingHorizontal: 18,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.96)",
    alignItems: "center",
    justifyContent: "center",
  },
  topIconText: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: "700",
    marginTop: -1,
  },
  heroBandLeft: {
    flex: 1.15,
  },
  heroBandCenter: {
    flex: 0.9,
    alignItems: "center",
  },
  heroBandRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  body: {
    marginTop: -18,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 18,
    paddingTop: 46,
    paddingBottom: 24,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  titleBlock: {
    flex: 1,
  },
  businessName: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 30,
    lineHeight: 35,
    color: COLORS.text,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing:-0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.muted,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 4,
  },
  categoryBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 24,
  },
  metricCard: {
    width: "48.3%",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricCardAccent: {
    backgroundColor: COLORS.savingsBg,
    borderColor: COLORS.primarySoftStrong,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.mutedSoft,
    marginBottom: 6,
  },
  metricLabelAccent: {
    color:COLORS.savingsText,
  },
  metricValue: {
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.text,
    fontWeight: "800",
  },
  metricValueAccent: {
    color:COLORS.savingsText,
  },

  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: "800",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.muted,
  },

  infoRow: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.mutedSoft,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    fontWeight: "700",
  },

  bottomSafeArea: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  bottomBar: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: 26,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#ECE7DB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  bottomSmall: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 4,
  },
  bottomPrice: {
    fontSize: 19,
    color: COLORS.text,
    fontWeight: "800",
  },
  reserveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  reserveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  quickActionsRow:{
    flexDirection:"row",
    gap:10,
    marginBottom:14,
  },
  quickAction:{
    flex:1,
    backgroundColor:COLORS.card,
    borderRadius:999,
    paddingVertical:12,
    alignItems:"center",
    justifyContent:"center",
    borderWidth:1,
    borderColor:COLORS.border,
  },

  quickActionText:{
    fontSize:13,
    color:COLORS.primary,
    fontWeight:"700",
  },
  quickSummaryCard:{
    backgroundColor:COLORS.cardSoft,
    borderRadius:20,
    padding:15,
    borderWidth:1,
    borderColor:COLORS.border,
  },
  quickSummaryTitle:{
    fontSize:12,
    color:COLORS.mutedSoft,
    marginBottom:6,
  },
  quickSummaryText:{
    fontSize:14,
    lineHeight:21,
    color:COLORS.text,
    fontWeight:"500",
  },
  sheetBackdrop:{
    flex:1,
    backgroundColor:"rgba(0,0,0,0.26)",
  },
  sheetContainer:{
    backgroundColor:COLORS.card,
    borderTopLeftRadius:28,
    borderTopRightRadius:28,
    paddingHorizontal:18,
    paddingTop:12,
    paddingBottom:28,
  },
  sheetHandle:{
    width:46,
    height:5,
    borderRadius:999,
    backgroundColor:"#D9D2C6",
    alignSelf:"center",
    marginBottom:16,
  },
  sheetTabs:{
    flexDirection:"row",
    gap:8,
    marginBottom:18,
  },
  sheetTab:{
    flex:1,
    backgroundColor:COLORS.cardSoft,
    borderRadius:999,
    paddingVertical:11,
    alignItems:"center",
    borderWidth:1,
    borderColor:COLORS.border,
  },
  sheetTabActive:{
    backgroundColor:COLORS.primary,
    borderColor:COLORS.primary,
  },
  sheetTabText:{
    fontSize:13,
    fontWeight:"700",
    color:COLORS.primary,
  },
  sheetTabTextActive:{
    color:"#FFFFFF",
  },
  sheetTitle:{
    fontSize:18,
    fontWeight:"800",
    color:COLORS.text,
    marginBottom:10,
  },
  sheetBodyText:{
    fontSize:14,
    lineHeight:22,
    color:COLORS.muted,
  },
});