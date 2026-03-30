import React, { useMemo } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import {
  featuredProvinces,
  otherProvinces,
  type EventCategory,
  type EventItem,
  type Province,
} from "../data";
import ProvinceCard from "../components/ProvinceCard";
import OtherCard from "../components/OtherCard";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import { useEvents } from "../hooks/useEvents";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.62);
const CARD_GAP = SPACING.md;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

const LOCATION_CARD_HEIGHT = 170;

type EventSectionKey = EventCategory | "Xu hướng";

const EVENT_SECTIONS: EventSectionKey[] = [
  "Xu hướng",
  "Tham quan & trải nghiệm",
  "Sân khấu & nghệ thuật",
  "Thể thao",
];

function EventCard({ item, onPress }: { item: EventItem; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardDate} numberOfLines={2}>
          {item.date}
        </Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { events: eventsData } = useEvents();

  const dataByCategory = useMemo(() => {
    const map = new Map<EventSectionKey, EventItem[]>();
    for (const s of EVENT_SECTIONS) map.set(s, []);
    for (const ev of eventsData) {
      if (ev.isTrending) {
        map.get("Xu hướng")?.push(ev);
      }
      map.get(ev.category)?.push(ev);
    }
    return map;
  }, [eventsData]);

  const locationCards = useMemo(() => {
    type LocationCardItem =
      | { type: "province"; province: Province }
      | { type: "other" };

    const cards: LocationCardItem[] = [
      ...featuredProvinces.map(
        (province): LocationCardItem => ({
          type: "province",
          province,
        }),
      ),
      { type: "other" },
    ];

    return cards;
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {EVENT_SECTIONS.map((title) => {
          const items = dataByCategory.get(title) ?? [];
          if (items.length === 0) return null;

          return (
            <View key={title} style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    navigation
                      .getParent()
                      ?.navigate("EventCategoryScreen", {
                        category: title,
                        title,
                      })
                  }
                  style={({ pressed }) => [
                    styles.moreBtn,
                    pressed && styles.moreBtnPressed,
                  ]}
                >
                  <Text style={styles.moreText}>Xem thêm</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={COLORS.primary}
                  />
                </Pressable>
              </View>

              <FlatList
                data={items}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <EventCard
                    item={item}
                    onPress={() =>
                      navigation.getParent()?.navigate("EventDetailScreen", {
                        eventId: item.id,
                      })
                    }
                  />
                )}
                snapToAlignment="start"
                snapToInterval={SNAP_INTERVAL}
                decelerationRate="fast"
                scrollEventThrottle={16}
                nestedScrollEnabled
              />
            </View>
          );
        })}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vị trí</Text>

          <FlatList
            data={locationCards}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, idx) =>
              item.type === "other" ? `other-${idx}` : item.province.id
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              if (item.type === "other") {
                return (
                  <OtherCard
                    style={styles.locationCard}
                    onPress={() =>
                      navigation.getParent()?.navigate("ProvinceListScreen", {
                        provinces: otherProvinces,
                      })
                    }
                  />
                );
              }

              return (
                <ProvinceCard
                  province={item.province}
                  onPress={() =>
                    navigation.getParent()?.navigate("ProvinceDetailScreen", {
                      provinceId: item.province.id,
                    })
                  }
                  style={styles.locationCard}
                  imageStyle={styles.locationImage}
                />
              );
            }}
            snapToAlignment="start"
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            scrollEventThrottle={16}
            nestedScrollEnabled
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  section: { marginBottom: SPACING.xl },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 18,
  },
  moreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  moreBtnPressed: {
    opacity: 0.8,
  },
  moreText: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 13,
  },
  listContent: {
    paddingBottom: SPACING.xs,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    overflow: "hidden",
    marginRight: CARD_GAP,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  cardImage: { height: 150, width: "100%" },
  cardBody: { padding: SPACING.sm },
  cardTitle: { color: COLORS.text, fontWeight: "900", fontSize: 14 },
  cardDate: { color: "#DF2C2C", fontSize: 14, paddingTop: 4},
  locationCard: {
    width: CARD_WIDTH,
    height: LOCATION_CARD_HEIGHT,
    marginRight: CARD_GAP,
  },
  locationImage: {
    height: LOCATION_CARD_HEIGHT,
  },
});

