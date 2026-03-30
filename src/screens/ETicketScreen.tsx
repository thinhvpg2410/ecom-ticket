import React, { useMemo } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Barcode from "react-native-barcode-svg";
import QRCode from "react-native-qrcode-svg";

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

  const rawBarcodeValue = `ECOMTICKET-${ticket.id}`;
  const barcodeValue = toSafeCode39(rawBarcodeValue);
  const ticketCardBg = require("../../assets/ticketcard.png");

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
          <ImageBackground
            source={ticketCardBg}
            style={styles.ticketBg}
            resizeMode="stretch"
          />

          <View style={styles.ticketContent}>
            <View style={styles.barcodeWrap}>
              <Barcode
                value={barcodeValue}
                format="CODE39"
                height={72}
              />
            </View>

            <Text style={styles.ticketName}>{ticket.title}</Text>
            <View style={styles.divider} />

            <View style={styles.info}>
              <InfoRow label="ID" value={ticket.id} />
              <InfoRow label="Người mua" value={ticket.buyerName} />
              <InfoRow label="Email" value={ticket.buyerEmail} />
              <InfoRow label="SĐT" value={ticket.buyerPhone} />
              <InfoRow
                label="Giá vé"
                value={`${ticket.ticketPrice.toLocaleString("vi-VN")} đ`}
              />
              <InfoRow label="Địa điểm" value={ticket.location} />
              <InfoRow label="Ngày" value={ticket.date} />
              <InfoRow label="Thời gian" value={ticket.time} />
              <InfoRow label="Đã mua vào" value={ticket.boughtAt} />
            </View>

            <View style={styles.qrWrap}>
              <QRCode value={barcodeValue} size={120} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  error: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 16,
  },
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
    padding: SPACING.xl,
    paddingTop: 0,
  },
  ticketCard: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    minHeight: 520,
    position: "relative",
  },
  ticketBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
  },
  ticketContent: {
    position: "relative",
    paddingTop: 30,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  barcodeWrap: {
    width: "100%",
    alignItems: "center",
    marginTop: 0,
  },
  ticketName: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: SPACING.md,
    marginHorizontal: 0,
  },
  info: {
    marginTop: SPACING.md,
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  infoLabel: {
    fontWeight: "900",
    color: "#222",
    fontSize: 12,
  },
  infoValue: {
    fontWeight: "700",
    color: "#333",
    fontSize: 12,
    flexShrink: 1,
  },
  qrWrap: {
    marginTop: SPACING.xl,
    alignItems: "center",
    paddingBottom: SPACING.xl,
  },
});

function toSafeCode39(input: string) {
  // JsBarcode's CODE39 implementation does NOT support Code 39 Full ASCII shifts (e.g. '+A').
  // To avoid generating invalid SVG (NaN viewBox), we sanitize to an allowed subset for CODE39.
  // CODE39 allowed chars include: A-Z, 0-9, space, -, ., $, /, % (and '*'' as start/stop handled by lib).
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9 .\-$/%]/g, "")
    .trim();
}

