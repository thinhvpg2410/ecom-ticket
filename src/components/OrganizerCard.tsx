import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import type { Organizer } from "../data";
import { COLORS, RADIUS, SPACING } from "../styles/theme";

export default function OrganizerCard({ organizer }: { organizer: Organizer }) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Nhà tổ chức</Text>

      <View style={styles.row}>
        <View style={styles.logoWrap}>
          <Image source={organizer.logo} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.textWrap}>
          <Text style={styles.name} numberOfLines={2}>
            {organizer.name}
          </Text>
          <Text style={styles.sub}>Đơn vị tổ chức sự kiện</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heading: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 18,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101318",
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    padding: 6,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  textWrap: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 16,
  },
  sub: {
    marginTop: 4,
    color: COLORS.mutedText,
    fontWeight: "600",
    fontSize: 13,
  },
});

