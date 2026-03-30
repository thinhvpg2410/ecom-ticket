import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../navigation/AppNavigator";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import { useEvents } from "../hooks/useEvents";

type Props = NativeStackScreenProps<RootStackParamList, "BookingScreen">;

export default function BookingScreen({ route, navigation }: Props) {
  const { eventId, ticketId } = route.params;
  const { events } = useEvents();

  const data = useMemo(() => {
    const event = events.find((e) => e.id === eventId);
    const ticket = event?.tickets.find((t) => t.id === ticketId);
    return { event, ticket };
  }, [eventId, ticketId]);

  const event = data.event;
  const ticket = data.ticket;

  const [quantity, setQuantity] = useState(1);

  if (!event || !ticket) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.error}>Không tìm thấy thông tin đặt vé.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const unitPrice = ticket.price;
  const total = unitPrice * quantity;

  const decrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increase = () => {
    setQuantity((prev) =>
      prev + 1 > ticket.remaining ? ticket.remaining : prev + 1,
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerCard}>
          <Image source={event.image} style={styles.hero} />
          <View style={styles.info}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.meta}>
              {ticket.name} • {formatVND(ticket.price)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chọn số lượng vé</Text>
          <Text style={styles.cardText}>
            Đơn giá: <Text style={styles.priceHighlight}>{formatVND(unitPrice)}</Text>
          </Text>
          <Text style={styles.remaining}>
            Còn lại: {ticket.remaining} vé
          </Text>

          <View style={styles.quantityRow}>
            <Pressable
              accessibilityRole="button"
              onPress={decrease}
              style={({ pressed }) => [
                styles.qtyBtn,
                pressed && styles.qtyBtnPressed,
              ]}
            >
              <Text style={styles.qtyLabel}>-</Text>
            </Pressable>

            <Text style={styles.qtyValue}>{quantity}</Text>

            <Pressable
              accessibilityRole="button"
              onPress={increase}
              style={({ pressed }) => [
                styles.qtyBtn,
                pressed && styles.qtyBtnPressed,
                quantity >= ticket.remaining && styles.qtyBtnDisabled,
              ]}
              disabled={quantity >= ticket.remaining}
            >
              <Text style={styles.qtyLabel}>+</Text>
            </Pressable>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng tiền</Text>
            <Text style={styles.totalValue}>{formatVND(total)}</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.btn,
              pressed && styles.btnPressed,
              quantity <= 0 && styles.btnDisabled,
            ]}
            disabled={quantity <= 0}
            onPress={() => {
              navigation.navigate("PaymentScreen", {
                eventId: event.id,
                ticketId: ticket.id,
                quantity,
              });
            }}
          >
            <Text style={styles.btnText}>Xác nhận</Text>
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
  scroll: { padding: SPACING.xl },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: COLORS.mutedText, fontWeight: "800", fontSize: 16, textAlign: "center" },
  headerCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  hero: { height: 200, width: "100%" },
  info: { padding: SPACING.xl },
  title: { color: COLORS.text, fontWeight: "900", fontSize: 22 },
  meta: { color: COLORS.mutedText, marginTop: SPACING.sm, fontWeight: "700" },
  card: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: { color: COLORS.text, fontWeight: "900", fontSize: 18 },
  cardText: { color: COLORS.mutedText, marginTop: SPACING.sm, fontWeight: "700", lineHeight: 22 },
  priceHighlight: { color: COLORS.primary, fontWeight: "900" },
  remaining: {
    color: COLORS.mutedText,
    marginTop: SPACING.xs,
    fontWeight: "700",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.lg,
    marginTop: SPACING.lg,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnPressed: { opacity: 0.85 },
  qtyBtnDisabled: { opacity: 0.5 },
  qtyLabel: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 20,
  },
  qtyValue: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 20,
    minWidth: 32,
    textAlign: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  totalLabel: {
    color: COLORS.mutedText,
    fontWeight: "700",
    fontSize: 14,
  },
  totalValue: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 18,
  },
  btn: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: COLORS.text, fontWeight: "900", fontSize: 16 },
});

