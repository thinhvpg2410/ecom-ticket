import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { Ticket } from "../data";
import { COLORS, RADIUS, SPACING } from "../styles/theme";

export type TicketCardProps = {
  ticket: Ticket;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
};

export default function TicketCard({
  ticket,
  selected,
  disabled,
  onPress,
}: TicketCardProps) {
  const soldOut = ticket.remaining <= 0;
  const isDisabled = disabled || soldOut;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.name}>{ticket.name}</Text>
        <Text style={styles.price}>{formatVND(ticket.price)}</Text>
      </View>

      <Text style={styles.remaining}>
        {soldOut ? "Hết vé" : `Còn ${ticket.remaining} vé`}
      </Text>

      {ticket.benefits && ticket.benefits.length > 0 ? (
        <View style={styles.benefits}>
          {ticket.benefits.map((b, idx) => (
            <Text key={`${ticket.id}-b-${idx}`} style={styles.benefit}>
              • {b}
            </Text>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

function formatVND(value: number) {
  return `${value.toLocaleString("vi-VN")} đ`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  selected: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 16,
    flex: 1,
    paddingRight: SPACING.sm,
  },
  price: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 14,
  },
  remaining: {
    color: COLORS.mutedText,
    fontWeight: "800",
    marginTop: SPACING.xs,
  },
  benefits: {
    marginTop: SPACING.sm,
  },
  benefit: {
    color: COLORS.mutedText,
    fontWeight: "700",
    lineHeight: 20,
  },
});

