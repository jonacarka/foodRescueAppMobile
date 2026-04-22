import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
  primarySoft: "#E8ECFF",
  text: "#111827",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  dangerSoft: "#FFF1F2",
  dangerText: "#BE123C",
  successSoft: "#ECFDF3",
  successText: "#027A48",
  shadow: "rgba(16, 24, 40, 0.08)",
};

const MOOD_CHIPS = [
  "All",
  "Dinner tonight",
  "Sweet rescue",
  "Budget picks",
  "Surprise bag",
];

export default function CustomerHomeScreen() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMood, setSelectedMood] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadListings = useCallback(async () => {
    try {
      setError("");
      const data = await listingService.getActiveListings();
      setListings(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load listings.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadListings();
    }, [loadListings])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadListings();
  }, [loadListings]);

  const filteredListings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return listings.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        (item.description ?? "").toLowerCase().includes(normalizedSearch) ||
        (item.business_name ?? "").toLowerCase().includes(normalizedSearch) ||
        (item.category ?? "").toLowerCase().includes(normalizedSearch);

      const title = item.title.toLowerCase();
      const category = (item.category ?? "").toLowerCase();
      const price = item.pricecents ?? 0;

      let matchesMood = true;

      if (selectedMood === "Dinner tonight") {
        matchesMood =
          title.includes("meal") ||
          title.includes("dinner") ||
          category.includes("meal") ||
          category.includes("food");
      } else if (selectedMood === "Sweet rescue") {
        matchesMood =
          title.includes("sweet") ||
          title.includes("dessert") ||
          title.includes("cake") ||
          title.includes("donut") ||
          title.includes("croissant") ||
          category.includes("dessert") ||
          category.includes("bakery");
      } else if (selectedMood === "Budget picks") {
        matchesMood = price <= 50000;
      } else if (selectedMood === "Surprise bag") {
        matchesMood =
          title.includes("surprise") || category.includes("surprise");
      }

      return matchesSearch && matchesMood;
    });
  }, [listings, search, selectedMood]);

  const expiringSoon = useMemo(() => {
    return [...filteredListings]
      .sort(
        (a, b) =>
          new Date(a.expiresat).getTime() - new Date(b.expiresat).getTime()
      )
      .slice(0, 6);
  }, [filteredListings]);

  const recommended = useMemo(() => {
    return [...filteredListings]
      .sort(
        (a, b) =>
          new Date(b.createdat).getTime() - new Date(a.createdat).getTime()
      )
      .slice(0, 6);
  }, [filteredListings]);

  const surpriseBags = useMemo(() => {
    return filteredListings
      .filter((item) => {
        const title = item.title.toLowerCase();
        const category = (item.category ?? "").toLowerCase();

        return title.includes("surprise") || category.includes("surprise");
      })
      .slice(0, 6);
  }, [filteredListings]);

  const rescuedCount = 148;
  const savedKg = 63;
  const co2AvoidedKg = 210;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good evening</Text>
          <Text style={styles.title}>Rescue food near you</Text>
          <Text style={styles.subtitle}>
            Discover active listings, save money, and reduce food waste.
          </Text>
        </View>

        <View style={styles.searchWrapper}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search meals, bakeries, surprise bags..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {MOOD_CHIPS.map((chip) => {
            const active = chip === selectedMood;

            return (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedMood(chip)}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.impactCard}>
          <Text style={styles.impactTitle}>Today in Tirana</Text>
          <View style={styles.impactRow}>
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>{rescuedCount}</Text>
              <Text style={styles.impactLabel}>meals rescued</Text>
            </View>
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>{savedKg} kg</Text>
              <Text style={styles.impactLabel}>food saved</Text>
            </View>
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>{co2AvoidedKg} kg</Text>
              <Text style={styles.impactLabel}>CO₂ avoided</Text>
            </View>
          </View>
        </View>

        {loading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.stateText}>Loading listings...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadListings}>
              <Text style={styles.retryButtonText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : filteredListings.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.emptyTitle}>No listings found</Text>
            <Text style={styles.emptyText}>
              Try changing the search or selecting another mood.
            </Text>
          </View>
        ) : (
          <>
            <HomeSection
              title="Expiring soon"
              subtitle="Pick these up before they’re gone"
              items={expiringSoon}
            />

            <HomeSection
              title="Recommended"
              subtitle="Fresh active offers near you"
              items={recommended}
            />

            {surpriseBags.length > 0 && (
              <HomeSection
                title="Surprise bags"
                subtitle="Mystery picks with great value"
                items={surpriseBags}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type HomeSectionProps = {
  title: string;
  subtitle: string;
  items: Listing[];
};

function HomeSection({ title, subtitle, items }: HomeSectionProps) {
  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
      </View>

      {items.map((item) => (
        <ListingCard key={item.id} item={item} />
      ))}
    </View>
  );
}

function ListingCard({ item }: { item: Listing }) {
  const isExpiringSoon =
    new Date(item.expiresat).getTime() - Date.now() < 1000 * 60 * 60 * 3;

  return (
    <TouchableOpacity 
    activeOpacity={0.9} 
    style={styles.card}
    onPress={() => router.push(`/(customer)/listings/${item.id}`)}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.cardMainInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardBusiness} numberOfLines={1}>
            {item.business_name}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            isExpiringSoon ? styles.badgeDanger : styles.badgeSuccess,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              isExpiringSoon ? styles.badgeDangerText : styles.badgeSuccessText,
            ]}
          >
            {formatTimeLeft(item.expiresat)}
          </Text>
        </View>
      </View>

      {!!item.description && (
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {item.business_city || "Unknown city"}
        </Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>
          {item.quantity} {item.unit}
        </Text>
        {item.category ? (
          <>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{item.category}</Text>
          </>
        ) : null}
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.pickupLabel}>Pickup</Text>
          <Text style={styles.pickupValue}>
            {formatPickupWindow(item.pickupstartat, item.pickupendat)}
          </Text>
        </View>

        <Text style={styles.price}>
          {formatPrice(item.pricecents, item.currency)}
        </Text>
      </View>
    </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textMuted,
  },
  searchWrapper: {
    marginBottom: 14,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  chipsContainer: {
    paddingBottom: 6,
    gap: 10,
    marginBottom: 18,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  impactCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
  },
  impactTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
  },
  impactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  impactItem: {
    flex: 1,
  },
  impactValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  impactLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    lineHeight: 16,
  },
  section: {
    marginBottom: 26,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  cardMainInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  cardBusiness: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  badgeDanger: {
    backgroundColor: COLORS.dangerSoft,
  },
  badgeDangerText: {
    color: COLORS.dangerText,
  },
  badgeSuccess: {
    backgroundColor: COLORS.successSoft,
  },
  badgeSuccessText: {
    color: COLORS.successText,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 14,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  metaDot: {
    marginHorizontal: 6,
    color: COLORS.textMuted,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
  },
  pickupLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  pickupValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "700",
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },
  stateBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
  },
  stateText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.dangerText,
    textAlign: "center",
    marginBottom: 14,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});