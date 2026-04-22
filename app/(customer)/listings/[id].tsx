import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
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
  background: "#F7F8FC",
  surface: "#FFFFFF",
  primary: "#0D1A63",
  primarySoft: "#E9EEFF",
  text: "#111827",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  dangerSoft: "#FFF1F2",
  dangerText: "#BE123C",
  successSoft: "#ECFDF3",
  successText: "#027A48",
  cream: "#F8F4EC",
  shadow: "rgba(15, 23, 42, 0.10)",
};

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
    if (!listing?.category) return "Rescue listing";

    return listing.category
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }, [listing]);

  const heroAccent = useMemo(() => {
    const category = (listing?.category ?? "").toLowerCase();

    if (category.includes("dessert") || category.includes("bakery")) {
      return { bg: "#F7E8E4", circle: "#E8C9C1", plate: "#FFF8F3" };
    }

    if (category.includes("grocery")) {
      return { bg: "#E8F2EA", circle: "#BFD8C2", plate: "#F7FCF8" };
    }

    if (category.includes("surprise")) {
      return { bg: "#ECE8FA", circle: "#CEC4F5", plate: "#F8F5FF" };
    }

    return { bg: "#E6EDF8", circle: "#BED0EF", plate: "#F8FBFF" };
  }, [listing]);

  const estimatedValue = useMemo(() => {
    if (!listing) return 0;
    return Math.round(listing.pricecents * 1.8);
  }, [listing]);

  const savings = useMemo(() => {
    if (!listing) return 0;
    return Math.max(estimatedValue - listing.pricecents, 0);
  }, [estimatedValue, listing]);

  const isExpiringSoon = useMemo(() => {
    if (!listing) return false;
    return new Date(listing.expiresat).getTime() - Date.now() < 1000 * 60 * 60 * 3;
  }, [listing]);

  const handleReserve = () => {
    if (!listing) return;

    Alert.alert(
      "Reserve listing",
      `You selected "${listing.title}". Next we can connect this to order creation.`
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { backgroundColor: heroAccent.bg }]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>

          <Pressable
            style={styles.favoriteButton}
            onPress={() => Alert.alert("Saved", "Save/favorite can be added next.")}
          >
            <Text style={styles.favoriteButtonText}>♡</Text>
          </Pressable>

          <View style={[styles.heroCircleLarge, { backgroundColor: heroAccent.circle }]} />
          <View style={[styles.heroCircleSmall, { backgroundColor: heroAccent.circle }]} />

          <View style={[styles.plateOuter, { backgroundColor: heroAccent.plate }]}>
            <View style={styles.plateInner}>
              <View style={styles.foodCluster}>
                <View style={[styles.foodBlob, styles.foodBlobGreen]} />
                <View style={[styles.foodBlob, styles.foodBlobOrange]} />
                <View style={[styles.foodBlob, styles.foodBlobYellow]} />
                <View style={[styles.foodBlob, styles.foodBlobDark]} />
                <View style={[styles.foodBlob, styles.foodBlobLight]} />
              </View>
            </View>
          </View>

          <View style={styles.heroBadgeRow}>
            <View
              style={[
                styles.heroBadge,
                isExpiringSoon ? styles.heroBadgeDanger : styles.heroBadgeNeutral,
              ]}
            >
              <Text
                style={[
                  styles.heroBadgeText,
                  isExpiringSoon ? styles.heroBadgeDangerText : styles.heroBadgeNeutralText,
                ]}
              >
                {formatTimeLeft(listing.expiresat)}
              </Text>
            </View>

            <View style={styles.heroBadgeBlue}>
              <Text style={styles.heroBadgeBlueText}>{categoryLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={styles.summaryTextWrap}>
              <Text style={styles.listingTitle}>{listing.title}</Text>
              <Text style={styles.businessName}>{listing.business_name}</Text>
              <Text style={styles.locationText}>
                {listing.business_city || "Unknown city"}
                {listing.business_address ? ` • ${listing.business_address}` : ""}
              </Text>
            </View>

            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Rescue price</Text>
              <Text style={styles.priceValue}>
                {formatPrice(listing.pricecents, listing.currency)}
              </Text>
            </View>
          </View>

          <View style={styles.quickInfoRow}>
            <InfoPill
              label="Pickup"
              value={formatPickupWindow(listing.pickupstartat, listing.pickupendat)}
            />
            <InfoPill label="Quantity" value={`${listing.quantity} ${listing.unit}`} />
          </View>

          <View style={styles.savingsRow}>
            <View>
              <Text style={styles.savingsLabel}>Estimated value</Text>
              <Text style={styles.savingsValue}>
                {formatPrice(estimatedValue, listing.currency)}
              </Text>
            </View>

            <View style={styles.saveBox}>
              <Text style={styles.saveBoxLabel}>You save</Text>
              <Text style={styles.saveBoxValue}>
                {formatPrice(savings, listing.currency)}
              </Text>
            </View>
          </View>
        </View>

        <DetailSection title="About this rescue">
          <Text style={styles.bodyText}>
            {listing.description?.trim()
              ? listing.description
              : "A rescued food listing available for pickup today."}
          </Text>

          <View style={styles.metaWrap}>
            <MetaItem label="Category" value={categoryLabel} />
            <MetaItem label="Status" value={listing.status} />
          </View>
        </DetailSection>

        <DetailSection title="Pickup details">
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pickup window</Text>
            <Text style={styles.detailValue}>
              {formatPickupWindow(listing.pickupstartat, listing.pickupendat)}
            </Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>
              {listing.business_address || "Address not specified"}
            </Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>City</Text>
            <Text style={styles.detailValue}>
              {listing.business_city || "Unknown city"}
            </Text>
          </View>
        </DetailSection>

        <View style={styles.impactCard}>
          <Text style={styles.impactTitle}>Why this rescue matters</Text>

          <View style={styles.impactItemsRow}>
            <ImpactMiniCard title="Save money" subtitle="Get quality food at a lower price." />
            <ImpactMiniCard title="Reduce waste" subtitle="Help prevent good food from being thrown away." />
            <ImpactMiniCard title="Support local" subtitle="Back local businesses in your city." />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomBarSmall}>Ready for pickup today</Text>
          <Text style={styles.bottomBarPrice}>
            {formatPrice(listing.pricecents, listing.currency)}
          </Text>
        </View>

        <Pressable style={styles.reserveButton} onPress={handleReserve}>
          <Text style={styles.reserveButtonText}>Reserve now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoPill}>
      <Text style={styles.infoPillLabel}>{label}</Text>
      <Text style={styles.infoPillValue}>{value}</Text>
    </View>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaItemLabel}>{label}</Text>
      <Text style={styles.metaItemValue}>{value}</Text>
    </View>
  );
}

function ImpactMiniCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.impactMiniCard}>
      <Text style={styles.impactMiniTitle}>{title}</Text>
      <Text style={styles.impactMiniSubtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 130,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  stateText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textMuted,
  },
  errorText: {
    fontSize: 15,
    color: COLORS.dangerText,
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

  hero: {
    height: 360,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingTop: 18,
    justifyContent: "space-between",
  },
  backButton: {
    position: "absolute",
    top: 18,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  backButtonText: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: "700",
    marginTop: -2,
  },
  favoriteButton: {
    position: "absolute",
    top: 18,
    right: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  favoriteButtonText: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: "700",
  },
  heroCircleLarge: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    right: -30,
    top: 40,
    opacity: 0.45,
  },
  heroCircleSmall: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    left: -28,
    bottom: 58,
    opacity: 0.35,
  },
  plateOuter: {
    alignSelf: "center",
    marginTop: 44,
    width: 228,
    height: 228,
    borderRadius: 114,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  plateInner: {
    width: 184,
    height: 184,
    borderRadius: 92,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  foodCluster: {
    width: 118,
    height: 118,
    position: "relative",
  },
  foodBlob: {
    position: "absolute",
    borderRadius: 999,
  },
  foodBlobGreen: {
    width: 64,
    height: 38,
    backgroundColor: "#7DAE7A",
    top: 6,
    left: 24,
    transform: [{ rotate: "-14deg" }],
  },
  foodBlobOrange: {
    width: 54,
    height: 24,
    backgroundColor: "#E49A58",
    top: 38,
    left: 8,
    transform: [{ rotate: "28deg" }],
  },
  foodBlobYellow: {
    width: 44,
    height: 24,
    backgroundColor: "#E8C86A",
    top: 56,
    right: 4,
    transform: [{ rotate: "-18deg" }],
  },
  foodBlobDark: {
    width: 48,
    height: 28,
    backgroundColor: "#8A684A",
    bottom: 10,
    left: 20,
    transform: [{ rotate: "14deg" }],
  },
  foodBlobLight: {
    width: 52,
    height: 32,
    backgroundColor: "#CBE1BA",
    bottom: 22,
    right: 18,
    transform: [{ rotate: "-28deg" }],
  },
  heroBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  heroBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  heroBadgeDanger: {
    backgroundColor: COLORS.dangerSoft,
  },
  heroBadgeDangerText: {
    color: COLORS.dangerText,
  },
  heroBadgeNeutral: {
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  heroBadgeNeutralText: {
    color: COLORS.text,
  },
  heroBadgeBlue: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroBadgeBlueText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  summaryCard: {
    marginTop: -28,
    marginHorizontal: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 16,
  },
  summaryTextWrap: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },
  businessName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textMuted,
  },
  priceBox: {
    minWidth: 108,
    backgroundColor: COLORS.primarySoft,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  priceLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
  },
  quickInfoRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  infoPill: {
    flex: 1,
    backgroundColor: COLORS.cream,
    borderRadius: 18,
    padding: 12,
  },
  infoPillLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 5,
  },
  infoPillValue: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.text,
    fontWeight: "700",
  },
  savingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  savingsLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  savingsValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "700",
  },
  saveBox: {
    backgroundColor: COLORS.successSoft,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "flex-end",
  },
  saveBoxLabel: {
    fontSize: 11,
    color: COLORS.successText,
    marginBottom: 4,
  },
  saveBoxValue: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.successText,
  },

  sectionCard: {
    marginTop: 18,
    marginHorizontal: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 14,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textMuted,
  },
  metaWrap: {
    marginTop: 16,
    gap: 10,
  },
  metaItem: {
    backgroundColor: "#FAFBFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metaItemLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  metaItemValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  detailRow: {
    gap: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  detailValue: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.text,
    fontWeight: "700",
  },
  detailDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },

  impactCard: {
    marginTop: 18,
    marginHorizontal: 20,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
  },
  impactItemsRow: {
    gap: 12,
  },
  impactMiniCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  impactMiniTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },
  impactMiniSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textMuted,
  },

  bottomBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    paddingLeft: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  bottomBarSmall: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 3,
  },
  bottomBarPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },
  reserveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  reserveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});