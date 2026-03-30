import React, { useMemo } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../navigation/AppNavigator";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import { type EventCategory, type EventItem } from "../data";
import { useEvents } from "../hooks/useEvents";

type Props = RootStackScreenProps<"EventCategoryScreen">;

export default function EventCategoryScreen({ route, navigation }: Props) {
  const { category, title } = route.params;
  const { events } = useEvents();

  const data = useMemo(
    () =>
      category === "Xu hướng"
        ? events.filter((e) => e.isTrending)
        : events.filter((e) => e.category === category),
    [category, events],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backPressed]}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EventCard
            item={item}
            onPress={() =>
              navigation.navigate("EventDetailScreen", { eventId: item.id })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

function EventCard({
  item,
  onPress,
}: {
  item: EventItem;
  onPress: () => void;
}) {
  const prices = item.tickets.map((t) => t.price);
  const minPrice = Math.min(...prices);
  const imageSource = typeof item.image === "string" ? { uri: item.image } : item.image;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image source={imageSource} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.time} numberOfLines={1}>
          {item.date}
        </Text>
        <Text style={styles.price}>
          Giá: {minPrice.toLocaleString("vi-VN")} VND
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  backPressed: {
    opacity: 0.85,
  },
  headerTitle: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 22,
    marginLeft: SPACING.md,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  card: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPressed: { opacity: 0.9 },
  image: {
    width: "100%",
    height: 180,
  },
  body: {
    padding: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    color: COLORS.mutedText,
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 4,
  },
  price: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 13,
  },
});

