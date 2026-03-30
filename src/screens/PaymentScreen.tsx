import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import type { RootStackScreenProps } from "../navigation/AppNavigator";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import { useEvents } from "../hooks/useEvents";
import { useUserContext } from "../context/UserContext";
import { purchaseTicket } from "../services/ticketingService";
import type { PaymentMethod } from "../mockData";
import { listPaymentMethodsForUser } from "../services/paymentMethodsService";

export default function PaymentScreen({
  route,
  navigation,
}: RootStackScreenProps<"PaymentScreen">) {
  const { eventId, ticketId, quantity } = route.params;
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [methodsError, setMethodsError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { events } = useEvents();
  const { currentUser } = useUserContext();

  const data = useMemo(() => {
    const event = events.find((e) => e.id === eventId);
    const ticket = event?.tickets.find((t) => t.id === ticketId);
    return { event, ticket };
  }, [eventId, ticketId]);

  const event = data.event;
  const ticket = data.ticket;
  const selectedMethod = methods.find((item) => item.id === selectedMethodId) ?? null;

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadPaymentMethods = async () => {
        if (!currentUser) {
          if (!active) {
            return;
          }
          setMethods([]);
          setSelectedMethodId(null);
          setMethodsLoading(false);
          return;
        }

        if (active) {
          setMethodsLoading(true);
          setMethodsError(null);
        }

        try {
          const list = await listPaymentMethodsForUser(currentUser.id);
          if (!active) {
            return;
          }

          setMethods(list);
          if (!list.length) {
            setSelectedMethodId(null);
            return;
          }

          setSelectedMethodId((prev) => {
            const stillExists = prev && list.some((item) => item.id === prev);
            if (stillExists) {
              return prev;
            }
            const preferred = list.find((item) => item.isDefault) ?? list[0];
            return preferred.id;
          });
        } catch (error) {
          if (!active) {
            return;
          }
          const message =
            error instanceof Error
              ? error.message
              : "Không tải được phương thức thanh toán.";
          setMethodsError(message);
        } finally {
          if (active) {
            setMethodsLoading(false);
          }
        }
      };

      void loadPaymentMethods();

      return () => {
        active = false;
      };
    }, [currentUser]),
  );

  if (!event || !ticket) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.error}>Không tìm thấy thông tin thanh toán.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const unitPrice = ticket.price;
  const subtotal = unitPrice * quantity;
  const total = subtotal;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backPressed]}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Thanh toán</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.summaryCard}>
          <Image source={event.image} style={styles.hero} />
          <View style={styles.summaryOverlay} />

          <View style={styles.summaryContent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventLocation}>{event.location}</Text>

            <View style={styles.line} />

            <View style={styles.row}>
              <Text style={styles.label}>Đơn giá</Text>
              <Text style={styles.value}>{formatVND(unitPrice)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Số lượng</Text>
              <Text style={styles.value}>{quantity}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tạm tính</Text>
              <Text style={styles.value}>{formatVND(subtotal)}</Text>
            </View>

            <View style={styles.line} />

            <View style={styles.row}>
              <Text style={styles.totalLabel}>Tổng tiền:</Text>
              <Text style={styles.totalValue}>{formatVND(total)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.methodsWrap}>
          <Text style={styles.methodsTitle}>Phương thức thanh toán</Text>

          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.addMethodBtn, pressed && styles.methodPressed]}
            onPress={() => navigation.navigate("BankLinkScreen")}
          >
            <Ionicons name="add-circle-outline" size={18} color={COLORS.text} />
            <Text style={styles.addMethodText}>Thêm phương thức</Text>
          </Pressable>

          {methodsLoading ? (
            <View style={styles.methodsState}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : methodsError ? (
            <View style={styles.methodsState}>
              <Text style={styles.methodsError}>{methodsError}</Text>
            </View>
          ) : methods.length === 0 ? (
            <View style={styles.methodsState}>
              <Text style={styles.methodsEmpty}>
                Bạn chưa có phương thức thanh toán. Vui lòng thêm phương thức để tiếp tục.
              </Text>
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [styles.emptyActionBtn, pressed && styles.methodPressed]}
                onPress={() => navigation.navigate("BankLinkScreen")}
              >
                <Text style={styles.emptyActionText}>Thêm phương thức</Text>
              </Pressable>
            </View>
          ) : (
            methods.map((item) => (
              <PaymentMethodRow
                key={item.id}
                selected={selectedMethodId === item.id}
                label={buildPaymentLabel(item)}
                onPress={() => setSelectedMethodId(item.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          disabled={submitting}
          style={({ pressed }) => [
            styles.payBtn,
            pressed && !submitting && styles.payBtnPressed,
            submitting && styles.payBtnDisabled,
          ]}
          onPress={async () => {
            if (!currentUser) {
              return;
            }
            if (!selectedMethod) {
              alert("Vui lòng thêm và chọn phương thức thanh toán.");
              return;
            }

            try {
              setSubmitting(true);
              const result = await purchaseTicket({
                userId: currentUser.id,
                ticketId,
                quantity,
                method: selectedMethod.type,
                providerLabel: selectedMethod.providerLabel,
              });

              navigation.navigate("BookingSuccessScreen", {
                eventId,
                ticketId,
                quantity,
                userTicketId: result.firstUserTicketId,
                orderId: result.orderId,
              });
            } catch (error) {
              const message =
                error instanceof Error ? error.message : "Thanh toán thất bại. Vui lòng thử lại.";
              alert(message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Text style={styles.payBtnText}>
            {submitting ? "ĐANG XỬ LÝ..." : "THANH TOÁN"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function PaymentMethodRow({
  selected,
  label,
  onPress,
}: {
  selected: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.methodCard,
        selected && styles.methodSelected,
        pressed && styles.methodPressed,
      ]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>

      <Text style={[styles.methodText, selected && styles.methodTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

function formatVND(value: number) {
  return `${value.toLocaleString("vi-VN")} đ`;
}

function buildPaymentLabel(method: PaymentMethod) {
  if (method.type === "momo") {
    const tail = method.walletPhone ? ` •••• ${method.walletPhone.slice(-4)}` : "";
    return `Ví MoMo${tail}`;
  }
  if (method.type === "visa") {
    return method.providerLabel;
  }
  return method.providerLabel || "VN Pay/Ứng dụng ngân hàng";
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xl },
  error: { color: COLORS.text, fontWeight: "800", fontSize: 16, textAlign: "center" },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  backPressed: { opacity: 0.8 },
  headerTitle: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: "900",
    marginLeft: SPACING.md,
  },
  scroll: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 120,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hero: {
    width: "100%",
    height: 180,
  },
  summaryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    height: 180,
  },
  summaryContent: {
    padding: SPACING.lg,
    backgroundColor: "#000000",
  },
  eventTitle: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 26,
  },
  eventLocation: {
    color: COLORS.mutedText,
    fontWeight: "700",
    marginTop: SPACING.sm,
  },
  line: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  label: { color: COLORS.mutedText, fontWeight: "700", fontSize: 16 },
  value: { color: COLORS.text, fontWeight: "900", fontSize: 16 },
  totalLabel: { color: COLORS.text, fontWeight: "900", fontSize: 30 },
  totalValue: { color: COLORS.text, fontWeight: "900", fontSize: 20 },
  methodsWrap: {
    marginTop: SPACING.xl,
  },
  methodsTitle: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 28,
    marginBottom: SPACING.md,
  },
  addMethodBtn: {
    backgroundColor: "#1f1f1f",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addMethodText: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 15,
  },
  methodsState: {
    backgroundColor: "#121212",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    alignItems: "center",
    gap: SPACING.md,
  },
  methodsError: {
    color: "#ff8f8f",
    fontWeight: "700",
    textAlign: "center",
  },
  methodsEmpty: {
    color: COLORS.mutedText,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 22,
  },
  emptyActionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
  },
  emptyActionText: {
    color: COLORS.text,
    fontWeight: "900",
  },
  methodCard: {
    borderRadius: 20,
    backgroundColor: COLORS.text,
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  methodSelected: {
    backgroundColor: COLORS.primary,
  },
  methodPressed: { opacity: 0.9 },
  radio: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.text,
  },
  radioSelected: {
    borderColor: "#111",
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#000",
  },
  methodText: {
    marginLeft: SPACING.md,
    color: "#000",
    fontWeight: "900",
    fontSize: 20,
  },
  methodTextSelected: {
    color: COLORS.text,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 0,
    paddingBottom: 0,
    backgroundColor: "transparent",
  },
  payBtn: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    height: 78,
  },
  payBtnPressed: {
    opacity: 0.9,
  },
  payBtnDisabled: {
    opacity: 0.65,
  },
  payBtnText: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "900",
  },
});

