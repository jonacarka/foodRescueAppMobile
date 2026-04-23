import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
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
  bg: "#F6F2E9",
  cream: "#F7F1E7",
  creamSoft: "#FBF7F0",
  white: "#FFFFFF",
  primary: "#0D1A63",
  text: "#111827",
  muted: "#6B7280",
  mutedSoft: "#8C92A3",
  border: "#ECE6DB",
  olive: "#7E9A70",
  oliveDark: "#6C8960",
  oliveSoft: "#AEBFA2",
  greenTint: "#E6F1E5",
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this rescue</Text>
            <Text style={styles.sectionText}>
              {listing.description?.trim()
                ? listing.description
                : "A rescued food listing available for pickup today."}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup details</Text>

            <InfoRow label="Address" value={listing.business_address || "Address not specified"} />
            <InfoRow label="City" value={listing.business_city || "Unknown city"} />
            <InfoRow label="Pickup window" value={pickupText} />
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
    backgroundColor: COLORS.olive,
  },
  heroImage: {
    height: 430,
    justifyContent: "space-between",
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

  heroInfoBand: {
    marginHorizontal: 18,
    marginTop: -28,
    backgroundColor: COLORS.oliveDark,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
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
  heroBandDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,0.16)",
    marginHorizontal: 12,
  },
  heroBandSmall: {
    fontSize: 11,
    color: "rgba(255,255,255,0.72)",
    marginBottom: 4,
  },
  heroBandMain: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  body: {
    marginTop: 14,
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 32,
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
    fontSize: 13,
    color: COLORS.oliveDark,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 33,
    lineHeight: 37,
    color: COLORS.text,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.muted,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 6,
  },
  categoryBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
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
    backgroundColor: COLORS.creamSoft,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricCardAccent: {
    backgroundColor: COLORS.greenTint,
    borderColor: "#D4E7D2",
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.mutedSoft,
    marginBottom: 6,
  },
  metricLabelAccent: {
    color: "#227A4D",
  },
  metricValue: {
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.text,
    fontWeight: "800",
  },
  metricValueAccent: {
    color: "#0E7A46",
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
    paddingVertical: 12,
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
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
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
    fontSize: 20,
    color: COLORS.text,
    fontWeight: "800",
  },
  reserveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    paddingHorizontal: 26,
    paddingVertical: 15,
  },
  reserveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});