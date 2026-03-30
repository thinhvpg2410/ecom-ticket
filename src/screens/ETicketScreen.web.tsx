import React, { useMemo } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import type { RootStackParamList } from "../navigation/AppNavigator";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import { useMyTickets } from "../hooks/useMyTickets";

type Props = NativeStackScreenProps<RootStackParamList, "ETicketScreen">;

export default function ETicketScreen({ route }: Props) {
  const navigation = useNavigation<any>();
  const { ticketId } = route.params;
  const { tickets, loading } = useMyTickets();

  const ticket = useMemo(() => {
    return tickets.find((item) => item.id === ticketId) ?? null;
  }, [ticketId, tickets]);

  if (loading) {
    return (
      <View style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.error}>Đang tải vé...</Text>
        </View>
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.error}>Không tìm thấy vé.</Text>
        </View>
      </View>
    );
  }

  const barcodeValue = `ECOMTICKET-${ticket.id}`;

  return (
    <View style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.topTitle}>Ticket</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.ticketCard}>
          <View style={styles.topNotch} />

          <View style={styles.barcodePlaceholder}>
            <Text style={styles.placeholderText}>BARCODE</Text>
            <Text style={styles.placeholderSub} numberOfLines={2}>
              {barcodeValue}
            </Text>
          </View>

          <Text style={styles.ticketName}>{ticket.title}</Text>

          <View style={styles.divider} />

          <View style={styles.info}>
            <InfoRow label="ID" value={ticket.id} />
            <InfoRow label="Địa điểm" value={ticket.location} />
            <InfoRow label="Ngày" value={ticket.date} />
            <InfoRow label="Thời gian" value={ticket.time} />
            <InfoRow label="Đã mua vào" value={ticket.boughtAt} />
          </View>

          <View style={styles.qrPlaceholder}>
            <Text style={styles.placeholderText}>QR</Text>
          </View>

          <View style={styles.bottomNotch} />
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: COLORS.text, fontWeight: "900", fontSize: 16 },
  topBar: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 26,
    marginLeft: SPACING.xl,
  },
  scroll: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  ticketCard: {
    backgroundColor: COLORS.text,
    borderRadius: 18,
    overflow: "hidden",
    paddingTop: 16,
    paddingBottom: 18,
    minHeight: 560,
  },
  topNotch: {
    position: "absolute",
    top: -22,
    left: 0,
    right: 0,
    height: 44,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  bottomNotch: {
    position: "absolute",
    bottom: -22,
    left: 0,
    right: 0,
    height: 44,
    backgroundColor: COLORS.primary,
  },
  barcodePlaceholder: {
    height: 160,
    marginHorizontal: 14,
    marginTop: 36,
    borderRadius: 12,
    backgroundColor: "#F3F3F3",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: SPACING.xl, marginVertical: SPACING.md },
  ticketName: {
    marginTop: SPACING.lg,
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.primary,
    textAlign: "center",
    paddingHorizontal: SPACING.lg,
  },
  info: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    gap: 10,
  },
  infoRow: { flexDirection: "row", gap: 6, alignItems: "flex-start" },
  infoLabel: { fontWeight: "900", color: "#222", fontSize: 12 },
  infoValue: { color: "#333", fontWeight: "700", fontSize: 12, flex: 1 },
  qrPlaceholder: {
    position: "absolute",
    bottom: 92,
    alignSelf: "center",
    width: 110,
    height: 110,
    borderRadius: 16,
    backgroundColor: "#F3F3F3",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: { color: COLORS.primary, fontWeight: "900", fontSize: 18 },
  placeholderSub: { color: "#555", fontWeight: "700", fontSize: 11, marginTop: 6 },
});

