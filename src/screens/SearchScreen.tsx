import React, { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import InputField from "../components/InputField";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import type { EventCategory, EventItem } from "../data";
import { featuredProvinces } from "../data";
import { useEvents } from "../hooks/useEvents";

const SEARCH_HISTORY_KEY = "ecom_ticket_search_history_v1";
const MAX_HISTORY = 10;

const TRENDING_QUERIES = [
  "những thành phố mơ màng",
  "thế giới trẻ",
  "bóng đàn ông",
];

const CATEGORY_EXPLORE: { category: EventCategory; title: string }[] = [
  { category: "Sân khấu & nghệ thuật", title: "Sân khấu & Nghệ thuật" },
  { category: "Thể thao", title: "Thể thao" },
  { category: "Tham quan & trải nghiệm", title: "Tham quan & trải nghiệm" },
];

const EXPLORE_CARD_W = 152;
const EXPLORE_CARD_H = 108;

const fallbackImg = require("../../assets/ticket.png");

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const { events, isLoading, error } = useEvents();

  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
        if (!mounted || !raw) return;
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
          setHistory(parsed);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const saveHistory = useCallback(async (next: string[]) => {
    try {
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const addToHistory = useCallback(
    (term: string) => {
      const t = term.trim();
      if (!t) return;
      setHistory((prev) => {
        const next = [t, ...prev.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(
          0,
          MAX_HISTORY,
        );
        void saveHistory(next);
        return next;
      });
    },
    [saveHistory],
  );

  const removeHistoryItem = useCallback(
    (term: string) => {
      setHistory((prev) => {
        const next = prev.filter((x) => x !== term);
        void saveHistory(next);
        return next;
      });
    },
    [saveHistory],
  );

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [];
    }
    return events.filter((e) => {
      const title = e.title.toLowerCase();
      const location = String(e.location).toLowerCase();
      return title.includes(q) || location.includes(q);
    });
  }, [events, query]);

  const categoryRows = useMemo(() => {
    return CATEGORY_EXPLORE.map(({ category, title }) => {
      const cover =
        events.find((e) => e.category === category)?.image ?? fallbackImg;
      return { category, title, cover };
    });
  }, [events]);

  const cityRows = useMemo(() => {
    return featuredProvinces.map((p) => ({
      id: p.id,
      title: p.name,
      cover: { uri: p.image } as const,
    }));
  }, []);

  const suggestedEvents = useMemo(() => {
    const trending = events.filter((e) => e.isTrending);
    const rest = events.filter((e) => !e.isTrending);
    return [...trending, ...rest].slice(0, 12);
  }, [events]);

  const showNoResults = hasQuery && filteredEvents.length === 0 && !isLoading;

  const onSubmitSearch = useCallback(() => {
    if (query.trim()) {
      addToHistory(query.trim());
    }
  }, [query, addToHistory]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBlock}>
        <InputField
          value={query}
          onChangeText={setQuery}
          placeholder="Nhập từ khoá...."
          keyboardType="default"
          autoCapitalize="none"
          leftIconName="search"
          returnKeyType="search"
          onSubmitEditing={onSubmitSearch}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {isLoading && hasQuery ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : hasQuery ? (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <SearchEventRow
              item={item}
              onPress={() => {
                addToHistory(query.trim() || item.title);
                navigation.getParent()?.navigate("EventDetailScreen", { eventId: item.id });
              }}
            />
          )}
          ListEmptyComponent={
            showNoResults ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyTitle}>Không tìm thấy sự kiện</Text>
                <Text style={styles.emptySub}>Thử từ khóa khác.</Text>
              </View>
            ) : null
          }
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.discoverScroll}
          nestedScrollEnabled
        >
          {isLoading ? (
            <View style={styles.inlineLoading}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : null}

          {history.length > 0 ? (
            <View style={styles.block}>
              {history.map((h) => (
                <Pressable
                  key={h}
                  style={({ pressed }) => [styles.suggestRow, pressed && styles.rowPressed]}
                  onPress={() => setQuery(h)}
                >
                  <Ionicons name="time-outline" size={22} color={COLORS.mutedText} />
                  <Text style={styles.suggestText} numberOfLines={2}>
                    {h}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    hitSlop={10}
                    onPress={() => removeHistoryItem(h)}
                    style={styles.trashBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color={COLORS.mutedText} />
                  </Pressable>
                </Pressable>
              ))}
            </View>
          ) : null}

          <View style={styles.block}>
            {TRENDING_QUERIES.map((t) => (
              <Pressable
                key={t}
                style={({ pressed }) => [styles.suggestRow, pressed && styles.rowPressed]}
                onPress={() => setQuery(t)}
              >
                <Ionicons name="trending-up" size={22} color={COLORS.primary} />
                <Text style={styles.suggestText} numberOfLines={2}>
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>

          <ExploreSection title="Khám phá theo Thể loại">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={styles.hRow}
            >
              {categoryRows.map((row) => (
                <ExploreCard
                  key={row.category}
                  title={row.title}
                  imageSource={row.cover}
                  onPress={() =>
                    navigation.getParent()?.navigate("EventCategoryScreen", {
                      category: row.category,
                      title: row.title,
                    })
                  }
                />
              ))}
            </ScrollView>
          </ExploreSection>

          <ExploreSection title="Khám phá theo Thành phố">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={styles.hRow}
            >
              {cityRows.map((row) => (
                <ExploreCard
                  key={row.id}
                  title={row.title}
                  imageSource={row.cover}
                  onPress={() =>
                    navigation.getParent()?.navigate("ProvinceDetailScreen", {
                      provinceId: row.id,
                    })
                  }
                />
              ))}
            </ScrollView>
          </ExploreSection>

          <ExploreSection title="Gợi ý dành cho bạn">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={styles.hRow}
            >
              {suggestedEvents.map((ev) => (
                <ExploreCard
                  key={ev.id}
                  title={ev.title}
                  imageSource={ev.image}
                  onPress={() =>
                    navigation.getParent()?.navigate("EventDetailScreen", { eventId: ev.id })
                  }
                />
              ))}
            </ScrollView>
          </ExploreSection>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function ExploreSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.exploreSection}>
      <Text style={styles.exploreSectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ExploreCard({
  title,
  imageSource,
  onPress,
}: {
  title: string;
  imageSource: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.exploreCard, pressed && styles.exploreCardPressed]}
    >
      <Image source={imageSource} style={styles.exploreImage} resizeMode="cover" />
      <View style={styles.exploreOverlay} />
      <Text style={styles.exploreCardTitle} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
}

function SearchEventRow({ item, onPress }: { item: EventItem; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Image source={item.image} style={styles.thumb} resizeMode="cover" />
      <Text style={styles.rowTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  headerBlock: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  errorText: {
    color: "#FF8A8A",
    fontWeight: "700",
    marginTop: SPACING.sm,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
    flexGrow: 1,
  },
  discoverScroll: {
    paddingBottom: 100,
  },
  inlineLoading: {
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  block: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  suggestRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  suggestText: {
    flex: 1,
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 15,
  },
  trashBtn: {
    padding: 4,
  },
  rowPressed: {
    opacity: 0.88,
  },
  exploreSection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  exploreSectionTitle: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 17,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  hRow: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xs,
  },
  exploreCard: {
    width: EXPLORE_CARD_W,
    height: EXPLORE_CARD_H,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    backgroundColor: COLORS.card,
    marginRight: SPACING.md,
  },
  exploreCardPressed: {
    opacity: 0.92,
  },
  exploreImage: {
    ...StyleSheet.absoluteFillObject,
    width: EXPLORE_CARD_W,
    height: EXPLORE_CARD_H,
  },
  exploreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)",
  },
  exploreCardTitle: {
    position: "absolute",
    left: SPACING.sm,
    right: SPACING.sm,
    top: SPACING.sm,
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 13,
    lineHeight: 17,
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.input,
  },
  rowTitle: {
    flex: 1,
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 16,
    lineHeight: 22,
  },
  emptyWrap: {
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.md,
    alignItems: "center",
  },
  emptyTitle: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 16,
    textAlign: "center",
  },
  emptySub: {
    color: COLORS.mutedText,
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
});
