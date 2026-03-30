import React, { useMemo } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import type { RootStackParamList } from "../navigation/AppNavigator";
import { provinces } from "../data";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import { useEvents } from "../hooks/useEvents";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "ProvinceDetailScreen"
>;

export default function ProvinceDetailScreen({ route, navigation }: Props) {
  const { events } = useEvents();
  const province = useMemo(
    () => provinces.find((p) => p.id === route.params.provinceId),
    [route.params.provinceId],
  );
  const eventsByProvince = useMemo(() => {
    if (!province) return [];
    const provinceName = province.name.toLowerCase();
    return events.filter((event) => {
      if (event.location === "Other") {
        return !provinceName.includes("hà nội") && !provinceName.includes("hồ chí minh") && !provinceName.includes("đà nẵng");
      }
      if (event.location === "Hà Nội") {
        return provinceName.includes("hà nội");
      }
      if (event.location === "Hồ Chí Minh") {
        return provinceName.includes("hồ chí minh");
      }
      if (event.location === "Đà Nẵng") {
        return provinceName.includes("đà nẵng");
      }
      return false;
    });
  }, [events, province]);

  if (!province) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.error}>Không tìm thấy tỉnh/thành.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          <Text style={styles.backText}>Quay lại</Text>
        </Pressable>

        <Image source={{ uri: province.image }} style={styles.hero} />

        <View style={styles.card}>
          <Text style={styles.title}>{province.name}</Text>
          <Text style={styles.sub}>
            Sự kiện đang tổ chức tại {province.name}.
          </Text>

          <View style={styles.spacer} />

          {eventsByProvince.length === 0 ? (
            <Text style={styles.empty}>Hiện chưa có sự kiện cho tỉnh/thành này.</Text>
          ) : (
            eventsByProvince.map((event) => {
              const imageSource =
                typeof event.image === "string" ? { uri: event.image } : event.image;

              return (
                <Pressable
                  key={event.id}
                  style={({ pressed }) => [styles.eventCard, pressed && styles.eventCardPressed]}
                  onPress={() =>
                    navigation.navigate("EventDetailScreen", { eventId: event.id })
                  }
                >
                  <Image source={imageSource} style={styles.eventImage} />
                  <View style={styles.eventBody}>
                    <Text style={styles.eventTitle} numberOfLines={2}>
                      {event.title}
                    </Text>
                    <Text style={styles.eventMeta} numberOfLines={1}>
                      {event.date}
                    </Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl },
  backBtn: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: SPACING.md,
  },
  backBtnPressed: {
    opacity: 0.85,
  },
  backText: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 13,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: {
    color: COLORS.mutedText,
    fontWeight: "800",
    fontSize: 16,
    textAlign: "center",
  },
  hero: {
    width: "100%",
    height: 220,
    borderRadius: RADIUS.lg,
  },
  card: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "900",
  },
  sub: {
    color: COLORS.mutedText,
    marginTop: SPACING.sm,
    fontWeight: "700",
    lineHeight: 20,
  },
  spacer: { height: 24 },
  empty: {
    color: COLORS.mutedText,
    fontWeight: "700",
  },
  eventCard: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eventCardPressed: {
    opacity: 0.9,
  },
  eventImage: {
    width: "100%",
    height: 130,
  },
  eventBody: {
    padding: SPACING.md,
  },
  eventTitle: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 14,
  },
  eventMeta: {
    marginTop: 4,
    color: COLORS.mutedText,
    fontWeight: "700",
    fontSize: 12,
  },
});

