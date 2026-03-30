import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import type { Organizer } from "../data";
import { COLORS, RADIUS, SPACING } from "../styles/theme";

export default function OrganizerCard({ organizer }: { organizer: Organizer }) {
  return (
    <View style={styles.card}>
      <View style={styles.logoWrap}>
        <Image source={organizer.logo} style={styles.logo} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.name}>{organizer.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    overflow: "hidden",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  textWrap: {
    marginTop: SPACING.md,
  },
  name: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 16,
    textAlign: "center",
  },
});

