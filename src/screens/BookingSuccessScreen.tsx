import React, { useMemo } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../navigation/AppNavigator";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import { useEvents } from "../hooks/useEvents";

export default function BookingSuccessScreen({
  route,
  navigation,
}: RootStackScreenProps<"BookingSuccessScreen">) {
  const { eventId, ticketId, quantity, userTicketId } = route.params;
  const { events } = useEvents();

  const data = useMemo(() => {
    const event = events.find((e) => e.id === eventId);
    const ticket = event?.tickets.find((t) => t.id === ticketId);
    return { event, ticket };
  }, [eventId, ticketId]);

  const event = data.event;
  const ticket = data.ticket;

  const unitPrice = ticket?.price ?? 0;
  const total = unitPrice * quantity;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.checkOuter}>
            <View style={styles.checkInner}>
              <Ionicons name="checkmark" size={34} color={COLORS.text} />
            </View>
          </View>

          <Text style={styles.title}>Đặt vé thành công</Text>
          <Text style={styles.subtitle}>
            Cảm ơn bạn. Vé điện tử đã được tạo và sẵn sàng sử dụng.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin đơn</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>Sự kiện</Text>
            <Text style={styles.value} numberOfLines={2}>
              {event?.title ?? "—"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>Loại vé</Text>
            <Text style={styles.value}>{ticket?.name ?? "—"}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>Số lượng</Text>
            <Text style={styles.value}>{quantity}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>Tổng tiền</Text>
            <Text style={styles.total}>{formatVND(total)}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.hint}>
            Bạn có thể xem vé trong mục “Vé của tôi” hoặc mở e-ticket ngay.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate("MainTabs")}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryText}>Xem vé của tôi</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (userTicketId) {
                navigation.navigate("ETicketScreen", { ticketId: userTicketId });
                return;
              }
              navigation.navigate("MainTabs");
            }}
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.secondaryText}>Mở e-ticket</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatVND(value: number) {
  return `${value.toLocaleString("vi-VN")} đ`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: 120,
  },
  hero: {
    alignItems: "center",
  },
  checkOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(229,9,20,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: SPACING.lg,
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 26,
    textAlign: "center",
  },
  subtitle: {
    marginTop: SPACING.sm,
    color: COLORS.mutedText,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
  card: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
  },
  cardTitle: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 18,
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.lg,
    marginTop: SPACING.sm,
  },
  label: {
    color: COLORS.mutedText,
    fontWeight: "700",
    width: 90,
  },
  value: {
    color: COLORS.text,
    fontWeight: "800",
    flex: 1,
    textAlign: "right",
  },
  total: {
    color: COLORS.primary,
    fontWeight: "900",
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  hint: {
    color: COLORS.mutedText,
    fontWeight: "700",
    lineHeight: 22,
  },
  actions: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryText: { color: COLORS.text, fontWeight: "900", fontSize: 16 },
  secondaryBtn: {
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  secondaryText: { color: COLORS.primary, fontWeight: "900", fontSize: 16 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
});

