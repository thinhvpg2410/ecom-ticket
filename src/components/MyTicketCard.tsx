import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { MyTicket } from "../data";
import { COLORS, RADIUS, SPACING } from "../styles/theme";

export default function MyTicketCard({
  ticket,
  onPress,
}: {
  ticket: MyTicket;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <Image source={ticket.banner} style={styles.banner} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {ticket.title}
        </Text>
        <Text style={styles.location} numberOfLines={2}>
          {`Địa điểm`}
          {": "}
          {ticket.location}
        </Text>
        <Text style={styles.row}>
          {`Ngày`}
          {": "}
          {ticket.date}
        </Text>
        <Text style={styles.row}>
          {`Thời gian`}
          {": "}
          {ticket.time}
        </Text>
        <Text style={styles.bought}>
          {`Đã mua vào: `}
          {ticket.boughtAt}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  cardPressed: {
    opacity: 0.92,
  },
  banner: {
    width: 140,
    height: 140,
    backgroundColor: "#111111",
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 16,
    marginBottom: SPACING.xs,
  },
  location: {
    color: COLORS.mutedText,
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 16,
  },
  row: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 12,
    marginTop: 6,
  },
  bought: {
    color: COLORS.mutedText,
    fontWeight: "700",
    fontSize: 12,
    marginTop: SPACING.xs,
  },
});

